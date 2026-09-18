import { Module } from '@nestjs/common';
import { LiveClassController } from './live-class.controller';
import { LiveClassService } from './live-class.service';
import { PrismaService } from '../database/prisma.service';

import { LiveKitService } from './livekit.service';

@Module({
  controllers: [LiveClassController],
  providers: [LiveClassService, PrismaService, LiveKitService],
})
export class LiveClassModule {}
