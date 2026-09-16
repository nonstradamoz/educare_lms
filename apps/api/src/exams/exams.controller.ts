import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExamsService } from './exams.service';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  getExams() {
    return this.examsService.getExams();
  }

  @Post()
  createExam(@Body() data: any) {
    return this.examsService.createExam(data);
  }

  @Get('mcq')
  getMcqQuestions() {
    return this.examsService.getMcqQuestions();
  }

  @Post('mcq')
  createMcqQuestion(@Body() data: any) {
    return this.examsService.createMcqQuestion(data);
  }
}
