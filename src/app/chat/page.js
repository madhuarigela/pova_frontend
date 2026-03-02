'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function ChatPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!authLoading && !user) { router.push('/login'); return; }
        if (user) loadHistory();
    }, [user, authLoading]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadHistory = async () => {
        try {
            const res = await api.get('/chat/history?limit=50');
            const history = res.data.messages.map(m => ([
                { type: 'user', text: m.message, time: m.createdAt },
                { type: 'amma', text: m.response, time: m.createdAt }
            ])).flat();
            setMessages(history.length > 0 ? history : [
                { type: 'amma', text: "Hello! I'm Amma, your period health companion 🌸 How can I help you today?\n\n⚠️ *Disclaimer: This information is for educational purposes only and does not replace professional medical advice.*", time: new Date().toISOString() }
            ]);
        } catch (err) {
            setMessages([
                { type: 'amma', text: "Hello! I'm Amma, your period health companion 🌸 How can I help you today?", time: new Date().toISOString() }
            ]);
        } finally { setLoadingHistory(false); }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || sending) return;
        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { type: 'user', text: userMsg, time: new Date().toISOString() }]);
        setSending(true);

        try {
            const res = await api.post('/chat', { message: userMsg });
            setMessages(prev => [...prev, { type: 'amma', text: res.data.response, time: res.data.timestamp }]);
        } catch (err) {
            setMessages(prev => [...prev, { type: 'amma', text: "I'm sorry, I couldn't process that right now. Please try again! 💗", time: new Date().toISOString() }]);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    const quickQuestions = [
        "How to manage cramps?",
        "Diet tips for PMS",
        "Exercise during period",
        "What is ovulation?",
        "Missed period causes"
    ];

    if (authLoading || loadingHistory) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-pink-400 animate-pulse text-xl">Loading Amma... 💬</div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
            {/* Header */}
            <div className="glass-card p-4 mb-4 flex items-center gap-4">
                <img src="/amma-avatar.png" alt="Amma" className="w-12 h-12 rounded-2xl object-cover pulse-glow" />
                <div>
                    <h1 className="font-bold text-gray-800">Amma</h1>
                    <p className="text-xs text-gray-500">Your AI period health companion</p>
                </div>
                <div className="ml-auto">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-1">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        {msg.type === 'amma' && (
                            <img src="/amma-avatar.png" alt="Amma" className="w-8 h-8 rounded-full object-cover mr-2 mt-1 flex-shrink-0" />
                        )}
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.type === 'user'
                            ? 'bg-pink-500 text-white rounded-br-md'
                            : 'bg-white border border-pink-100 text-gray-700 rounded-bl-md shadow-sm'
                            }`}>
                            {msg.type === 'amma' && <p className="text-xs font-semibold text-pink-500 mb-1">Amma 🌸</p>}
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                            <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-pink-200' : 'text-gray-400'}`}>
                                {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                {sending && (
                    <div className="flex justify-start animate-fade-in">
                        <img src="/amma-avatar.png" alt="Amma" className="w-8 h-8 rounded-full object-cover mr-2 mt-1 flex-shrink-0" />
                        <div className="bg-white border border-pink-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                            <p className="text-xs font-semibold text-pink-500 mb-1">Amma 🌸</p>
                            <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '0s' }} />
                                <span className="w-2 h-2 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '0.15s' }} />
                                <span className="w-2 h-2 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '0.3s' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && (
                <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
                    {quickQuestions.map((q, i) => (
                        <button key={i} onClick={() => { setInput(q); }}
                            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-pink-50 text-pink-600 text-xs font-medium hover:bg-pink-100 transition">
                            {q}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <form onSubmit={handleSend} className="flex gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="input-field flex-1"
                    placeholder="Ask Amma anything about your period..."
                    maxLength={1000}
                />
                <button type="submit" disabled={sending || !input.trim()}
                    className="btn-primary px-5 disabled:opacity-50 disabled:cursor-not-allowed">
                    {sending ? '...' : '→'}
                </button>
            </form>
        </div>
    );
}
