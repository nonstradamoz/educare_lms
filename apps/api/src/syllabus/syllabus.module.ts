import { Module } from '@nestjs/common';
import { SyllabusController } from './syllabus.controller';
import { SyllabusService } from './syllabus.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SyllabusController],
  providers: [SyllabusService],
  exports: [SyllabusService],
})
export class SyllabusModule {}
