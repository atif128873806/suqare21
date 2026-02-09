'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Lead } from '../../types/lead';

interface LeadManagementProps {
    leads: Lead[];
    isLoading: boolean;
    onUpdateStatus: (id: string, status: string) => void;
}

const LeadManagement = ({ leads, isLoading, onUpdateStatus }: LeadManagementProps) => {
    const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
        switch (status) {
            case 'NEW': return 'default';
            case 'CONTACTED': return 'secondary';
            case 'QUALIFIED': return 'outline';
            case 'CONVERTED': return 'default';
            case 'LOST': return 'destructive';
            default: return 'outline';
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading leads...</div>;
    }

    if (leads.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    No leads found.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <CardTitle className="text-xl font-bold font-display">Lead Management</CardTitle>
                <Badge variant="outline">{leads.length} Total Leads</Badge>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead) => (
                            <TableRow key={lead.id}>
                                <TableCell>
                                    <div className="font-medium">{lead.name}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-1">{lead.message}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">{lead.phone}</div>
                                    {lead.email && <div className="text-xs text-muted-foreground">{lead.email}</div>}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(lead.status)}>
                                        {lead.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Select
                                        defaultValue={lead.status}
                                        onValueChange={(value) => onUpdateStatus(lead.id, value)}
                                    >
                                        <SelectTrigger className="w-[130px] ml-auto">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NEW">New</SelectItem>
                                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                                            <SelectItem value="QUALIFIED">Qualified</SelectItem>
                                            <SelectItem value="CONVERTED">Converted</SelectItem>
                                            <SelectItem value="LOST">Lost</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default LeadManagement;
