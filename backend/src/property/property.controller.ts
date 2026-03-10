import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { PropertyService } from './property.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';
import { CloudinaryService } from '../common/cloudinary.service';

@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload-images')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 10, // max 10 files
        fieldSize: 50 * 1024 * 1024, // 50MB total field size
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const imageUrls = await this.cloudinaryService.uploadMultipleImages(files);
    return { urls: imageUrls };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload-videos')
  @UseInterceptors(
    FilesInterceptor('videos', 2, {
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB per file
        files: 2, // max 2 files
        fieldSize: 200 * 1024 * 1024, // 200MB total field size
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(mp4|quicktime|x-msvideo|webm)$/)) {
          return cb(
            new Error('Only video files are allowed! (MP4, MOV, AVI, WebM)'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadVideos(@UploadedFiles() files: Express.Multer.File[]) {
    const videoUrls = await this.cloudinaryService.uploadMultipleVideos(files);
    return { urls: videoUrls };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
  }

  @Get()
  findAll(@Query() filters: any) {
    return this.propertyService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(id, updatePropertyDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }
}
