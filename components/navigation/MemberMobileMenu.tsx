'use client';

import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    ClipboardDocumentListIcon,
    FolderIcon,
    ClockIcon,
    VideoCameraIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline';

const navItems = [
    { name: 'Workspace', href: '/member/tasks', icon: ClipboardDocumentListIcon },
    { name: 'Projects', href: '/member/projects', icon: FolderIcon },
    { name: 'Activity', href: '/member/activity', icon: ClockIcon },
    { name: 'Meetings', href: '/member/meetings', icon: VideoCameraIcon },
    { name: 'User Guide', href: '/member/guide', icon: BookOpenIcon },
];

export default function MemberMobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <div className="lg:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-[#1c1917]/40 hover:text-accent-500 transition-colors"
            >
                <Bars3Icon className="w-6 h-6" />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[60] bg-[#1c1917]/20 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="fixed inset-y-0 left-0 z-[70] w-72 bg-[#fdfcf9] border-r border-[#e5dec9] shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
                        <div className="p-6 flex items-center justify-between border-b border-[#e5dec9]">
                            <h2 className="text-lg font-semibold text-[#1c1917] tracking-tight uppercase">MENU</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-[#1c1917]/20 hover:text-accent-500 transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
                            {navItems.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all ${isActive
                                            ? 'bg-accent-500 text-white shadow-xl shadow-accent-500/20'
                                            : 'text-[#1c1917]/30 hover:text-accent-500 hover:bg-[#f7f3ed]'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </>
            )}
        </div>
    );
}
