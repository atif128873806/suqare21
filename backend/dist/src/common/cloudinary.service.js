"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
let CloudinaryService = class CloudinaryService {
    configService;
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }
    async uploadImage(file) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: 'square21/properties',
                resource_type: 'image',
                transformation: [
                    { width: 1920, height: 1080, crop: 'limit' },
                    { quality: 'auto:good' },
                    { fetch_format: 'auto' },
                ],
            }, (error, result) => {
                if (error)
                    return reject(error);
                if (!result)
                    return reject(new Error('Upload failed'));
                resolve(result.secure_url);
            });
            uploadStream.end(file.buffer);
        });
    }
    async uploadMultipleImages(files) {
        const uploadPromises = files.map((file) => this.uploadImage(file));
        return Promise.all(uploadPromises);
    }
    async uploadVideo(file) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: 'square21/properties/videos',
                resource_type: 'video',
                transformation: [
                    { width: 1920, height: 1080, crop: 'limit' },
                    { quality: 'auto:good' },
                    { fetch_format: 'auto' },
                ],
            }, (error, result) => {
                if (error)
                    return reject(error);
                if (!result)
                    return reject(new Error('Video upload failed'));
                resolve(result.secure_url);
            });
            uploadStream.end(file.buffer);
        });
    }
    async uploadMultipleVideos(files) {
        const uploadPromises = files.map((file) => this.uploadVideo(file));
        return Promise.all(uploadPromises);
    }
    async deleteImage(imageUrl) {
        const publicId = this.extractPublicId(imageUrl);
        if (publicId) {
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
    }
    async deleteVideo(videoUrl) {
        const publicId = this.extractPublicId(videoUrl);
        if (publicId) {
            await cloudinary_1.v2.uploader.destroy(publicId, { resource_type: 'video' });
        }
    }
    extractPublicId(imageUrl) {
        const matches = imageUrl.match(/square21\/properties\/(?:videos\/)?([^.]+)/);
        return matches ? `square21/properties/${matches[1]}` : null;
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map