import { PropertyService } from './property.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';
import { CloudinaryService } from '../common/cloudinary.service';
export declare class PropertyController {
    private readonly propertyService;
    private readonly cloudinaryService;
    constructor(propertyService: PropertyService, cloudinaryService: CloudinaryService);
    uploadImages(files: Express.Multer.File[]): Promise<{
        urls: string[];
    }>;
    uploadVideos(files: Express.Multer.File[]): Promise<{
        urls: string[];
    }>;
    create(createPropertyDto: CreatePropertyDto): Promise<any>;
    findAll(filters: any): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<any>;
    remove(id: string): Promise<any>;
}
