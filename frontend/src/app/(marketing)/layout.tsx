import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatbotWrapper from "@/components/chatbot/ChatbotWrapper";
import { MotionProvider } from "@/components/providers/MotionProvider";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MotionProvider>
            <Header />
            <main className="pt-20">
                {children}
            </main>
            <ChatbotWrapper />
            <Footer />
        </MotionProvider>
    );
}
