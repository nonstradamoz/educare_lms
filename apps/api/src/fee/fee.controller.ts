import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { FeeService } from './fee.service';

@Controller('fee')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Get()
  findAll() {
    return this.feeService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.feeService.create(data);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Body() data: { password?: string }) {
    if (data.password !== 'delete123') {
      throw new Error('Unauthorized');
    }
    return this.feeService.delete(id);
  }
}
