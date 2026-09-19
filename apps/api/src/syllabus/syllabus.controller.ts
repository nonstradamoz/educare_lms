import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { SyllabusService } from './syllabus.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('syllabus')
export class SyllabusController {
  constructor(private readonly syllabusService: SyllabusService) {}

  @Get('progress/:batchId')
  getProgress(@Param('batchId') batchId: string) {
    return this.syllabusService.getBatchSyllabusProgress(batchId);
  }

  @Post('progress/chapter')
  updateChapterProgress(@Body() data: { batchId: string; chapterId: string; status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' }, @Req() req: any) {
    return this.syllabusService.updateChapterProgress(data.batchId, data.chapterId, data.status, req.user.id);
  }

  @Post('progress/topic')
  updateTopicProgress(@Body() data: { batchId: string; topicId: string; status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' }, @Req() req: any) {
    return this.syllabusService.updateTopicProgress(data.batchId, data.topicId, data.status, req.user.id);
  }
}
