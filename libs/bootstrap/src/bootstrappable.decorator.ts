import { AppKey } from '@libs/configuration/interfaces';
import { SetMetadata } from '@nestjs/common';

export const Bootstrappable = (appKey: AppKey) => SetMetadata('appKey', appKey);
