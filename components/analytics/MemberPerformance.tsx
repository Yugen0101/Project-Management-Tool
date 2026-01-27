'use client';

import { useEffect, useState } from 'react';
import { getMyPerformance } from '@/app/actions/analytics';
import {
    CheckBadgeIcon,
    ClockIcon,
    BoltIcon
} from '@heroicons/react/24/outline';

export default function MemberPerformance() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const res = await getMyPerformance();
            if (res.success) setMetrics(res.data);
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) return <div className="h-24 animate-pulse bg-beige-100 rounded-2xl border border-beige-200" />;
    if (!metrics) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card !p-6 bg-white border-beige-100 group hover:border-[#7c9473]/30 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-[#7c9473]/10 rounded-xl text-[#7c9473] border border-[#7c9473]/20 shadow-sm">
                        <CheckBadgeIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-[#1c1917]/30 uppercase tracking-[0.2em] leading-none mb-2">Resolved</p>
                        <p className="text-2xl font-semibold text-[#1c1917] tracking-tight">{metrics.completed_tasks}</p>
                    </div>
                </div>
            </div>

            <div className="card !p-6 bg-white border-beige-100 group hover:border-[#c85a54]/30 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-[#c85a54]/10 rounded-xl text-[#c85a54] border border-[#c85a54]/20 shadow-sm">
                        <ClockIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-[#1c1917]/30 uppercase tracking-[0.2em] leading-none mb-2">Overdue</p>
                        <p className="text-2xl font-semibold text-[#c85a54] tracking-tight">{metrics.overdue_tasks}</p>
                    </div>
                </div>
            </div>

            <div className="card !p-6 bg-white border-beige-100 group hover:border-accent-200 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-accent-50 rounded-xl text-accent-500 border border-accent-100 shadow-sm">
                        <BoltIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-[#1c1917]/30 uppercase tracking-[0.2em] leading-none mb-2">Efficiency</p>
                        <p className="text-2xl font-black text-[#1c1917] tracking-tight">
                            {metrics.completed_tasks + metrics.active_tasks > 0
                                ? Math.round((metrics.completed_tasks / (metrics.completed_tasks + metrics.active_tasks)) * 100)
                                : 0}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
