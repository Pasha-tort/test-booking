import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OutBoxProcessStatusEnum,
  OutBoxSendingStatusEnum,
} from '@libs/database';
import { OutBoxEntity } from '../../../entities';
import { CustomError, snakeToCamel } from '@libs/common';
import { Readable } from 'stream';

@Injectable()
export class OutBoxRepository {
  private readonly alias = 'outbox';
  private readonly allowedProcessStatus: Record<
    OutBoxProcessStatusEnum,
    OutBoxProcessStatusEnum[]
  > = {
    [OutBoxProcessStatusEnum.PENDING]: [OutBoxProcessStatusEnum.PROCESSED],
    [OutBoxProcessStatusEnum.PROCESSED]: [OutBoxProcessStatusEnum.FINISH],
    [OutBoxProcessStatusEnum.FINISH]: [],
  };
  private readonly allowedSendingStatus: Record<
    OutBoxSendingStatusEnum,
    OutBoxSendingStatusEnum[]
  > = {
    [OutBoxSendingStatusEnum.PENDING]: [OutBoxSendingStatusEnum.SENT],
    [OutBoxSendingStatusEnum.SENT]: [],
  };

  constructor(
    @InjectRepository(OutBoxEntity)
    private readonly outBoxRepository: Repository<OutBoxEntity>,
    private readonly dataSource: DataSource,
  ) {
    this.deleteAllOldEvents();
  }

  private snakeToCamelForVault(
    data: unknown,
    strictSubstitution?: { [k in string]: string },
  ) {
    return this.outBoxRepository.create(
      Object.fromEntries(
        Object.entries(data).map(([key, val]) => [
          strictSubstitution?.[key] ?? snakeToCamel(key, `${this.alias}_`),
          val,
        ]),
      ),
    );
  }

  async updateStatus({
    outboxId,
    statusProcess,
    statusSending,
  }: {
    outboxId: string;
    statusProcess?: OutBoxProcessStatusEnum;
    statusSending?: OutBoxSendingStatusEnum;
  }) {
    if (!statusProcess && !statusSending) return;

    return this.dataSource.transaction(async em => {
      const event = await em.findOneBy(OutBoxEntity, { id: outboxId });

      if (statusProcess) {
        const allowed = this.allowedProcessStatus[event.statusProcess] || [];
        if (!allowed.includes(statusProcess)) {
          throw new CustomError(
            `Invalid status process transition: ${event.statusProcess} → ${statusProcess}`,
          );
        }
        event.statusProcess = statusProcess;
      }

      if (statusSending) {
        const allowed = this.allowedSendingStatus[event.statusSending] || [];
        if (!allowed.includes(statusSending)) {
          throw new CustomError(
            `Invalid status sending transition: ${event.statusSending} → ${statusSending}`,
          );
        }
        event.statusSending = statusSending;
      }
      return em.save(OutBoxEntity, event);
    });
  }

  async *getAllEventsNoProcessingGenerator() {
    const query = this.outBoxRepository.createQueryBuilder(this.alias);
    const stream = await query.stream();
    const readable = stream as Readable;

    try {
      for await (const row of readable) {
        yield this.snakeToCamelForVault(row);
      }
    } finally {
      readable.destroy();
    }
  }

  async deleteAllOldEvents() {
    await this.outBoxRepository.delete({
      statusSending: OutBoxSendingStatusEnum.SENT,
      statusProcess: OutBoxProcessStatusEnum.FINISH,
    });
  }
}
