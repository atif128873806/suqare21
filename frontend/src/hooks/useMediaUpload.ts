import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface UseMediaUploadReturn {
    uploadImages: (files: File[]) => Promise<string[]>;
    uploadVideos: (files: File[]) => Promise<string[]>;
    isUploading: boolean;
    uploadProgress: number;
}

export const useMediaUpload = (): UseMediaUploadReturn => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { token } = useAuth();

    const uploadImages = async (files: File[]): Promise<string[]> => {
        if (!token) throw new Error('Not authenticated');
        if (files.length === 0) return [];

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const batchSize = 5; // Upload 5 at a time
            const urls: string[] = [];

            for (let i = 0; i < files.length; i += batchSize) {
                const batch = files.slice(i, i + batchSize);
                const result = await api.uploadPropertyImages(batch, token);
                urls.push(...result.urls);
                setUploadProgress(Math.round(((i + batch.length) / files.length) * 100));
            }

            return urls;
        } catch (error) {
            console.error('Image upload failed:', error);
            throw error;
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const uploadVideos = async (files: File[]): Promise<string[]> => {
        if (!token) throw new Error('Not authenticated');
        if (files.length === 0) return [];

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const urls: string[] = [];

            // Upload videos one at a time due to large file sizes
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const result = await api.uploadPropertyVideos([file], token);
                urls.push(...result.urls);
                setUploadProgress(Math.round(((i + 1) / files.length) * 100));
            }

            return urls;
        } catch (error) {
            console.error('Video upload failed:', error);
            throw error;
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    return {
        uploadImages,
        uploadVideos,
        isUploading,
        uploadProgress,
    };
};
