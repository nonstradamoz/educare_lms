import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StaffService } from './staff.service';

@Controller('staff')
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
