import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryService, ConfigService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
