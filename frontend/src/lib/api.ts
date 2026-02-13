/**
 * API Client for Square21 Backend
 * Handles all HTTP requests to the NestJS backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
    token?: string;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const { token, ...fetchOptions } = options;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...fetchOptions,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: response.statusText,
            }));
            console.error('API Error:', error);
            throw new Error(error.message || error.error || JSON.stringify(error) || 'API request failed');
        }

        return response.json();
    }

    // Properties API
    async getProperties(filters?: {
        type?: string;
        purpose?: string;
        minPrice?: number;
        maxPrice?: number;
        location?: string;
        search?: string;
    }) {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });
        }
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request(`/properties${query}`);
    }

    async getProperty(id: string) {
        return this.request(`/properties/${id}`);
    }

    async createProperty(data: any, token: string) {
        return this.request('/properties', {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        });
    }

    async updateProperty(id: string, data: any, token: string) {
        return this.request(`/properties/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            token,
        });
    }

    async deleteProperty(id: string, token: string) {
        return this.request(`/properties/${id}`, {
            method: 'DELETE',
            token,
        });
    }

    async uploadPropertyImages(files: File[], token: string): Promise<{ urls: string[] }> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        const response = await fetch(`${this.baseUrl}/properties/upload-images`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: response.statusText,
            }));
            throw new Error(error.message || 'Image upload failed');
        }

        return response.json();
    }

    async uploadPropertyVideos(files: File[], token: string): Promise<{ urls: string[] }> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('videos', file);
        });

        const response = await fetch(`${this.baseUrl}/properties/upload-videos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: response.statusText,
            }));
            console.error('API Error:', error);
            throw new Error(error.message || error.error || JSON.stringify(error) || 'Video upload failed');
        }

        return response.json();
    }

    // Leads API
    async createLead(data: {
        name: string;
        phone: string;
        email?: string;
        preferredArea?: string;
        budget?: number;
        source: string;
        propertyId?: string;
        message?: string;
    }) {
        return this.request('/leads', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getLeads(token: string) {
        return this.request('/leads', { token });
    }

    async updateLeadStatus(id: string, status: string, token: string) {
        return this.request(`/leads/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
            token,
        });
    }

    // Auth API
    async login(email: string, password: string) {
        return this.request<{ access_token: string; user: any }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(email: string, password: string, name?: string) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
    }

    // Chatbot API
    async sendChatMessage(visitorId: string, message: string) {
        return this.request<{ response: string; conversationId: string }>(
            '/chatbot/message',
            {
                method: 'POST',
                body: JSON.stringify({ visitorId, message }),
            }
        );
    }

    async captureChatLead(leadData: {
        visitorId: string;
        name: string;
        phone: string;
        budget?: string;
        area?: string;
        intent?: string;
        propertyType?: string;
    }) {
        return this.request('/chatbot/capture-lead', {
            method: 'POST',
            body: JSON.stringify(leadData),
        });
    }

    async getChatConversations(token: string) {
        return this.request('/chatbot/conversations', { token });
    }

    async getChatLeads(token: string) {
        return this.request('/chatbot/leads', { token });
    }
}

export const api = new ApiClient(API_URL);
