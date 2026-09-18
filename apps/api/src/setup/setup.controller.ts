import { Controller, Get, Post, Body, Query } from '@nestjs/common';
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
  getStandards() {
    return this.setupService.getStandards();
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
  getSyllabi() {
    return this.setupService.getSyllabi();
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
}
