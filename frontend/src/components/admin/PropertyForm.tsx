'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { X, Upload, Video, MapPin, Building2, HelpCircle } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface PropertyFormProps {
    property?: Property;
    onSubmit: (data: PropertyFormData) => Promise<void>;
    onCancel: () => void;
}

export interface PropertyFormData {
    title: string;
    description: string;
    type: string;
    purpose: string;
    status: string;
    price: number | string;
    priceUnit: string;
    priceType: string;
    area: number | string | undefined;
    areaUnit: string;
    location: string;
    mapHtml?: string;
    features: string[];
    images: string[];
    videos?: string[];
    isFeatured: boolean;
}

interface InternalFormData extends Omit<PropertyFormData, 'location' | 'mapHtml'> {
    sector: string;
    city: string;
    address: string;
    mapHtml: string;
}

const PropertyForm = ({ property, onSubmit, onCancel }: PropertyFormProps) => {
    const getInitialLocation = () => {
        const loc = property?.location || '';
        if (loc.includes(' | ')) {
            const [sector, city, address] = loc.split(' | ');
            return { sector: sector || '', city: city || 'Islamabad', address: address || '' };
        }
        return { sector: '', city: 'Islamabad', address: loc };
    };

    const initialLoc = getInitialLocation();

    const [formData, setFormData] = useState<InternalFormData>({
        title: property?.title || '',
        description: property?.description || '',
        type: property?.type || 'INDUSTRIAL',
        purpose: property?.purpose || 'RENT',
        status: property?.status || 'AVAILABLE',
        price: property ? property.price : '',
        priceUnit: property?.priceUnit || 'PKR',
        priceType: property?.priceType || 'monthly',
        area: property ? property.area : '',
        areaUnit: property?.areaUnit || 'sqft',
        sector: initialLoc.sector,
        city: initialLoc.city,
        address: initialLoc.address,
        mapHtml: property?.mapHtml || '',
        features: property?.features || [],
        images: property?.images?.map(img => {
            if (!img) return '';
            return typeof img === 'string' ? img : img.src;
        }).filter(Boolean) || [],
        videos: property?.videos || [],
        isFeatured: property?.isFeatured || false,
    });

    const [featureInput, setFeatureInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { images, isUploading, addImages, removeImage, reorderImages, uploadImages, setExistingImages } = useImageUpload();
    const { uploadVideos, isUploading: isUploadingVideos } = useMediaUpload();
    const [videoFiles, setVideoFiles] = useState<File[]>([]);
    const [existingVideos, setExistingVideos] = useState<string[]>([]);

    // Load existing images and videos if editing
    useEffect(() => {
        if (property?.images) {
            const imageUrls = property.images.map(img => {
                if (!img) return '';
                return typeof img === 'string' ? img : img.src;
            }).filter(Boolean);
            setExistingImages(imageUrls);
        }
        if (property?.videos) {
            setExistingVideos(property.videos);
        }
    }, [property]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length > 10) {
            alert('Maximum 10 images allowed');
            return;
        }
        addImages(files);
    };

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, featureInput.trim()],
            }));
            setFeatureInput('');
        }
    };

    const handleRemoveFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Upload images first
            const imageUrls = await uploadImages();

            // Upload videos
            let videoUrls: string[] = [...existingVideos];
            if (videoFiles.length > 0) {
                const uploadedVideos = await uploadVideos(videoFiles);
                videoUrls = [...videoUrls, ...uploadedVideos];
            }

            // Combine location fields into a single string
            const fullLocation = `${formData.sector} | ${formData.city} | ${formData.address}`;

            // Create a clean data object for the API (only fields expected by CreatePropertyDto)
            const submitData = {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                purpose: formData.purpose,
                status: formData.status,
                price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price,
                priceUnit: formData.priceUnit,
                priceType: formData.priceType,
                area: formData.area ? (typeof formData.area === 'string' ? parseFloat(formData.area) : formData.area) : undefined,
                areaUnit: formData.areaUnit,
                location: fullLocation,
                mapHtml: formData.mapHtml.trim() || undefined,
                features: formData.features,
                images: imageUrls,
                videos: videoUrls,
                isFeatured: formData.isFeatured,
            };

            // Submit form with image and video URLs
            await onSubmit(submitData);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert(error instanceof Error ? error.message : 'Failed to submit form');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 p-1">
            {/* Basic Information */}
            <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <Building2 className="w-5 h-5 text-primary" />
                        <h3 className="font-display text-lg font-bold">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-semibold">Property Title *</Label>
                            <Input
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g. Premium Industrial Warehouse - I-9"
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Description *</Label>
                            <RichTextEditor
                                value={formData.description}
                                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                placeholder="Detailed description of the property... Use the toolbar to format your text."
                                minHeight="250px"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Property Type *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
                                    <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                                    <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Purpose *</Label>
                            <Select
                                value={formData.purpose}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select purpose" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="RENT">Rent</SelectItem>
                                    <SelectItem value="LEASE">Lease</SelectItem>
                                    <SelectItem value="SALE">Sale</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Availability Status *</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AVAILABLE">Available</SelectItem>
                                    <SelectItem value="RENTED">Rented</SelectItem>
                                    <SelectItem value="SOLD">Sold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Location Section */}
            <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <MapPin className="w-5 h-5 text-primary" />
                        <h3 className="font-display text-lg font-bold">Location Details</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="sector" className="text-sm font-semibold">Sector / Area *</Label>
                            <Input
                                id="sector"
                                required
                                value={formData.sector}
                                onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                                placeholder="e.g. I-9 Industrial Area"
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-sm font-semibold">City *</Label>
                            <Input
                                id="city"
                                required
                                value={formData.city}
                                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                placeholder="e.g. Islamabad"
                                className="h-11"
                            />
                        </div>

                        <div className="sm:col-span-2 space-y-2">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="address" className="text-sm font-semibold">Full Address (for Google Maps) *</Label>
                                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Enter full address for map search"
                                className="h-12 rounded-xl"
                                required
                            />
                        </div>

                        {/* Map Embed Code */}
                        <div className="sm:col-span-2 space-y-2">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="mapHtml" className="text-sm font-semibold text-primary/80">Custom Google Maps Embed Code (Optional)</Label>
                                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <textarea
                                id="mapHtml"
                                value={formData.mapHtml}
                                onChange={(e) => setFormData({ ...formData, mapHtml: e.target.value })}
                                placeholder="Paste iframe embed code here for precise pinpointing"
                                className="w-full min-h-[100px] p-4 rounded-xl border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <p className="text-[10px] text-muted-foreground italic">Tip: Go to Google Maps — Share — Embed a map — Copy HTML</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Price & Area Section */}
            <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center text-[10px] font-bold text-primary">PKR</div>
                        <h3 className="font-display text-lg font-bold">Price & Area</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-sm font-semibold">Price *</Label>
                            <div className="relative">
                                <Input
                                    id="price"
                                    required
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        price: e.target.value === '' ? '' : parseFloat(e.target.value) || ''
                                    }))}
                                    className="h-11 pr-16"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground uppercase">
                                    {formData.priceUnit}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Price Type *</Label>
                            <Select
                                value={formData.priceType}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, priceType: value }))}
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                    <SelectItem value="total">Total Price</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Currency *</Label>
                            <Select
                                value={formData.priceUnit}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, priceUnit: value }))}
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PKR">PKR (Pakistani Rupee)</SelectItem>
                                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="area" className="text-sm font-semibold">Area Size *</Label>
                            <Input
                                id="area"
                                required
                                type="number"
                                value={formData.area}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    area: e.target.value === '' ? '' : parseFloat(e.target.value) || ''
                                }))}
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Area Unit *</Label>
                            <Select
                                value={formData.areaUnit}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, areaUnit: value }))}
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sqft">Square Feet (sqft)</SelectItem>
                                    <SelectItem value="sqm">Square Meters (sqm)</SelectItem>
                                    <SelectItem value="marla">Marla</SelectItem>
                                    <SelectItem value="kanal">Kanal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Features */}
            <div className="space-y-4">
                <h3 className="font-display text-lg font-semibold">Features</h3>

                <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                        placeholder="Add a feature..."
                    />
                    <Button type="button" onClick={handleAddFeature}>Add</Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="gap-2">
                            {feature}
                            <X
                                className="w-3 h-3 cursor-pointer hover:text-destructive"
                                onClick={() => handleRemoveFeature(index)}
                            />
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Videos */}
            <div className="space-y-4">
                <h3 className="font-display text-lg font-semibold">Videos (Max 2)</h3>
                <p className="text-sm text-muted-foreground">Add property tour videos (MP4, MOV, AVI, WebM - max 100MB each)</p>

                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                        type="file"
                        accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                        multiple
                        onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length + videoFiles.length + existingVideos.length > 2) {
                                alert('Maximum 2 videos allowed');
                                return;
                            }
                            setVideoFiles([...videoFiles, ...files]);
                        }}
                        className="hidden"
                        id="video-upload"
                        disabled={videoFiles.length + existingVideos.length >= 2}
                    />
                    <label htmlFor="video-upload" className={`cursor-pointer ${videoFiles.length + existingVideos.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Click to upload videos</p>
                        <p className="text-sm text-muted-foreground/70">MP4, MOV, AVI, or WebM (max 100MB each)</p>
                    </label>
                </div>

                {(existingVideos.length > 0 || videoFiles.length > 0) && (
                    <div className="space-y-3">
                        {existingVideos.map((videoUrl, index) => (
                            <div key={`existing-${index}`} className="relative group border border-border rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <Video className="w-8 h-8 text-primary" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Existing Video {index + 1}</p>
                                        <p className="text-xs text-muted-foreground truncate">{videoUrl}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="destructive"
                                        onClick={() => setExistingVideos(existingVideos.filter((_, i) => i !== index))}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {videoFiles.map((file, index) => (
                            <div key={`new-${index}`} className="relative group border border-border rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <Video className="w-8 h-8 text-primary" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="destructive"
                                        onClick={() => setVideoFiles(videoFiles.filter((_, i) => i !== index))}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Images */}
            <div className="space-y-4">
                <h3 className="font-display text-lg font-semibold">Images (Max 10)</h3>

                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        id="image-upload"
                        disabled={images.length >= 10}
                    />
                    <label htmlFor="image-upload" className={`cursor-pointer ${images.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Click to upload images</p>
                        <p className="text-sm text-muted-foreground/70">JPG, PNG, or WebP (max 5MB each)</p>
                    </label>
                </div>

                {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image.preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="destructive"
                                        onClick={() => removeImage(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Featured */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="featured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium">Mark as featured property</label>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isSubmitting || isUploading}
                    className="w-full sm:w-auto"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting || isUploading || images.length === 0}
                    className="w-full sm:w-auto"
                >
                    {isSubmitting || isUploading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
                </Button>
            </div>
        </form>
    );
};

export default PropertyForm;
