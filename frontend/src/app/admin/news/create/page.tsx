"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const CATEGORIES = [
    "MARKET_UPDATE",
    "INVESTMENT_TIPS",
    "NEW_PROJECTS",
    "PROPERTY_NEWS",
];

export default function CreateNewsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "MARKET_UPDATE",
        status: "DRAFT",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.createNews(formData, session?.accessToken as string);
            toast.success("News created successfully");
            router.push("/admin/news");
        } catch (error) {
            toast.error("Failed to create news");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Real Estate News</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 font-medium">Title</label>
                    <Input
                        required
                        placeholder="Enter news title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Category</label>
                    <Select
                        value={formData.category}
                        onValueChange={(val) => setFormData({ ...formData, category: val })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat.replace("_", " ")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Content</label>
                    <Textarea
                        required
                        className="h-64"
                        placeholder="Write your news content here..."
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                </div>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData({ ...formData, status: "DRAFT" })}
                        className={formData.status === "DRAFT" ? "bg-secondary" : ""}
                    >
                        Save as Draft
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData({ ...formData, status: "PUBLISHED" })}
                        className={formData.status === "PUBLISHED" ? "bg-secondary" : ""}
                    >
                        Publish Now
                    </Button>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Saving..." : "Save News Item"}
                </Button>
            </form>
        </div>
    );
}
