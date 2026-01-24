'use client';

import { useState } from 'react';
import { updateTaskStatus } from '@/app/actions/team';
import { CheckCircleIcon, PlayIcon, ListBulletIcon } from '@heroicons/react/24/solid';
import { toast } from 'sonner';

interface TaskStatusUpdateProps {
    taskId: string;
    currentStatus: string;
}

export default function TaskStatusUpdate({ taskId, currentStatus }: TaskStatusUpdateProps) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === status) return;
        
        setLoading(true);
        const res = await updateTaskStatus(taskId, newStatus);
        
        if (res.success) {
            setStatus(newStatus);
            toast.success(`Task moved to ${newStatus}`);
        } else {
            toast.error('Failed to update status');
        }
        setLoading(false);
    };

    const statuses = [
        { name: 'To Do', icon: ListBulletIcon, color: 'text-gray-400', bg: 'bg-gray-50' },
        { name: 'In Progress', icon: PlayIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
        { name: 'Completed', icon: CheckCircleIcon, color: 'text-emerald-500', bg: 'bg-emerald-50' }
    ];

    return (
        <div className="flex items-center gap-2">
            {statuses.map((s) => (
                <button
                    key={s.name}
                    onClick={() => handleStatusChange(s.name)}
                    disabled={loading}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${status === s.name 
                            ? `${s.bg} ${s.color} border border-current shadow-sm` 
                            : 'bg-white text-[#1c1917]/30 border border-[#e5dec9] hover:border-[#1c1917]/10'
                        }
                        disabled:opacity-50
                    `}
                >
                    <s.icon className={`w-4 h-4 ${status === s.name ? s.color : 'text-current opacity-30'}`} />
                    {s.name}
                </button>
            ))}
        </div>
    );
}
