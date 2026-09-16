import { Module } from '@nestjs/common';
import { SetupService } from './setup.service';
import { SetupController } from './setup.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SetupController],
  providers: [SetupService],
})
export class SetupModule {}
