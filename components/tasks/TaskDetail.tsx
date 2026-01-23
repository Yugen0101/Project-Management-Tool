'use client';

import { useState } from 'react';
import {
    XMarkIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    ChatBubbleLeftRightIcon,
    Bars3CenterLeftIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function TaskDetail({ task, onClose }: { task: any, onClose: () => void }) {
    const [status, setStatus] = useState(task.kanban_column);

    const statusColors: any = {
        backlog: 'bg-slate-100 text-slate-700',
        todo: 'bg-blue-100 text-blue-700',
        in_progress: 'bg-orange-100 text-orange-700',
        review: 'bg-purple-100 text-purple-700',
        done: 'bg-emerald-100 text-emerald-700'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-slate-950/90 border border-slate-800/50 backdrop-blur-2xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[status]}`}>
                            {status.replace('_', ' ')}
                        </span>
                        <div className="h-4 w-px bg-slate-800"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                            {task.project?.name || 'Project Task'}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
                    {/* Left: Content */}
                    <div className="flex-1 p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-slate-800/50">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">{task.title}</h1>
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-[10px] font-black text-primary-400">
                                        {task.assigned_user?.full_name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Designation</p>
                                        <p className="text-sm font-black text-white">{task.assigned_user?.full_name || 'Unassigned'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500">
                                        <CalendarIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Temporal Limit</p>
                                        <p className="text-sm font-black text-white">
                                            {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No limit'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Bars3CenterLeftIcon className="w-4 h-4" />
                                Operational Parameters
                            </h3>
                            <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 italic font-medium">
                                {task.description || 'No operational briefing provided.'}
                            </div>
                        </div>

                        {/* Checklist Section Placeholder */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-4 h-4" />
                                    Component Checklist
                                </div>
                                <span className="text-primary-500">0%</span>
                            </h3>
                            <div className="p-6 bg-slate-900/20 rounded-2xl border-2 border-dashed border-slate-800/50 text-center">
                                <p className="text-xs text-slate-600 font-black uppercase tracking-widest italic">No sub-routines detected</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar / Interaction */}
                    <div className="w-full lg:w-80 bg-slate-950/20 flex flex-col">
                        <div className="p-6 flex-1 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Discussion</h3>
                                <div className="space-y-4">
                                    {/* Comment entry */}
                                    <div className="relative">
                                        <textarea
                                            placeholder="Write a comment..."
                                            className="w-full bg-slate-900/50 border border-slate-800/50 rounded-xl p-3 text-sm focus:ring-4 ring-primary-500/10 min-h-[100px] shadow-sm italic text-slate-300 placeholder-slate-600 outline-none"
                                        ></textarea>
                                        <button className="absolute bottom-2 right-2 btn-primary py-1.5 px-4 text-[10px] font-black uppercase tracking-widest ring-2 ring-slate-950">
                                            Transmit
                                        </button>
                                    </div>

                                    {/* Comment feed placeholder */}
                                    <div className="space-y-4 pt-4">
                                        <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                                            <ChatBubbleLeftRightIcon className="w-12 h-12 mb-2 opacity-20" />
                                            <p className="text-xs font-bold italic uppercase tracking-tighter">No comments yet</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-900/30 border-t border-slate-800/50 flex flex-col gap-3">
                            <button className="btn-secondary w-full flex items-center justify-center gap-2">
                                <TagIcon className="w-5 h-5" />
                                Edit Priority
                            </button>
                            <button className="btn-primary w-full bg-slate-900 hover:bg-black">
                                Task History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
