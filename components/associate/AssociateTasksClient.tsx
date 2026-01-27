'use client';

import { useState } from 'react';
import {
    ClipboardDocumentListIcon,
    MagnifyingGlassIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string;
    created_at: string;
    project: {
        name: string;
    } | null;
    assigned_user: {
        full_name: string;
    } | null;
}

export default function AssociateTasksClient({ initialTasks }: { initialTasks: Task[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTasks = initialTasks.filter(task => {
        const search = searchQuery.toLowerCase();
        return (
            task.title.toLowerCase().includes(search) ||
            task.description?.toLowerCase().includes(search) ||
            task.project?.name.toLowerCase().includes(search) ||
            task.assigned_user?.full_name.toLowerCase().includes(search)
        );
    });

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent-500 mb-1">
                        <ClipboardDocumentListIcon className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Lead Matrix</span>
                    </div>
                    <h1 className="text-4xl font-semibold text-[#1c1917] tracking-tighter uppercase">
                        Project <span className="text-accent-500">Tasks</span>
                    </h1>
                    <p className="text-[#1c1917]/50 font-medium text-sm uppercase tracking-widest">
                        Monitoring {filteredTasks.length} operational units across managed nodes
                    </p>
                </div>

                <div className="relative w-full md:w-[28rem] group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1c1917]/20 group-focus-within:text-accent-600 transition-colors">
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search operational units..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 bg-white border border-[#e5dec9] rounded-2xl text-[11px] font-bold text-[#1c1917] placeholder-[#1c1917]/20 focus:outline-none focus:border-accent-500/40 focus:ring-8 focus:ring-accent-500/5 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <Link href={`/associate/tasks/${task.id}`} key={task.id} className="card !p-0 bg-white border-[#e5dec9] shadow-lg shadow-[#d9cfb0]/10 hover:border-accent-200 transition-all block group">
                            <div className="p-8 flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 bg-[#f7f3ed] text-[9px] font-bold uppercase text-accent-500 rounded-xl border border-[#e5dec9] tracking-widest">
                                            {task.project?.name || 'GENERIC NODE'}
                                        </span>
                                        <span className={`badge ${task.status === 'completed' ? 'badge-success' :
                                            task.status === 'in_progress' ? 'badge-warning' :
                                                'badge-info'
                                            }`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1c1917] mb-2 group-hover:text-accent-500 transition-colors uppercase tracking-tight">{task.title}</h3>
                                    <p className="text-sm text-[#1c1917]/40 font-medium italic line-clamp-1 mb-4">{task.description || 'No additional parameters provided.'}</p>
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-[#1c1917]/30 uppercase tracking-[0.1em]">
                                        <span className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-500/30"></div>
                                            Personnel: {task.assigned_user?.full_name || 'Unassigned'}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-[#1c1917] rounded-xl flex items-center justify-center text-white group-hover:bg-accent-500 transition-all ml-8 shadow-xl shadow-[#1c1917]/10">
                                    <ChevronRightIcon className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="py-32 flex flex-col items-center justify-center card bg-white border-dashed border-2 border-[#e5dec9] rounded-[3rem]">
                        <div className="w-24 h-24 bg-[#f7f3ed] rounded-[2rem] flex items-center justify-center text-[#1c1917]/10 mb-8 animate-pulse">
                            <ClipboardDocumentListIcon className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#1c1917] uppercase tracking-tighter">No Units Detected</h3>
                        <p className="text-[#1c1917]/30 text-xs font-bold uppercase tracking-[0.2em] mt-3">Try adjusting your search parameters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
