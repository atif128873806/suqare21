export interface Lead {
    id: string;
    name: string;
    phone: string;
    email?: string;
    message: string;
    status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
    source: string;
    preferredArea?: string;
    budget?: number;
    propertyId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ChatLead {
    id: string;
    visitorId: string;
    name: string;
    phone: string;
    budget?: string;
    area?: string;
    intent?: string;
    propertyType?: string;
    createdAt: string;
}

export interface ChatConversation {
    id: string;
    visitorId: string;
    history: {
        role: 'user' | 'model';
        text: string;
        timestamp: string;
    }[];
    updatedAt: string;
}
