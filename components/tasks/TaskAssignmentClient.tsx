'use client';

import { useState } from 'react';
import { UserIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { revalidatePath } from 'next/cache';
import { updateTaskStatus } from '@/app/actions/tasks'; // Wait, I need a specific task update action
import { toast } from 'sonner';

// I'll assume there's a generic task update action or I'll create one
import { assignTask } from '@/app/actions/tasks';

interface Member {
    user: {
        id: string;
        full_name: string;
        email: string;
    };
    role: string;
}

export default function TaskAssignmentClient({
    taskId,
    currentAssigneeId,
    projectId,
    members
}: {
    taskId: string;
    currentAssigneeId: string | null;
    projectId: string;
    members: Member[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAssign = async (userId: string) => {
        if (userId === currentAssigneeId) {
            setIsOpen(false);
            return;
        }

        setLoading(true);
        const result = await assignTask(taskId, userId);

        if (result.success) {
            toast.success('Task reassigned');
            setIsOpen(false);
            window.location.reload();
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 bg-white text-primary-600 font-medium rounded-2xl hover:bg-slate-50 transition-colors shadow-lg shadow-black/10 flex items-center justify-center gap-2"
            >
                {loading ? 'SYNCING...' : 'Reassign User'}
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#e5dec9] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                        <button
                            onClick={() => handleAssign('')}
                            className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-medium uppercase tracking-widest transition-all flex items-center justify-between ${!currentAssigneeId ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            Unassigned
                            {!currentAssigneeId && <CheckIcon className="w-4 h-4" />}
                        </button>
                        {members.filter(m => m.user).map((member) => (
                            <button
                                key={member.user.id}
                                onClick={() => handleAssign(member.user.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-medium uppercase tracking-widest transition-all flex items-center justify-between ${currentAssigneeId === member.user.id ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px]">
                                        {member.user.full_name?.charAt(0) || '?'}
                                    </div>
                                    {member.user.full_name}
                                </div>
                                {currentAssigneeId === member.user.id && <CheckIcon className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
