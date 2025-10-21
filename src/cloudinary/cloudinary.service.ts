import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService implements OnModuleInit {
  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async upload(
  filePathOrBuffer: string | Buffer,
  options?: UploadApiOptions,
): Promise<UploadApiResponse> {
  if (Buffer.isBuffer(filePathOrBuffer)) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Cloudinary upload returned no result'));
          }
          resolve(result);
        },
      );
      streamifier.createReadStream(filePathOrBuffer).pipe(uploadStream);
    });
  }

  return cloudinary.uploader.upload(filePathOrBuffer, options);
}
}
