'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/app/actions/projects';
import {
    ArrowLeftIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NewProjectForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const end_date = formData.get('end_date') as string;

        try {
            const result = await createProject({
                name,
                description,
                end_date,
            });

            if (result.success) {
                router.push('/admin/projects');
                router.refresh();
            } else {
                setError(result.error || 'Failed to create project.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Link
                href="/admin/projects"
                className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-6 group"
            >
                <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Projects
            </Link>

            <div className="card shadow-2xl shadow-black/20 overflow-hidden border border-slate-800/50 backdrop-blur-md">
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white relative">
                    <div className="relative z-10">
                        <h1 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                            <RocketLaunchIcon className="w-8 h-8" />
                            Initialize Project Node
                        </h1>
                        <p className="text-primary-100 text-sm font-medium opacity-80">
                            Deploy a new operational workspace for strategic coordination.
                        </p>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-slate-900/40">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
                                Project Designation
                            </label>
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="e.g. Q1 Marketing Campaign"
                                className="input focus:ring-4 ring-primary-50"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
                                Operational Briefing
                            </label>
                            <textarea
                                name="description"
                                rows={4}
                                placeholder="What is this project about? Goals, objectives..."
                                className="input py-3 focus:ring-4 ring-primary-50"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
                                Deadline Synchronicity
                            </label>
                            <input
                                name="end_date"
                                type="date"
                                required
                                className="input focus:ring-4 ring-primary-50"
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 btn-primary py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Initializing...
                                </>
                            ) : 'Establish Workspace'}
                        </button>
                        <Link
                            href="/admin/projects"
                            className="px-6 py-4 text-slate-500 font-black uppercase tracking-widest hover:text-white transition-all text-[10px]"
                        >
                            Abort
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
