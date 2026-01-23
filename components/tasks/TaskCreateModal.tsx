'use client';

import { useState } from 'react';
import {
    XMarkIcon,
    CalendarIcon,
    UserIcon,
    FlagIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { createTask } from '@/app/actions/tasks';
import { toast } from 'sonner';

interface Member {
    user: {
        id: string;
        full_name: string;
        email: string;
    };
    role: string;
}

export default function TaskCreateModal({
    projectId,
    columnId,
    members,
    onClose,
    onSuccess
}: {
    projectId: string;
    columnId: string;
    members: Member[];
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: '',
        deadline: '',
        project_id: projectId,
        kanban_column_id: columnId
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await createTask(formData);

        if (result.success) {
            toast.success('Task created successfully');
            onSuccess();
            onClose();
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1c1917]/40 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-[#e5dec9] animate-in zoom-in-95 duration-500">
                {/* Header */}
                <div className="px-10 py-8 border-b border-[#f7f3ed] flex items-center justify-between bg-[#f7f3ed]/30">
                    <div>
                        <h2 className="text-2xl font-black text-[#1c1917] tracking-tight uppercase">NEW TASK UNIT</h2>
                        <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em] mt-1">Initialise operational task parameters</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-[#e5dec9] flex items-center justify-center text-[#1c1917]/40 hover:text-[#d97757] transition-all">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] ml-1">Task Title</label>
                        <input
                            type="text"
                            required
                            className="input py-4 bg-[#fdfcf9]"
                            placeholder="e.g., Implement Auth logic"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] ml-1">Description</label>
                        <textarea
                            className="input py-4 bg-[#fdfcf9] min-h-[100px] resize-none"
                            placeholder="Detailed mission objectives..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] ml-1">Priority</label>
                            <select
                                className="input py-4 bg-[#fdfcf9] appearance-none"
                                value={formData.priority}
                                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] ml-1">Deadline</label>
                            <input
                                type="date"
                                className="input py-4 bg-[#fdfcf9]"
                                value={formData.deadline}
                                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] ml-1">Assign Asset</label>
                        <select
                            className="input py-4 bg-[#fdfcf9] appearance-none"
                            value={formData.assigned_to}
                            onChange={e => setFormData({ ...formData, assigned_to: e.target.value })}
                        >
                            <option value="">Unassigned</option>
                            {members.map(member => (
                                <option key={member.user.id} value={member.user.id}>{member.user.full_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1 py-4 border-[#e5dec9]"
                        >
                            ABORT
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.title}
                            className="btn-primary flex-1 py-4 disabled:opacity-50"
                        >
                            {loading ? 'INITIALISING...' : 'CREATE UNIT'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
