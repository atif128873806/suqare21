import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatbotWrapper from "@/components/chatbot/ChatbotWrapper";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="pt-20">
                {children}
            </main>
            <ChatbotWrapper />
            <Footer />
        </>
    );
}
