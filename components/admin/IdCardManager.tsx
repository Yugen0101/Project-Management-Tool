'use client';

import { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import IdCardCreator from './IdCardCreator';
import IdCardList from './IdCardList';

interface User {
    id: string;
    full_name: string;
    email: string;
    role: 'admin' | 'associate' | 'member';
}

interface IdCardManagerProps {
    initialCards: any[];
    users: User[];
}

export default function IdCardManager({ initialCards, users }: IdCardManagerProps) {
    const [showCreator, setShowCreator] = useState(false);
    const [filters, setFilters] = useState({ role: '', status: '', search: '' });

    const stats = {
        total: initialCards.length,
        active: initialCards.filter(c => c.status === 'active').length,
        revoked: initialCards.filter(c => c.status === 'revoked').length,
        suspended: initialCards.filter(c => c.status === 'suspended').length
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 border border-[#e5dec9]">
                    <p className="text-xs font-medium text-[#78716c] uppercase tracking-wider">Total Cards</p>
                    <p className="text-3xl font-semibold text-[#1c1917] mt-2">{stats.total}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <p className="text-xs font-medium text-green-700 uppercase tracking-wider">Active</p>
                    <p className="text-3xl font-semibold text-green-700 mt-2">{stats.active}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                    <p className="text-xs font-medium text-yellow-700 uppercase tracking-wider">Suspended</p>
                    <p className="text-3xl font-semibold text-yellow-700 mt-2">{stats.suspended}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <p className="text-xs font-medium text-red-700 uppercase tracking-wider">Revoked</p>
                    <p className="text-3xl font-semibold text-red-700 mt-2">{stats.revoked}</p>
                </div>
            </div>

            {/* Header with filters and actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#78716c]" />
                        <input
                            type="text"
                            placeholder="Search cards..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="pl-12 pr-4 py-3 bg-white border border-[#e5dec9] rounded-xl text-sm focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none w-64"
                        />
                    </div>

                    <select
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                        className="px-4 py-3 bg-white border border-[#e5dec9] rounded-xl text-sm focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none font-medium"
                    >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="associate">Associate</option>
                        <option value="member">Member</option>
                    </select>

                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="px-4 py-3 bg-white border border-[#e5dec9] rounded-xl text-sm focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none font-medium"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="revoked">Revoked</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>

                <button
                    onClick={() => setShowCreator(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#d97757] hover:bg-[#c26242] text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-[#d97757]/20"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create ID Card
                </button>
            </div>

            {/* Card list */}
            <IdCardList cards={initialCards} filters={filters} />

            {/* Creator modal */}
            {showCreator && (
                <IdCardCreator
                    users={users}
                    onClose={() => setShowCreator(false)}
                    onSuccess={() => {
                        setShowCreator(false);
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
}
