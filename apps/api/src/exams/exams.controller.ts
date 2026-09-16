import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExamsService } from './exams.service';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

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
}
