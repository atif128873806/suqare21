import { ConfigService } from '@nestjs/config';
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File): Promise<string>;
    uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]>;
    uploadVideo(file: Express.Multer.File): Promise<string>;
    uploadMultipleVideos(files: Express.Multer.File[]): Promise<string[]>;
    deleteImage(imageUrl: string): Promise<void>;
    deleteVideo(videoUrl: string): Promise<void>;
    private extractPublicId;
}
