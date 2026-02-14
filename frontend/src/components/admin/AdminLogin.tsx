'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Building2, Lock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLoginProps {
    onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
    const { toast } = useToast();
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(credentials.email, credentials.password);
            toast({
                title: "Welcome back!",
                description: "Successfully logged into admin panel.",
            });
            onLogin();
        } catch (error) {
            toast({
                title: "Login Failed",
                description: error instanceof Error ? error.message : "Invalid email or password",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-secondary-foreground">
                        Square<span className="text-primary">21</span> Admin
                    </h1>
                    <p className="text-secondary-foreground/60 text-sm mt-1">
                        Sign in to manage your properties
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-8 shadow-lg">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4" />
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                placeholder="admin@square21.pk"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                                <Lock className="w-4 h-4" />
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full mt-6" size="lg" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
