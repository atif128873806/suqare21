import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export interface ImageUpload {
    file: File;
    preview: string;
    url?: string;
    uploading?: boolean;
    error?: string;
}

export function useImageUpload() {
    const [images, setImages] = useState<ImageUpload[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const { token } = useAuth();

    const addImages = (files: File[]) => {
        const newImages: ImageUpload[] = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index: number) => {
        setImages(prev => {
            const updated = [...prev];
            // Revoke object URL to prevent memory leaks
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const reorderImages = (fromIndex: number, toIndex: number) => {
        setImages(prev => {
            const updated = [...prev];
            const [moved] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, moved);
            return updated;
        });
    };

    const uploadImages = async (): Promise<string[]> => {
        if (!token) throw new Error('Not authenticated');
        if (images.length === 0) return [];

        setIsUploading(true);
        try {
            const filesToUpload = images.filter(img => !img.url).map(img => img.file);

            if (filesToUpload.length === 0) {
                // All images already uploaded
                return images.map(img => img.url!);
            }

            const { urls } = await api.uploadPropertyImages(filesToUpload, token);

            // Update images with uploaded URLs
            setImages(prev => prev.map((img, index) => ({
                ...img,
                url: urls[index] || img.url,
            })));

            return urls;
        } catch (error) {
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    const clearImages = () => {
        images.forEach(img => URL.revokeObjectURL(img.preview));
        setImages([]);
    };

    const setExistingImages = (urls: string[]) => {
        const existingImages: ImageUpload[] = urls.map(url => ({
            file: new File([], 'existing'),
            preview: url,
            url,
        }));
        setImages(existingImages);
    };

    return {
        images,
        isUploading,
        addImages,
        removeImage,
        reorderImages,
        uploadImages,
        clearImages,
        setExistingImages,
    };
}
