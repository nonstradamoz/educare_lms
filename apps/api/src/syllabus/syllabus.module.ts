import { Module } from '@nestjs/common';
import { SyllabusController } from './syllabus.controller';
import { ConfigController } from './config.controller';
import { SyllabusService } from './syllabus.service';
import { ProgressService } from './progress.service';
import { RevisionService } from './revision.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SyllabusController, ConfigController],
  providers: [SyllabusService, ProgressService, RevisionService],
  exports: [SyllabusService, ProgressService, RevisionService],
})
export class SyllabusModule {}
