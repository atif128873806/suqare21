'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
        { role: 'model', text: 'Hi! Welcome to Square21 Marketing. How can I help you today?' },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/chatbot/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visitorId: 'temp-visitor', message: userMessage }),
            });
            const data = await response.json();

            setMessages((prev) => [...prev, { role: 'model', text: data.response }]);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting. Please try again later." }]);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-zinc-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-zinc-950 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold text-xs text-white">
                                    S21
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">Square21 Assistant</h4>
                                    <p className="text-[10px] text-zinc-400">Online | AI Ready</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-zinc-800 rounded-lg">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={cn(
                                            "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
                                            m.role === 'user'
                                                ? "bg-red-600 text-white rounded-br-none"
                                                : "bg-white border border-zinc-100 text-zinc-800 rounded-bl-none shadow-sm"
                                        )}
                                    >
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-zinc-100 p-3 rounded-2xl rounded-bl-none animate-pulse text-zinc-400 text-xs">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-zinc-100 flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask about properties, areas..."
                                className="flex-1 text-sm outline-none bg-zinc-50 p-2.5 rounded-xl border border-transparent focus:border-red-100 transition-all"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!input.trim()}
                                className="p-2.5 bg-zinc-950 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 transition-all"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
            >
                {isOpen ? <X /> : <MessageCircle />}
            </button>
        </div>
    );
};

// Utility function copied here for component independence
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
