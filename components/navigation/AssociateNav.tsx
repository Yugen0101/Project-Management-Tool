'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    HomeIcon,
    FolderIcon,
    ListBulletIcon,
    CalendarIcon,
    ChartBarIcon,
    VideoCameraIcon,
    BookOpenIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline';

const navItems = [
    { href: '/associate/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/associate/projects', label: 'My Projects', icon: FolderIcon },
    { href: '/associate/id-card', label: 'ID Card', icon: IdentificationIcon },
    { href: '/associate/sprints', label: 'Sprints', icon: CalendarIcon },
    { href: '/associate/reports', label: 'Analytics', icon: ChartBarIcon },
    { href: '/associate/meetings', label: 'Meetings', icon: VideoCameraIcon },
    { href: '/associate/guide', label: 'User Guide', icon: BookOpenIcon },
];

export default function AssociateNav() {
    const pathname = usePathname();

    return (
        <nav className="flex-1 px-6 py-6 space-y-3 overflow-y-auto">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all ${isActive
                            ? 'bg-accent-500 text-white shadow-xl shadow-accent-500/20'
                            : 'text-[#1c1917]/70 hover:text-accent-500 hover:bg-[#f7f3ed]'
                            }`}
                    >
                        <Icon className={`w-5 h-5 transition-transform ${!isActive && 'hover:scale-110'}`} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
