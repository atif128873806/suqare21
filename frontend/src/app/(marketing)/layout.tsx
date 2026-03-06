import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatbotWrapper from "@/components/chatbot/ChatbotWrapper";
import { LazyMotion, domAnimation } from "framer-motion";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LazyMotion features={domAnimation}>
            <Header />
            <main className="pt-20">
                {children}
            </main>
            <ChatbotWrapper />
            <Footer />
        </LazyMotion>
    );
}
