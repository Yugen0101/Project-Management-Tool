'use client';

import { useState, useRef, useEffect } from 'react';
import {
    EllipsisHorizontalIcon,
    KeyIcon,
    NoSymbolIcon,
    CheckIcon,
    TrashIcon,
    PencilSquareIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';
import { toggleUserStatus, resetUserPassword, deleteUser, toggleMeetingPermission } from '@/app/actions/users';
import UserEditModal from './UserEditModal';

interface User {
    id: string;
    full_name: string;
    email: string;
    is_active: boolean;
    role: string;
    can_schedule_meetings: boolean;
}

export default function UserActionMenu({ user }: { user: User }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = async () => {
        const result = await toggleUserStatus(user.id, !user.is_active);
        if (!result.success) alert(result.error);
        else window.location.reload();
    };

    const handleReset = async () => {
        if (!confirm('Reset password for this user?')) return;
        const result = await resetUserPassword(user.id);
        if (!result.success) alert(result.error);
        else alert(`Temporary password: ${result.data?.tempPassword}`);
    };

    const handleTogglePermission = async () => {
        const result = await toggleMeetingPermission(user.id, !user.can_schedule_meetings);
        if (!result.success) alert(result.error);
        else window.location.reload();
    };

    const handleDelete = async () => {
        if (confirm('Permanently delete this user? This will purge all associated data.')) {
            const result = await deleteUser(user.id);
            if (!result.success) alert(result.error);
            else window.location.reload();
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-9 h-9 flex items-center justify-center bg-secondary-50 hover:bg-primary-50 rounded-xl text-secondary-400 border border-border group transition-all duration-300"
            >
                <EllipsisHorizontalIcon className="w-5 h-5 group-hover:text-primary-600" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-[1.25rem] shadow-premium border border-border py-2 z-50 animate-in fade-in zoom-in-95 duration-300">
                    <button
                        onClick={() => {
                            setIsEditModalOpen(true);
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-secondary-600 hover:bg-secondary-50 hover:text-primary-600 flex items-center gap-3 transition-colors"
                    >
                        <PencilSquareIcon className="w-4 h-4" />
                        Edit Personnel
                    </button>
                    <button
                        onClick={handleToggle}
                        className="w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-secondary-600 hover:bg-secondary-50 hover:text-primary-600 flex items-center gap-3 transition-colors"
                    >
                        {user.is_active ? <NoSymbolIcon className="w-4 h-4" /> : <CheckIcon className="w-4 h-4" />}
                        {user.is_active ? 'Deactivate Node' : 'Initialize Node'}
                    </button>
                    {user.role === 'associate' && (
                        <button
                            onClick={handleTogglePermission}
                            className="w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-secondary-600 hover:bg-secondary-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                        >
                            <VideoCameraIcon className={`w-4 h-4 ${user.can_schedule_meetings ? 'text-indigo-500' : 'text-secondary-400'}`} />
                            {user.can_schedule_meetings ? 'Restrict Zoom' : 'Enable Zoom'}
                        </button>
                    )}
                    <button
                        onClick={handleReset}
                        className="w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-secondary-600 hover:bg-secondary-50 hover:text-primary-600 flex items-center gap-3 transition-colors"
                    >
                        <KeyIcon className="w-4 h-4" />
                        Reset Password
                    </button>
                    <div className="border-t border-border my-2 mx-4" />
                    <button
                        onClick={handleDelete}
                        className="w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Delete Account
                    </button>
                </div>
            )}

            {isEditModalOpen && (
                <UserEditModal
                    user={user}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={() => window.location.reload()}
                />
            )}
        </div>
    );
}
