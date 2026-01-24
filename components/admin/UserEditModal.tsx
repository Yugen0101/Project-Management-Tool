'use client';

import { useState } from 'react';
import { XMarkIcon, UserCircleIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { updateUser } from '@/app/actions/users';

interface User {
    id: string;
    full_name: string;
    email: string;
    role: string;
}

export default function UserEditModal({
    user,
    onClose,
    onSuccess
}: {
    user: User;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [fullName, setFullName] = useState(user.full_name);
    const [role, setRole] = useState(user.role);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await updateUser(user.id, { full_name: fullName, role });

        if (result.success) {
            onSuccess();
            onClose();
        } else {
            setError(result.error || 'Failed to update user profile.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-0">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#1c1917]/20 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-[#fdfcf9] border border-[#e5dec9] rounded-[2.5rem] shadow-2xl shadow-[#1c1917]/10 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent-500/20">
                                <UserCircleIcon className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-[#1c1917] tracking-tight uppercase">Update Personnel</h2>
                                <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em] mt-1">Registry Protocol 4.2.0</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-[#1c1917]/20 hover:text-accent-500 transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-700 px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-tight">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] ml-1">Full Legal Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="w-full px-6 py-4 bg-white border border-[#e5dec9] rounded-2xl text-[13px] font-black text-[#1c1917] focus:border-accent-500 focus:ring-0 transition-all placeholder:text-[#1c1917]/10 shadow-sm"
                                    placeholder="Enter operator name"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] ml-1">Clearance Tier</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'admin', label: 'Admin', icon: ShieldCheckIcon },
                                        { id: 'associate', label: 'Lead', icon: UserCircleIcon },
                                        { id: 'member', label: 'Member', icon: UserGroupIcon }
                                    ].map((tier) => {
                                        const Icon = tier.icon;
                                        const isSelected = role === tier.id;
                                        return (
                                            <button
                                                key={tier.id}
                                                type="button"
                                                onClick={() => setRole(tier.id)}
                                                className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all space-y-3 ${isSelected
                                                        ? 'bg-[#1c1917] border-[#1c1917] text-white shadow-xl shadow-[#1c1917]/10'
                                                        : 'bg-white border-[#e5dec9] text-[#1c1917]/30 hover:border-accent-100 hover:bg-[#f7f3ed]'
                                                    }`}
                                            >
                                                <Icon className="w-6 h-6" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{tier.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-8 py-4 bg-white border border-[#e5dec9] rounded-[1.25rem] text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.2em] hover:bg-[#f7f3ed] hover:text-[#1c1917] transition-all"
                            >
                                Abort
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-8 py-4 bg-accent-500 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent-600 shadow-xl shadow-accent-500/20 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Synchronizing...' : 'Push Updates'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="px-10 py-6 bg-[#f7f3ed]/50 border-t border-[#e5dec9] flex items-center justify-between">
                    <span className="text-[9px] font-black text-[#1c1917]/20 uppercase tracking-[0.2em]">Operational Entity: {user.email}</span>
                </div>
            </div>
        </div>
    );
}
