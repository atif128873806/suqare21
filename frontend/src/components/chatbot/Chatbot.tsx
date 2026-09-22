'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, MessageCircle, Minimize2, RotateCw, MapPin, Home, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  properties?: PropertyCard[];
  quickReplies?: string[];
}

interface PropertyCard {
  id: string;
  title: string;
  price: number;
  priceUnit: string;
  location: string;
  type: string;
  purpose: string;
  area: number | null;
  areaUnit: string | null;
  image: string | null;
  features: string[];
}

function formatPrice(price: number, unit: string) {
  if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Crore`;
  if (price >= 100000) return `${(price / 100000).toFixed(0)} Lac`;
  return `${price.toLocaleString()} ${unit}`;
}

export default function Chatbot() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [visitorId, setVisitorId] = useState('');
  const [quickReplies, setQuickReplies] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Init visitor
  useEffect(() => {
    let id = localStorage.getItem('sq21_vid');
    if (!id) {
      id = `v_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`;
      localStorage.setItem('sq21_vid', id);
    }
    setVisitorId(id);

    const saved = localStorage.getItem(`sq21_chat_${id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
        const lastBot = [...parsed].reverse().find((m: any) => m.sender === 'bot');
        if (lastBot?.quickReplies) setQuickReplies(lastBot.quickReplies);
      } catch { /* ignore */ }
    }
  }, []);

  // Save messages
  useEffect(() => {
    if (visitorId && messages.length > 0) {
      localStorage.setItem(`sq21_chat_${visitorId}`, JSON.stringify(messages));
    }
  }, [messages, visitorId]);

  // Scroll
  useEffect(() => {
    requestAnimationFrame(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }));
  }, [messages, isTyping]);

  // Welcome
  useEffect(() => {
    if (visitorId && messages.length === 0) {
      const replies = ['Buy', 'Rent', 'Invest', 'Talk to Consultant'];
      setMessages([{
        id: 'welcome',
        text: "Welcome to Square21 Marketing! How can we assist you today?",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: replies,
      }]);
      setQuickReplies(replies);
    }
  }, [visitorId]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !visitorId || isTyping) return;
    const trimmed = text.trim();

    setMessages(prev => [...prev, {
      id: `u_${Date.now()}`,
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    }]);
    setInputValue('');
    setQuickReplies([]);
    setIsTyping(true);

    try {
      const data = await api.sendChatMessage(visitorId, trimmed);
      setMessages(prev => [...prev, {
        id: `b_${Date.now()}`,
        text: data.message,
        sender: 'bot',
        timestamp: new Date(),
        properties: data.properties,
        quickReplies: data.quickReplies,
      }]);
      setQuickReplies(data.quickReplies || []);
    } catch {
      setMessages(prev => [...prev, {
        id: `e_${Date.now()}`,
        text: "Apologies, something went wrong. Reach us on WhatsApp: +92 308 3333818",
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ['Talk to Consultant'],
      }]);
      setQuickReplies(['Talk to Consultant']);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visitorId, isTyping]);

  const handleQuickReply = useCallback((reply: string) => {
    if (reply === 'Talk to Consultant') {
      window.open('https://wa.me/923083333818?text=Hi%2C%20I%20need%20help%20with%20property', '_blank');
      return;
    }
    sendMessage(reply);
  }, [sendMessage]);

  const handleReset = () => {
    if (visitorId) localStorage.removeItem(`sq21_chat_${visitorId}`);
    localStorage.removeItem('sq21_vid');
    const newId = `v_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`;
    localStorage.setItem('sq21_vid', newId);
    setVisitorId(newId);
    setMessages([]);
    setQuickReplies([]);
  };

  const isLastBotMsg = (msgId: string) => {
    const botMsgs = messages.filter(m => m.sender === 'bot');
    return botMsgs.length > 0 && botMsgs[botMsgs.length - 1].id === msgId;
  };

  return (
    <div
      className={`fixed z-50 overflow-hidden transition-all duration-300 ease-out
        ${isMinimized
          ? 'bottom-6 right-6 h-[52px] w-[280px] rounded-2xl bg-primary text-white cursor-pointer hidden sm:flex items-center px-4 gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
          : 'bottom-0 right-0 h-[100dvh] w-full sm:bottom-6 sm:right-6 sm:h-[540px] sm:w-[390px] sm:rounded-2xl flex flex-col bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800'
        }`}
      onClick={isMinimized ? () => setIsMinimized(false) : undefined}
    >
      {/* Minimized */}
      {isMinimized && (
        <>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium truncate">Square21 Marketing</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0 ml-auto" />
        </>
      )}

      {/* Header */}
      {!isMinimized && (
        <div className="bg-primary text-white px-4 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-[15px] leading-tight">Square21 Marketing</h3>
              <span className="text-[11px] text-white/70">Typically replies instantly</span>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={handleReset} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="New Chat">
              <RotateCw className="w-4 h-4" />
            </button>
            <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden sm:block" title="Minimize">
              <Minimize2 className="w-4 h-4" />
            </button>
            <button onClick={() => window.dispatchEvent(new CustomEvent('chatbot-close'))} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-zinc-50 dark:bg-zinc-950 overscroll-contain">
            {messages.map((msg) => (
              <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                {/* Bubble */}
                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 text-[13.5px] leading-[1.55] ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-2xl rounded-br-md shadow-sm'
                      : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-2xl rounded-bl-md shadow-sm border border-zinc-100 dark:border-zinc-800'
                  }`}>
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    <span className={`text-[10px] block mt-1 ${msg.sender === 'user' ? 'text-white/50' : 'text-zinc-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Property Cards */}
                {msg.properties && msg.properties.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.properties.map((p) => (
                      <a key={p.id} href={`/property/${p.id}`} target="_blank" rel="noopener noreferrer"
                        className="block bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all group">
                        <div className="flex items-stretch">
                          {p.image ? (
                            <img src={p.image} alt="" className="w-24 h-24 object-cover shrink-0" loading="lazy" />
                          ) : (
                            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                              <Home className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 p-3 flex flex-col justify-center">
                            <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-primary transition-colors">{p.title}</p>
                            <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 shrink-0" /> {p.location}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[13px] font-bold text-primary">{formatPrice(p.price, p.priceUnit)}</span>
                              <span className="text-[10px] bg-primary/8 text-primary px-2 py-0.5 rounded-full font-medium">{p.purpose === 'SALE' ? 'For Sale' : p.purpose === 'RENT' ? 'For Rent' : p.purpose}</span>
                            </div>
                          </div>
                          <div className="flex items-center pr-3">
                            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {/* Quick Replies - only on latest bot message */}
                {msg.sender === 'bot' && msg.quickReplies && msg.quickReplies.length > 0 && isLastBotMsg(msg.id) && !isTyping && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.quickReplies.map((r) => (
                      <button key={r} onClick={() => handleQuickReply(r)}
                        className={`text-[12.5px] px-4 py-2 rounded-full font-medium transition-all duration-200 active:scale-95 ${
                          r === 'Talk to Consultant'
                            ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 hover:bg-green-500 hover:text-white hover:border-green-500 shadow-sm'
                            : 'bg-white dark:bg-zinc-900 text-primary border border-primary/20 hover:bg-primary hover:text-white hover:border-primary shadow-sm'
                        }`}>
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing */}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputValue); } }}
                placeholder="Type your message..."
                className="flex-1 text-sm h-11 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-0 outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-zinc-400"
                disabled={isTyping}
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="h-11 w-11 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-primary/90 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[9px] text-zinc-400 mt-2">Powered by Square21 Marketing</p>
          </div>
        </>
      )}
    </div>
  );
}
