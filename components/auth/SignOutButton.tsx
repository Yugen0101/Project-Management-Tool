'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { PowerIcon } from '@heroicons/react/24/outline';

export default function SignOutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <button
            onClick={handleSignOut}
            className="flex items-center gap-4 group transition-all hover:translate-x-1"
            title="Sign Out"
        >
            <div className="w-9 h-9 bg-[#1c1917]/5 rounded-xl flex items-center justify-center group-hover:bg-[#1c1917] group-hover:text-white transition-all shadow-sm border border-[#e5dec9]">
                <PowerIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-[#1c1917]/70 uppercase tracking-[0.4em] group-hover:text-[#1c1917] transition-colors">Sign Out</span>
        </button>
    );
}
