import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
