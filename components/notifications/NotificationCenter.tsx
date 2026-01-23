'use client';

import { useEffect, useState, useRef } from 'react';
import { getNotifications, markAsRead, clearAllNotifications } from '@/app/actions/notifications';
import { createClient } from '@/lib/supabase/client';
import {
    BellIcon,
    CheckCircleIcon,
    InboxIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const unreadCount = notifications.filter(n => !n.is_read).length;

    useEffect(() => {
        async function loadNotifications() {
            const res = await getNotifications();
            if (res.success && res.data) setNotifications(res.data);
            setLoading(false);
        }
        loadNotifications();

        // 1. Subscribe to Realtime notifications
        const channel = supabase
            .channel('public:notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                },
                (payload) => {
                    // Check if the notification is for the current user
                    // Note: RLS handles security, but we double check here if needed
                    // Usually, RLS sends only authorized payloads if configured correctly
                    setNotifications(prev => [payload.new, ...prev]);

                    // Optional: Play alert sound or browser notification
                }
            )
            .subscribe();

        // Close dropdown on click outside
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            supabase.removeChannel(channel);
        };
    }, []);

    const handleMarkAsRead = async (id: string) => {
        const res = await markAsRead(id);
        if (res.success) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        }
    };

    const handleClearAll = async () => {
        const res = await clearAllNotifications();
        if (res.success) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-11 h-11 flex items-center justify-center bg-[#f7f3ed] hover:bg-[#d97757] hover:text-white rounded-xl text-[#1c1917]/20 border border-[#e5dec9] transition-all duration-300 shadow-sm"
            >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#d97757] text-white text-[9px] font-black flex items-center justify-center rounded-full ring-4 ring-white shadow-lg transition-transform hover:scale-110">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2.5rem] shadow-2xl shadow-[#d9cfb0]/30 border border-[#e5dec9] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="px-8 py-6 border-b border-[#f7f3ed] flex items-center justify-between bg-[#f7f3ed]/30">
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1c1917] flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#d97757]"></span>
                                Notifications
                            </h3>
                            <p className="text-[9px] font-black text-[#1c1917]/20 uppercase tracking-[0.2em] mt-1 italic font-serif">Live Transmission Feed</p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-[9px] font-black uppercase tracking-widest text-[#d97757] hover:opacity-70 transition-opacity flex items-center gap-2"
                            >
                                <TrashIcon className="w-3.5 h-3.5" />
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="max-h-[450px] overflow-y-auto custom-scrollbar bg-white">
                        {notifications.length === 0 && !loading && (
                            <div className="py-20 text-center px-10">
                                <div className="w-16 h-16 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#e5dec9] mx-auto mb-6">
                                    <InboxIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-sm font-black text-[#1c1917] uppercase tracking-tighter">No Active Signals</h3>
                                <p className="text-[9px] font-black text-[#1c1917]/20 uppercase tracking-[0.2em] mt-2 italic font-serif">Registry is currently synchronized.</p>
                            </div>
                        )}

                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`p-6 border-b border-[#f7f3ed] hover:bg-[#fdfcf9] transition-all group relative ${!n.is_read ? 'bg-[#f7f3ed]/20' : ''}`}
                            >
                                <div className="flex gap-5">
                                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${!n.is_read ? 'bg-white border-[#d97757]/30 text-[#d97757]' : 'bg-[#f7f3ed] border-[#e5dec9] text-[#1c1917]/20'}`}>
                                        <BellIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[13px] font-black text-[#1c1917] leading-none uppercase tracking-tight">{n.title}</p>
                                            {!n.is_read && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]"></span>
                                            )}
                                        </div>
                                        <p className="text-xs font-black text-[#1c1917]/40 leading-snug italic font-serif">{n.content}</p>
                                        {n.link && (
                                            <Link
                                                href={n.link}
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    handleMarkAsRead(n.id);
                                                }}
                                                className="inline-block text-[9px] font-black text-[#d97757] uppercase tracking-widest hover:opacity-70 transition-opacity border-b border-[#d97757]/30 pb-0.5 mt-2"
                                            >
                                                View Transmission Details →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                {!n.is_read && (
                                    <button
                                        onClick={() => handleMarkAsRead(n.id)}
                                        className="opacity-0 group-hover:opacity-100 absolute top-6 right-6 p-2 text-[#d97757] hover:bg-[#d97757] hover:text-white rounded-lg transition-all shadow-sm"
                                        title="Archive Signal"
                                    >
                                        <CheckCircleIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-[#f7f3ed]/30 text-center border-t border-[#f7f3ed]">
                        <button className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1c1917]/30 hover:text-[#d97757] transition-all italic font-serif">
                            Access Control Interface
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
