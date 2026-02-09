'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Minimize2, CheckCircle2, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [visitorId, setVisitorId] = useState<string>('');
  const [isLeadCaptured, setIsLeadCaptured] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize visitorId and restore messages from localStorage
  useEffect(() => {
    let id = localStorage.getItem('chatbot_visitor_id');
    if (!id) {
      id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatbot_visitor_id', id);
    }
    setVisitorId(id);

    const savedMessages = localStorage.getItem(`chatbot_history_${id}`);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    }

    const leadCaptured = localStorage.getItem(`chatbot_lead_captured_${id}`);
    if (leadCaptured === 'true') {
      setIsLeadCaptured(true);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (visitorId && messages.length > 0) {
      localStorage.setItem(`chatbot_history_${visitorId}`, JSON.stringify(messages));
    }
  }, [messages, visitorId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Send welcome message when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "👋 Welcome back to Square21 Marketing. I'm your dedicated property consultant for Islamabad. How can I assist you in your property journey today?"
      );
    }
  }, [isOpen]);

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSend = async () => {
    const textToSend = inputValue.trim();
    if (!textToSend || !visitorId) return;

    setInputValue('');
    addUserMessage(textToSend);
    setIsTyping(true);

    try {
      const { response } = await api.sendChatMessage(visitorId, textToSend);
      setIsTyping(false);
      addBotMessage(response);

      // Simple heuristic for lead capture detection on frontend
      // (Backend does the actual saving, this is just for UI feedback)
      if (!isLeadCaptured && (textToSend.match(/(03\d{9})|(\+92\d{10})/) || textToSend.toLowerCase().includes('my name is'))) {
        setIsLeadCaptured(true);
        localStorage.setItem(`chatbot_lead_captured_${visitorId}`, 'true');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      addBotMessage("I apologize, but I'm having trouble connecting right now. Please call us directly at +92 300 1234567.");
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to clear this conversation and start fresh?")) {
      if (visitorId) {
        localStorage.removeItem(`chatbot_history_${visitorId}`);
        localStorage.removeItem(`chatbot_lead_captured_${visitorId}`);
      }
      localStorage.removeItem('chatbot_visitor_id');
      setMessages([]);
      setIsLeadCaptured(false);
      // Re-initialize with new ID
      const newId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatbot_visitor_id', newId);
      setVisitorId(newId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Premium Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-primary text-white rounded-full p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-110 active:scale-95 transition-all duration-300 animate-in fade-in zoom-in"
          aria-label="Open chat"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent border-2 border-primary"></span>
            </span>
          </div>
        </button>
      )}

      {/* Clean & Modern Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out animate-in slide-in-from-bottom-5 ${isMinimized ? 'h-14 w-64' : 'h-[600px] w-[400px]'}`}
        >
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none">Square21 Concierge</h3>
                <span className="text-[10px] text-white/70">Online • Always helpful</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handleReset} title="Start New Conversation" className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <RotateCw className="w-4 h-4" />
              </button>
              <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex flex-col h-[calc(100%-56px)]">
              {/* Lead Capture Banner */}
              {isLeadCaptured && (
                <div className="bg-accent/10 border-b border-accent/20 px-4 py-2 flex items-center gap-2 animate-in slide-in-from-top duration-300">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span className="text-[11px] font-medium text-accent">Contact details received. We'll reach out soon!</span>
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-muted/5 to-muted/20 custom-scrollbar">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${message.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-card border border-border text-foreground rounded-tl-none'
                      }`}>
                      {message.text}
                      <div className={`text-[9px] mt-1 ${message.sender === 'user' ? 'text-white/60' : 'text-foreground/40'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start animate-in fade-in duration-300">
                    <div className="bg-card border border-border px-4 py-2 rounded-2xl rounded-tl-none flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-card border-t border-border">
                <div className="relative flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your dream property..."
                    className="flex-1 text-sm h-11 pr-12 rounded-xl border-muted-foreground/20 focus-visible:ring-primary shadow-inner"
                  />
                  <Button
                    onClick={handleSend}
                    size="icon"
                    className="absolute right-1 top-1 h-9 w-9 rounded-lg hover:bg-primary/90 transition-all active:scale-95"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-center mt-3 text-muted-foreground">
                  Powered by Square21 Intelligence
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
