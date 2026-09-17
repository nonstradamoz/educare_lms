import { Controller, Get, Post, Body } from '@nestjs/common';
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
}
