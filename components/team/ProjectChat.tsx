'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { sendChatMessage } from '@/app/actions/team';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface Message {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
    sender: {
        full_name: string;
        role: string;
    };
}

export default function ProjectChat({ projectId, currentUserId }: { projectId: string, currentUserId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        // Initial fetch
        const fetchMessages = async () => {
            const { data } = await supabase
                .from('project_messages')
                .select(`
                    *,
                    sender:users(full_name, role)
                `)
                .eq('project_id', projectId)
                .order('created_at', { ascending: true });

            if (data) setMessages(data as any);
        };

        fetchMessages();

        // Real-time subscription
        const channel = supabase
            .channel(`project-chat-${projectId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'project_messages',
                    filter: `project_id=eq.${projectId}`
                },
                async (payload) => {
                    // Fetch sender details for the new message
                    const { data: userData } = await supabase
                        .from('users')
                        .select('full_name, role')
                        .eq('id', payload.new.sender_id)
                        .single();

                    const newMessage = {
                        ...payload.new,
                        sender: userData
                    } as Message;

                    setMessages(prev => [...prev, newMessage]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [projectId, supabase]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || loading) return;

        setLoading(true);
        const res = await sendChatMessage(projectId, content);
        if (res.success) {
            setContent('');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-[500px] bg-white border border-[#e5dec9] rounded-[2.5rem] overflow-hidden shadow-xl shadow-[#d9cfb0]/10">
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#e5dec9] bg-[#f7f3ed]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-[#d97757]" />
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1c1917]">Project Direct Comms</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] font-medium uppercase tracking-widest text-[#78716c] italic">Secure Node</span>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 filter grayscale">
                        <ChatBubbleLeftRightIcon className="w-16 h-16 mb-4" />
                        <p className="text-[10px] font-medium uppercase tracking-widest italic text-[#78716c]">No telemetry broadcast found.</p>
                    </div>
                )}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender_id === currentUserId ? 'items-end' : 'items-start'}`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-[#1c1917]/40">
                                {msg.sender?.full_name}
                            </span>
                            <span className="text-[8px] font-medium uppercase tracking-[0.2em] px-2 py-0.5 bg-[#f7f3ed] rounded-full text-[#78716c] border border-[#e5dec9]">
                                {msg.sender?.role}
                            </span>
                        </div>
                        <div className={`
                            max-w-[80%] px-6 py-4 rounded-3xl text-sm font-medium leading-relaxed
                            ${msg.sender_id === currentUserId
                                ? 'bg-[#d97757] text-white rounded-tr-none shadow-lg shadow-[#d97757]/20'
                                : 'bg-[#f7f3ed] text-[#1c1917] rounded-tl-none border border-[#e5dec9]'
                            }
                        `}>
                            {msg.content}
                        </div>
                        <span className="text-[8px] font-medium text-[#1c1917]/20 uppercase mt-1">
                            {format(new Date(msg.created_at), 'HH:mm')}
                        </span>
                    </div>
                ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-[#f7f3ed]/30 border-t border-[#e5dec9]">
                <div className="relative">
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Broadcast message to Admin & Associates..."
                        className="w-full pl-6 pr-16 py-5 bg-white border border-[#e5dec9] rounded-2xl text-sm font-normal placeholder-[#1c1917]/20 focus:outline-none focus:border-[#d97757] transition-all italic font-serif"
                    />
                    <button
                        type="submit"
                        disabled={!content.trim() || loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-[#d97757] text-white rounded-xl hover:bg-[#c26242] transition-all disabled:opacity-30 active:scale-95"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
