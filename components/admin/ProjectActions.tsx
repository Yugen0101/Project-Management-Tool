'use client';

import { useState } from 'react';
import { ShareIcon, ArchiveBoxIcon, ArrowPathIcon, ArrowDownTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import ShareModal from '@/components/admin/ShareModal';
import { archiveProject, exportProjectData, deleteProject } from '@/app/actions/projects';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProjectActions({
    projectId,
    status,
    isPublic,
    shareToken,
    userRole
}: {
    projectId: string;
    status: string;
    isPublic: boolean;
    shareToken?: string;
    userRole: string;
}) {
    const [showShareModal, setShowShareModal] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    async function handleArchive() {
        if (!confirm('Are you sure you want to archive this project? It will be hidden from the main dashboard.')) return;

        setIsArchiving(true);
        const result = await archiveProject(projectId);
        if (result.success) {
            toast.success('Project archived successfully');
        } else {
            toast.error(result.error || 'Failed to archive project');
        }
        setIsArchiving(false);
    }

    async function handleExport() {
        const result = await exportProjectData(projectId);
        if (result.success && result.data) {
            const { csv, fileName } = result.data;
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'export.csv';
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Project data exported');
        } else if (!result.success) {
            toast.error(result.error || 'Failed to export data');
        }
    }

    async function handleDelete() {
        if (!confirm('CRITICAL: Are you sure you want to PERMANENTLY DELETE this project? This action cannot be undone and all associated data will be lost.')) return;

        setIsDeleting(true);
        const result = await deleteProject(projectId);
        if (result.success) {
            toast.success('Project permanently deleted');
            router.push('/admin/projects');
        } else {
            toast.error(result.error || 'Failed to delete project');
        }
        setIsDeleting(false);
    }

    return (
        <div className="flex gap-3">
            <button
                onClick={handleExport}
                className="btn-secondary flex items-center gap-2"
            >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Export
            </button>

            <button
                onClick={() => setShowShareModal(true)}
                className="btn-secondary flex items-center gap-2"
            >
                <ShareIcon className="w-5 h-5" />
                Share
            </button>

            {status !== 'archived' && (
                <button
                    onClick={handleArchive}
                    disabled={isArchiving}
                    className="btn-secondary flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                    <ArchiveBoxIcon className="w-5 h-5" />
                    Archive
                </button>
            )}

            {userRole === 'admin' && (
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="btn-secondary flex items-center gap-2 text-red-700 bg-red-50 border-red-200 hover:bg-red-100 font-bold transition-all hover:scale-[1.02]"
                >
                    <TrashIcon className="w-5 h-5" />
                    Hard Delete
                </button>
            )}

            {showShareModal && (
                <ShareModal
                    projectId={projectId}
                    initialIsPublic={isPublic}
                    initialToken={shareToken}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    );
}
