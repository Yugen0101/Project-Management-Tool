'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
    CalendarDaysIcon,
    RocketLaunchIcon,
    CheckBadgeIcon,
    ClockIcon,
    ChevronRightIcon,
    Bars3CenterLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Sprint {
    id: string;
    name: string;
    goal: string | null;
    start_date: string;
    end_date: string;
    status: 'planned' | 'active' | 'completed';
    project: {
        name: string;
    };
    tasks_count: number;
    completed_tasks_count: number;
}

export default function AssociateSprintsClient({ initialSprints }: { initialSprints: Sprint[] }) {
    const [filter, setFilter] = useState<'all' | 'active' | 'planned' | 'completed'>('active');

    const filteredSprints = initialSprints.filter(s => filter === 'all' || s.status === filter);

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent-500 mb-1">
                        <CalendarDaysIcon className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Temporal Scheduling</span>
                    </div>
                    <h1 className="text-4xl font-semibold text-[#1c1917] tracking-tighter uppercase">
                        Sprint <span className="text-accent-500">Matrix</span>
                    </h1>
                    <p className="text-[#1c1917]/50 font-medium text-sm uppercase tracking-widest">
                        Managing {initialSprints.length} delivery cycles across active nodes
                    </p>
                </div>

                <div className="flex items-center gap-3 p-2 bg-[#f7f3ed] rounded-2xl border border-[#e5dec9] shadow-inner">
                    {[
                        { id: 'all', label: 'ALL' },
                        { id: 'active', label: 'ACTIVE' },
                        { id: 'planned', label: 'PLANNED' },
                        { id: 'completed', label: 'FINALIZED' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id as any)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-bold tracking-widest transition-all ${filter === tab.id ? 'bg-white text-accent-500 shadow-md shadow-accent-500/5 ring-1 ring-accent-500/10' : 'text-[#1c1917]/30 hover:text-[#1c1917]/60'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredSprints.map((sprint) => {
                    const progress = sprint.tasks_count > 0 ? (sprint.completed_tasks_count / sprint.tasks_count) * 100 : 0;

                    return (
                        <div key={sprint.id} className="card !p-0 bg-white border-[#e5dec9] shadow-lg shadow-[#d9cfb0]/10 group hover:border-accent-200 transition-all overflow-hidden">
                            <div className="p-8 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-[#f7f3ed] text-[9px] font-bold uppercase text-accent-500 rounded-xl border border-[#e5dec9] tracking-widest">
                                                {sprint.project.name}
                                            </span>
                                            {sprint.status === 'active' && (
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-[9px] font-bold uppercase text-green-600 rounded-xl border border-green-100 tracking-widest animate-pulse">
                                                    <RocketLaunchIcon className="w-3 h-3" />
                                                    Active Cycle
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#1c1917] uppercase tracking-tight group-hover:text-accent-500 transition-colors">
                                            {sprint.name}
                                        </h3>
                                        <p className="text-sm text-[#1c1917]/40 font-medium italic line-clamp-1 italic">
                                            "{sprint.goal || 'No specific objective defined for this cycle.'}"
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[24px] font-bold text-[#1c1917] tracking-tighter">{Math.round(progress)}%</div>
                                        <div className="text-[9px] font-bold text-[#1c1917]/20 uppercase tracking-widest">Saturation</div>
                                    </div>
                                </div>

                                {/* Progress Visual */}
                                <div className="h-3 bg-[#f7f3ed] rounded-full overflow-hidden border border-[#e5dec9] p-0.5">
                                    <div
                                        className="h-full bg-accent-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(217,119,87,0.3)]"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>

                                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#f7f3ed]">
                                    <div>
                                        <div className="text-[9px] font-bold text-[#1c1917]/20 uppercase tracking-widest mb-1">Timeline</div>
                                        <div className="text-[11px] font-bold text-[#1c1917]/60 uppercase tracking-tight flex items-center gap-1.5">
                                            <ClockIcon className="w-4 h-4 text-accent-500" />
                                            {format(new Date(sprint.start_date), 'MM.dd.yy')} - {format(new Date(sprint.end_date), 'MM.dd.yy')}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-bold text-[#1c1917]/20 uppercase tracking-widest mb-1">Units</div>
                                        <div className="text-[11px] font-bold text-[#1c1917]/60 uppercase tracking-tight flex items-center gap-1.5">
                                            <Bars3CenterLeftIcon className="w-4 h-4 text-accent-500" />
                                            {sprint.tasks_count} Nodes Assigned
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center justify-end">
                                        <Link
                                            href={`/associate/sprints/${sprint.id}`}
                                            className="w-10 h-10 bg-[#1c1917] rounded-xl flex items-center justify-center text-white hover:bg-accent-500 transition-all shadow-xl shadow-[#1c1917]/10"
                                        >
                                            <ChevronRightIcon className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredSprints.length === 0 && (
                    <div className="lg:col-span-2 py-32 flex flex-col items-center justify-center card bg-white border-dashed border-2 border-[#e5dec9] rounded-[3rem]">
                        <div className="w-24 h-24 bg-[#f7f3ed] rounded-[2rem] flex items-center justify-center text-[#1c1917]/10 mb-8">
                            <CalendarDaysIcon className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#1c1917] uppercase tracking-tighter">No Cycles Detected</h3>
                        <p className="text-[#1c1917]/30 text-xs font-bold uppercase tracking-[0.2em] mt-3">Try adjusting your status matrix.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
