import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN')
  @Get('fees')
  getFeeReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.reportService.getFeeCollectionReport(startDate, endDate);
  }

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN')
  @Get('finance')
  getFinanceReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.reportService.getExpenseIncomeReport(startDate, endDate);
  }

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN')
  @Get('enquiries')
  getEnquiryReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.reportService.getEnquiryConversionReport(startDate, endDate);
  }

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN', 'TEACHER')
  @Get('performance')
  getPerformanceReport(@Query('batchId') batchId: string) {
    if (!batchId) return [];
    return this.reportService.getStudentPerformanceReport(batchId);
  }
}
