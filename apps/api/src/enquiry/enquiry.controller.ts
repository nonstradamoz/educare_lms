import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enquiry')
export class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) {}

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN')
  @Post()
  create(@Body() data: any) {
    return this.enquiryService.createEnquiry(data);
  }

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN')
  @Get()
  getAll() {
    return this.enquiryService.getAllEnquiries();
  }

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN')
  @Get('summary')
  getSummary() {
    return this.enquiryService.getEnquirySummary();
  }

  @Roles('SUPER_ADMIN', 'CENTRE_ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.enquiryService.updateEnquiry(id, data);
  }
}
