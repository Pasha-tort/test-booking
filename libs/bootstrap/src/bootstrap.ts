import { NestFactory, Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppKey, IMicroservice } from '@libs/configuration/interfaces';
import { MicroservicesConfig } from '@libs/configuration';

class Microservice {
  private appKey: AppKey;
  private config: IMicroservice;
  private app: NestExpressApplication;
  private logger: Logger;

  constructor(private readonly appModule: any) {
    this.getAppKey();
    this.setupLogger();
    this.getConfig();
  }

  private getAppKey() {
    this.appKey = Reflect.getMetadata('appKey', this.appModule);
    if (!this.appKey) {
      throw new Error(
        `Class ${this.appModule.name} missing appKey metadata property`,
      );
    }
  }

  private setupLogger() {
    const ctx = `${this.appKey.replace(/^\w/, c =>
      c.toUpperCase(),
    )}Microservice`;
    this.logger = new Logger(ctx, { timestamp: true });
  }

  private getConfig() {
    this.config = MicroservicesConfig[this.appKey];
    if (!this.config) {
      throw new Error(`Missing config for microservice ${this.appKey}`);
    }
  }

  async run() {
    try {
      this.app = await NestFactory.create<NestExpressApplication>(
        this.appModule,
        {
          rawBody: true,
        },
      );
      this.app.setGlobalPrefix('api');

      this.setupPipes();
      this.setupInterceptors();
      this.config.swaggerEnable && (await this.setupDocumentation());

      await this.app.listen(this.config.port);
      this.logger.log(`Listening on port ${this.config.port}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async setupDocumentation() {
    const openApiConfig = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Booking API')
      .setDescription('Backend for booking api service')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(this.app, openApiConfig);
    SwaggerModule.setup(`swagger/${this.appKey}`, this.app, document);

    this.app
      .getHttpAdapter()
      .getInstance()
      .get('/swagger.json', (_, res) => {
        res.json(document);
      });
  }

  private setupPipes() {
    this.app.useGlobalPipes(new ValidationPipe({ transform: true }));
  }

  private setupInterceptors() {
    this.app.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.app.get(Reflector)),
    );
  }
}

export async function bootstrap(appModule: unknown) {
  await new Microservice(appModule).run();
}
