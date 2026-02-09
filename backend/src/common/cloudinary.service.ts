import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'square21/properties',
                    resource_type: 'image',
                    transformation: [
                        { width: 1920, height: 1080, crop: 'limit' },
                        { quality: 'auto:good' },
                        { fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Upload failed'));
                    resolve(result.secure_url);
                },
            );
            uploadStream.end(file.buffer);
        });
    }

    async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
        const uploadPromises = files.map(file => this.uploadImage(file));
        return Promise.all(uploadPromises);
    }

    async uploadVideo(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'square21/properties/videos',
                    resource_type: 'video',
                    transformation: [
                        { width: 1920, height: 1080, crop: 'limit' },
                        { quality: 'auto:good' },
                        { fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Video upload failed'));
                    resolve(result.secure_url);
                },
            );
            uploadStream.end(file.buffer);
        });
    }

    async uploadMultipleVideos(files: Express.Multer.File[]): Promise<string[]> {
        const uploadPromises = files.map(file => this.uploadVideo(file));
        return Promise.all(uploadPromises);
    }

    async deleteImage(imageUrl: string): Promise<void> {
        const publicId = this.extractPublicId(imageUrl);
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
    }

    async deleteVideo(videoUrl: string): Promise<void> {
        const publicId = this.extractPublicId(videoUrl);
        if (publicId) {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        }
    }

    private extractPublicId(imageUrl: string): string | null {
        const matches = imageUrl.match(/square21\/properties\/(?:videos\/)?([^.]+)/);
        return matches ? `square21/properties/${matches[1]}` : null;
    }
}
