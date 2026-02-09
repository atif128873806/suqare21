'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    MessageSquare,
    UserCheck,
    Calendar,
    ChevronDown
} from 'lucide-react';

interface ChatbotLogsProps {
    conversations: any[];
    chatLeads: any[];
    isLoading: boolean;
}

const ChatbotLogs = ({ conversations, chatLeads, isLoading }: ChatbotLogsProps) => {
    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading chatbot data...</div>;
    }

    return (
        <Tabs defaultValue="conversations" className="space-y-6">
            <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="conversations" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Conversations
                    </TabsTrigger>
                    <TabsTrigger value="leads" className="gap-2">
                        <UserCheck className="w-4 h-4" />
                        Chat Leads
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="conversations" className="space-y-4">
                {conversations.length === 0 ? (
                    <Card><CardContent className="p-8 text-center text-muted-foreground">No conversations yet.</CardContent></Card>
                ) : (
                    conversations.map((convo) => (
                        <Card key={convo.id} className="overflow-hidden">
                            <CardHeader className="p-4 bg-muted/30">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <MessageSquare className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Visitor ID: {convo.visitorId.slice(0, 12)}...</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(convo.updatedAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant="outline">{convo.history?.length || 0} Messages</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <details className="group">
                                    <summary className="flex items-center justify-center p-2 cursor-pointer text-xs text-muted-foreground hover:bg-muted/50 transition-colors">
                                        <span className="group-open:hidden">Show Transcript</span>
                                        <span className="hidden group-open:inline">Hide Transcript</span>
                                        <ChevronDown className="w-4 h-4 ml-1 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="p-4 space-y-3 bg-muted/10 border-t border-border">
                                        {Array.isArray(convo.history) && convo.history.map((msg: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                                            >
                                                <div className={`px-3 py-2 rounded-2xl text-sm ${msg.role === 'user'
                                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                        : 'bg-card border border-border rounded-tl-none'
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground mt-1">
                                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            </CardContent>
                        </Card>
                    ))
                )}
            </TabsContent>

            <TabsContent value="leads" className="space-y-4">
                {chatLeads.length === 0 ? (
                    <Card><CardContent className="p-8 text-center text-muted-foreground">No leads captured from chat yet.</CardContent></Card>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {chatLeads.map((lead) => (
                            <Card key={lead.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg font-bold">{lead.name}</CardTitle>
                                            <p className="text-sm text-primary font-medium">{lead.phone}</p>
                                        </div>
                                        <Badge variant="secondary">{lead.intent || 'Unknown Intent'}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="p-2 bg-muted/50 rounded-lg">
                                            <p className="text-[10px] text-muted-foreground uppercase">Budget</p>
                                            <p className="font-medium truncate">{lead.budget || 'Not specified'}</p>
                                        </div>
                                        <div className="p-2 bg-muted/50 rounded-lg">
                                            <p className="text-[10px] text-muted-foreground uppercase">Area</p>
                                            <p className="font-medium truncate">{lead.area || 'Not specified'}</p>
                                        </div>
                                        <div className="p-2 bg-muted/50 rounded-lg">
                                            <p className="text-[10px] text-muted-foreground uppercase">Property Type</p>
                                            <p className="font-medium truncate">{lead.propertyType || 'Not specified'}</p>
                                        </div>
                                        <div className="p-2 bg-muted/50 rounded-lg">
                                            <p className="text-[10px] text-muted-foreground uppercase">Captured On</p>
                                            <p className="font-medium truncate">{new Date(lead.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </TabsContent>
        </Tabs>
    );
};

export default ChatbotLogs;
