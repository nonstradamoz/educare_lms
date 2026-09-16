import { Controller, Get, Post, Body } from '@nestjs/common';
import { EstudyService } from './estudy.service';

@Controller('estudy')
export class EstudyController {
  constructor(private readonly estudyService: EstudyService) {}

  @Get()
  getMaterials() {
    return this.estudyService.getMaterials();
  }

  @Post()
  createMaterial(@Body() data: any) {
    return this.estudyService.createMaterial(data);
  }
}
