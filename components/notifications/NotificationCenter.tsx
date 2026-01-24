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
                className="relative w-11 h-11 flex items-center justify-center bg-secondary-50 hover:bg-primary-50 hover:text-primary-600 rounded-xl text-secondary-400 border border-border transition-all duration-300 shadow-sm"
            >
                <BellIcon className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full ring-4 ring-white shadow-lg transition-transform hover:scale-110">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-premium border border-border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-secondary-50/50">
                        <div>
                            <h3 className="text-sm font-bold text-secondary-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                                Notifications
                            </h3>
                            <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mt-1">Real-time Activity</p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-[10px] font-bold uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-2"
                            >
                                <TrashIcon className="w-3.5 h-3.5" />
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="max-h-[450px] overflow-y-auto custom-scrollbar bg-white">
                        {notifications.length === 0 && !loading && (
                            <div className="py-20 text-center px-10">
                                <div className="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center text-secondary-200 mx-auto mb-6">
                                    <InboxIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-sm font-bold text-secondary-900">No Notifications</h3>
                                <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mt-2">Your inbox is currently empty.</p>
                            </div>
                        )}

                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`p-6 border-b border-border hover:bg-secondary-50/30 transition-all group relative ${!n.is_read ? 'bg-primary-50/20' : ''}`}
                            >
                                <div className="flex gap-5">
                                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${!n.is_read ? 'bg-white border-primary-100 text-primary-600' : 'bg-secondary-50 border-border text-secondary-400'}`}>
                                        <BellIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold text-secondary-900 leading-none">{n.title}</p>
                                            {!n.is_read && (
                                                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                                            )}
                                        </div>
                                        <p className="text-xs font-medium text-secondary-500 leading-snug">{n.content}</p>
                                        {n.link && (
                                            <Link
                                                href={n.link}
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    handleMarkAsRead(n.id);
                                                }}
                                                className="inline-block text-[10px] font-bold text-primary-600 uppercase tracking-widest hover:text-primary-700 transition-colors mt-2"
                                            >
                                                View Details →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                {!n.is_read && (
                                    <button
                                        onClick={() => handleMarkAsRead(n.id)}
                                        className="opacity-0 group-hover:opacity-100 absolute top-6 right-6 p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                        title="Mark as Read"
                                    >
                                        <CheckCircleIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-secondary-50/50 text-center border-t border-border">
                        <button className="text-[10px] font-bold uppercase tracking-widest text-secondary-400 hover:text-primary-600 transition-colors">
                            Manage All Activity
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
