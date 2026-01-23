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

    if (loading) return <div className="h-24 animate-pulse bg-slate-900/40 rounded-xl border border-slate-800/50" />;
    if (!metrics) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-5 bg-slate-900/40 border border-slate-800/50 hover:border-primary-500/30 transition-all">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20">
                        <CheckBadgeIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">Optimization Rate</p>
                        <p className="text-2xl font-black text-white">{metrics.completed_tasks}</p>
                    </div>
                </div>
            </div>

            <div className="card p-5 bg-slate-900/40 border border-slate-800/50 hover:border-red-500/30 transition-all">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20">
                        <ClockIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">Overdue Latency</p>
                        <p className="text-2xl font-black text-white">{metrics.overdue_tasks}</p>
                    </div>
                </div>
            </div>

            <div className="card p-5 bg-slate-900/40 border border-slate-800/50 hover:border-primary-500/30 transition-all">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-primary-500/10 rounded-xl text-primary-400 border border-primary-500/20">
                        <BoltIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">System Efficiency</p>
                        <p className="text-2xl font-black text-white">
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
