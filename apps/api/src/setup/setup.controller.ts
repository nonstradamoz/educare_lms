import { Controller, Get, Post, Body, Query, Delete, Param } from '@nestjs/common';
import { SetupService } from './setup.service';

@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Get('centres')
  getCentres() {
    return this.setupService.getCentres();
  }

  @Post('centres')
  createCentre(@Body() data: any) {
    return this.setupService.createCentre(data);
  }

  @Get('academic-years')
  getAcademicYears() {
    return this.setupService.getAcademicYears();
  }

  @Post('academic-years')
  createAcademicYear(@Body() data: any) {
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    return this.setupService.createAcademicYear(data);
  }

  @Get('boards')
  getBoards() {
    return this.setupService.getBoards();
  }

  @Post('boards')
  createBoard(@Body() data: any) {
    return this.setupService.createBoard(data);
  }

  @Get('standards')
  getStandards(@Query('boardId') boardId?: string) {
    return this.setupService.getStandards(boardId);
  }

  @Post('standards')
  createStandard(@Body() data: any) {
    if (data.level) data.level = Number(data.level);
    return this.setupService.createStandard(data);
  }

  @Get('subjects')
  getSubjects() {
    return this.setupService.getSubjects();
  }

  @Post('subjects')
  createSubject(@Body() data: any) {
    return this.setupService.createSubject(data);
  }

  @Get('syllabi')
  getSyllabi(@Query('boardId') boardId?: string, @Query('standardId') standardId?: string) {
    return this.setupService.getSyllabi(boardId, standardId);
  }

  @Post('syllabi')
  createSyllabus(@Body() data: any) {
    return this.setupService.createSyllabus(data);
  }

  @Get('chapters')
  getChapters(@Query('syllabusId') syllabusId?: string) {
    return this.setupService.getChapters(syllabusId);
  }

  @Post('chapters')
  createChapter(@Body() data: any) {
    return this.setupService.createChapter(data);
  }

  @Get('topics')
  getTopics(@Query('chapterId') chapterId?: string) {
    return this.setupService.getTopics(chapterId);
  }

  @Post('topics')
  createTopic(@Body() data: any) {
    return this.setupService.createTopic(data);
  }

  @Get('subtopics')
  getSubtopics(@Query('topicId') topicId?: string) {
    return this.setupService.getSubtopics(topicId);
  }

  @Post('subtopics')
  createSubtopic(@Body() data: any) {
    return this.setupService.createSubtopic(data);
  }

  // DELETE endpoints for hierarchy
  @Delete('subjects/:id')
  deleteSubject(@Param('id') id: string) {
    return this.setupService.deleteSubject(id);
  }

  @Delete('syllabi/:id')
  deleteSyllabus(@Param('id') id: string) {
    return this.setupService.deleteSyllabus(id);
  }

  @Delete('chapters/:id')
  deleteChapter(@Param('id') id: string) {
    return this.setupService.deleteChapter(id);
  }

  @Delete('topics/:id')
  deleteTopic(@Param('id') id: string) {
    return this.setupService.deleteTopic(id);
  }

  @Delete('subtopics/:id')
  deleteSubtopic(@Param('id') id: string) {
    return this.setupService.deleteSubtopic(id);
  }
}
