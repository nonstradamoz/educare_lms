import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN', 'TEACHER')
  @Get('students/:batchId')
  getStudents(@Param('batchId') batchId: string) {
    return this.attendanceService.getBatchStudents(batchId);
  }

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN', 'TEACHER')
  @Get(':batchId')
  getAttendance(@Param('batchId') batchId: string, @Query('date') date: string) {
    return this.attendanceService.getAttendanceForBatchAndDate(batchId, date);
  }

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN', 'TEACHER')
  @Post()
  markAttendance(@Body() data: any, @Req() req: any) {
    return this.attendanceService.markAttendance(data, req.user.id);
  }
}
