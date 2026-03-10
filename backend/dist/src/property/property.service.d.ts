import { PrismaService } from '../common/prisma.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';
export declare class PropertyService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPropertyDto: CreatePropertyDto): Promise<any>;
    findAll(filters: Record<string, string | undefined>): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<any>;
    remove(id: string): Promise<any>;
}
