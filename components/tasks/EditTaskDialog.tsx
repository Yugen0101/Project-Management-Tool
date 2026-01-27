'use client';

import { useState } from 'react';
import { PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { updateTask } from '@/app/actions/tasks';
import { toast } from 'sonner';

export default function EditTaskDialog({ task }: { task: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form state
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [priority, setPriority] = useState(task.priority);
    const [dueDate, setDueDate] = useState(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await updateTask(task.id, {
            title,
            description,
            priority,
            due_date: dueDate || null
        });

        if (result.success) {
            toast.success('Task updated successfully');
            setIsOpen(false);
        } else {
            toast.error(result.error || 'Failed to update task');
        }
        setLoading(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-secondary-400 hover:text-accent-500 hover:bg-accent-50 rounded-lg transition-colors"
                title="Edit Task"
            >
                <PencilSquareIcon className="w-5 h-5" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 space-y-6 animate-in zoom-in-95 duration-200 border border-[#e5dec9]">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-[#1c1917] tracking-tight">Edit Task Details</h3>
                        <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Modify mission parameters</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-secondary-400 hover:text-[#1c1917] hover:bg-[#f7f3ed] rounded-full transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#1c1917] uppercase tracking-wide">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-[#f7f3ed] border-0 rounded-xl text-[#1c1917] placeholder-secondary-400 focus:ring-2 focus:ring-accent-500/20 font-medium"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#1c1917] uppercase tracking-wide">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#f7f3ed] border-0 rounded-xl text-[#1c1917] focus:ring-2 focus:ring-accent-500/20 font-medium appearance-none"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#1c1917] uppercase tracking-wide">Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#f7f3ed] border-0 rounded-xl text-[#1c1917] focus:ring-2 focus:ring-accent-500/20 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#1c1917] uppercase tracking-wide">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-[#f7f3ed] border-0 rounded-xl text-[#1c1917] placeholder-secondary-400 focus:ring-2 focus:ring-accent-500/20 font-medium resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-3 text-xs font-bold text-secondary-600 hover:bg-[#f7f3ed] rounded-xl transition-colors uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 text-xs font-bold text-white bg-accent-500 hover:bg-accent-600 rounded-xl disabled:opacity-50 transition-colors shadow-lg shadow-accent-500/20 uppercase tracking-widest"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
