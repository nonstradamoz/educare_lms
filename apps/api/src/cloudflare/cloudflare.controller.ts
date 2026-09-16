import { Controller, Post } from '@nestjs/common';
import { CloudflareService } from './cloudflare.service';

@Controller('cloudflare')
export class CloudflareController {
  constructor(private readonly cloudflareService: CloudflareService) {}

  @Post('upload-url')
  async getUploadUrl() {
    return this.cloudflareService.getDirectUploadUrl();
  }
}
