import { Controller, Get, Post, Patch, Delete, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { LiveClassService } from './live-class.service';

@UsePipes(new ValidationPipe({ whitelist: false, forbidNonWhitelisted: false }))
@Controller('live-class')
export class LiveClassController {
  constructor(private readonly liveClassService: LiveClassService) {}

  @Get()
  getAll() {
    return this.liveClassService.getAll();
  }

  @Get('stats')
  getStats() {
    return this.liveClassService.getStats();
  }

  @Post()
  create(@Body() data: any) {
    return this.liveClassService.create(data);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: 'SCHEDULED' | 'LIVE' | 'ENDED') {
    return this.liveClassService.updateStatus(id, status);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.liveClassService.delete(id);
  }
}
