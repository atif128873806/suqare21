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
  const [showTeaser, setShowTeaser] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Show teaser after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowTeaser(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

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
      addBotMessage("I apologize, but I'm having trouble connecting right now. Please call us directly at +92 308 3333818.");
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
      {/* Teaser Bubble */}
      {!isOpen && showTeaser && (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
          <div className="bg-white text-primary px-4 py-3 rounded-2xl rounded-br-sm shadow-xl border border-secondary/20 flex items-center gap-3 relative max-w-[220px]">
            <div className="relative shrink-0">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full absolute -top-0.5 -right-0.5 animate-pulse ring-2 ring-white" />
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-secondary" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold mb-0.5">Square21 Assistant</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Hi there! 👋 Need help finding your dream property?</p>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setShowTeaser(false); }}
              className="absolute -top-2 -left-2 bg-background border border-border text-muted-foreground rounded-full p-1 hover:bg-destructive hover:text-white transition-colors shadow-sm"
              aria-label="Close teaser"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Premium Chat Button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setShowTeaser(false); }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-secondary text-secondary-foreground rounded-full p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:scale-110 active:scale-95 transition-all duration-300 animate-in fade-in zoom-in group border-2 border-white/20"
          aria-label="Open chat"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-secondary"></span>
            </span>
          </div>
        </button>
      )}

      {/* Clean & Modern Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-card border-x border-t sm:border border-border shadow-2xl overflow-hidden transition-all duration-500 ease-in-out animate-in slide-in-from-bottom-5 
            ${isMinimized
              ? 'bottom-6 right-6 h-14 w-64 rounded-2xl shadow-lg sm:flex hidden'
              : 'bottom-0 right-0 h-[100dvh] w-full sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-[400px] sm:rounded-2xl flex flex-col'
            }`}
        >
          {/* Header */}
          <div className="bg-primary text-white px-4 py-3 sm:p-4 flex items-center justify-between shrink-0">
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
              <button
                onClick={handleReset}
                title="Start New Conversation"
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Start new conversation"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors hidden sm:block"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Lead Capture Banner */}
              {isLeadCaptured && (
                <div className="bg-accent/10 border-b border-accent/20 px-4 py-2 flex items-center gap-2 animate-in slide-in-from-top duration-300 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span className="text-[11px] font-medium text-accent">Contact details received. We'll reach out soon!</span>
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-muted/5 to-muted/20 custom-scrollbar overscroll-contain">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${message.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-card border border-border text-foreground rounded-tl-none'
                      }`}>
                      <div className="whitespace-pre-wrap break-words">{message.text}</div>
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
              <div className="p-4 bg-card border-t border-border pb-[calc(1rem+env(safe-area-inset-bottom))] shrink-0">
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
            </>
          )}
        </div>
      )}
    </>
  );
}
