'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

interface AdminProfileSectionProps {
    user: {
        full_name: string;
    };
}

export default function AdminProfileSection({ user }: AdminProfileSectionProps) {
    const [showSignOut, setShowSignOut] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <div className="space-y-3">
            {showSignOut && (
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all animate-in slide-in-from-bottom-2 duration-300"
                >
                    <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                    <span>Terminate Session</span>
                </button>
            )}
            
            <button 
                onClick={() => setShowSignOut(!showSignOut)}
                className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-300 group ${showSignOut ? 'bg-primary-50 ring-1 ring-primary-100' : 'bg-secondary-50 hover:bg-secondary-100'}`}
            >
                <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center font-bold text-primary-600 text-sm shadow-sm group-hover:scale-105 transition-transform">
                    {user.full_name?.charAt(0)}
                </div>
                <div className="truncate text-left flex-1">
                    <p className="text-sm font-bold text-secondary-900 truncate">{user.full_name}</p>
                    <p className="text-[10px] font-medium text-secondary-400 truncate tracking-tight uppercase">System Administrator</p>
                </div>
            </button>
        </div>
    );
}
