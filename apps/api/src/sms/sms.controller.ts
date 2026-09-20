import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SmsService } from './sms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN')
  @Post('send')
  sendSms(@Body() data: { to: string; message: string }, @Req() req: any) {
    return this.smsService.sendSms(data.to, data.message, req.user.id);
  }

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN')
  @Post('bulk')
  sendBulkSms(@Body() data: any, @Req() req: any) {
    return this.smsService.sendBulkSms(data, req.user.id);
  }

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN')
  @Get('logs')
  getLogs() {
    return this.smsService.getLogs();
  }
}
