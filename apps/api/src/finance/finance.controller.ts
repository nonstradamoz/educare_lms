import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN')
  @Post('transaction')
  createTransaction(@Body() data: any, @Req() req: any) {
    return this.financeService.createTransaction(data, req.user.id);
  }

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN')
  @Get('transactions')
  getTransactions() {
    return this.financeService.getTransactions();
  }

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN')
  @Get('summary')
  getSummary() {
    return this.financeService.getSummary();
  }
}
