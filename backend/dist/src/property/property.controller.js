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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const passport_1 = require("@nestjs/passport");
const property_service_1 = require("./property.service");
const property_dto_1 = require("./dto/property.dto");
const cloudinary_service_1 = require("../common/cloudinary.service");
let PropertyController = class PropertyController {
    propertyService;
    cloudinaryService;
    constructor(propertyService, cloudinaryService) {
        this.propertyService = propertyService;
        this.cloudinaryService = cloudinaryService;
    }
    async uploadImages(files) {
        const imageUrls = await this.cloudinaryService.uploadMultipleImages(files);
        return { urls: imageUrls };
    }
    async uploadVideos(files) {
        const videoUrls = await this.cloudinaryService.uploadMultipleVideos(files);
        return { urls: videoUrls };
    }
    create(createPropertyDto) {
        return this.propertyService.create(createPropertyDto);
    }
    findAll(filters) {
        return this.propertyService.findAll(filters);
    }
    findOne(id) {
        return this.propertyService.findOne(id);
    }
    update(id, updatePropertyDto) {
        return this.propertyService.update(id, updatePropertyDto);
    }
    remove(id) {
        return this.propertyService.remove(id);
    }
};
exports.PropertyController = PropertyController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('upload-images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10, {
        limits: {
            fileSize: 5 * 1024 * 1024,
            files: 10,
            fieldSize: 50 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('upload-videos'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('videos', 2, {
        limits: {
            fileSize: 100 * 1024 * 1024,
            files: 2,
            fieldSize: 200 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(mp4|quicktime|x-msvideo|webm)$/)) {
                return cb(new Error('Only video files are allowed! (MP4, MOV, AVI, WebM)'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "uploadVideos", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [property_dto_1.CreatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, property_dto_1.UpdatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "remove", null);
exports.PropertyController = PropertyController = __decorate([
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [property_service_1.PropertyService,
        cloudinary_service_1.CloudinaryService])
], PropertyController);
//# sourceMappingURL=property.controller.js.map