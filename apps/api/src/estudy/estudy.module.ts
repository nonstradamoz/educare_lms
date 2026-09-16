import { Module } from '@nestjs/common';
import { EstudyController } from './estudy.controller';
import { EstudyService } from './estudy.service';

import { PrismaService } from '../database/prisma.service';
@Module({
  controllers: [EstudyController],
  providers: [EstudyService, PrismaService]
})
export class EstudyModule {}
