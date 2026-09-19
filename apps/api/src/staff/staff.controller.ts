import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'CENTRE_ADMIN')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  createStaff(@Body() data: any) {
    return this.staffService.createStaff(data);
  }

  @Get()
  getStaff() {
    return this.staffService.getStaff();
  }

  @Put(':id')
  updateStaff(@Param('id') id: string, @Body() data: any) {
    return this.staffService.updateStaff(id, data);
  }

  @Delete(':id')
  deleteStaff(@Param('id') id: string) {
    return this.staffService.deleteStaff(id);
  }
}
