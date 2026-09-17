import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { StorageService } from '../storage/storage.service';

@Controller('exams')
export class ExamsController {
  constructor(
    private readonly examsService: ExamsService,
    private readonly storageService: StorageService
  ) {}

  @Get()
  getExams(): Promise<any> {
    return this.examsService.getExams();
  }

  @Post()
  createExam(@Body() data: any) {
    return this.examsService.createExam(data);
  }

  @Get('mcq')
  getMcqQuestions(): Promise<any> {
    return this.examsService.getMcqQuestions();
  }

  @Post('mcq')
  createMcqQuestion(@Body() data: any): Promise<any> {
    return this.examsService.createMcqQuestion(data);
  }

  @Get('upload-url')
  getUploadUrl(
    @Query('filename') filename: string,
    @Query('contentType') contentType: string,
  ) {
    return this.storageService.getPresignedUploadUrl(filename, contentType);
  }
}
