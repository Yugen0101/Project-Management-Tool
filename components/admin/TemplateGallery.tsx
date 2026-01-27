'use client';

import { useState } from 'react';
import {
    XMarkIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';
import { createProjectFromTemplate } from '@/app/actions/projects';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    tasks_count?: number;
    thumbnail?: string;
}

export default function TemplateGallery({
    isOpen,
    onClose,
    templates
}: {
    isOpen: boolean;
    onClose: () => void;
    templates: Template[]
}) {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const categories = ['All', 'Project Templates', 'Software/IT', 'Construction', 'Pharma'];

    const handleCreate = async () => {
        if (!selectedTemplateId) {
            router.push('/admin/projects/new');
            onClose();
            return;
        }

        setIsCreating(true);
        const result = await createProjectFromTemplate(selectedTemplateId);
        setIsCreating(false);

        if (result.success) {
            toast.success('Project deployed from template successfully.');
            onClose();
            router.push(`/admin/projects/${result.data.id}`);
        } else {
            toast.error(result.error || 'Failed to deploy project.');
        }
    };

    const filteredTemplates = templates.filter(t => {
        const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory || (selectedCategory === 'Project Templates' && t.category);
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#1c1917]/60 backdrop-blur-xl"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl bg-[#fdfcf9] rounded-[3rem] shadow-2xl border border-[#e5dec9] overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-10 border-b border-[#e5dec9] bg-white flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-[#1c1917] tracking-tighter uppercase">Template Gallery</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-[#f7f3ed] rounded-2xl border border-[#e5dec9] text-[#1c1917]/20 hover:text-accent-500 hover:border-accent-200 transition-all"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Grid Header (Minimal) */}
                <div className="px-10 py-4 border-b border-[#e5dec9] bg-[#fdfcf9]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1c1917]/40">All Project Templates</span>
                </div>

                {/* Templates Grid */}
                <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-thin">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1c1917]/30 pl-4">Create New</h3>
                        <div
                            onClick={() => {
                                setSelectedTemplateId(null);
                                router.push('/admin/projects/new');
                                onClose();
                            }}
                            className="w-full max-w-[300px] aspect-[4/3] group cursor-pointer bg-white border-2 border-dashed border-[#e5dec9] rounded-[2rem] hover:border-accent-500 hover:shadow-2xl hover:shadow-accent-500/10 transition-all flex flex-col items-center justify-center gap-6 p-8"
                        >
                            <div className="w-16 h-16 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-500 group-hover:scale-110 transition-transform">
                                <PlusIcon className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-black text-[#1c1917] uppercase tracking-tight">Blank project</p>
                                <p className="text-[10px] font-medium text-[#1c1917]/40 uppercase mt-1 tracking-wider leading-relaxed">Start everything from scratch</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1c1917]/30 pl-4">Predefined Project Templates</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                            {filteredTemplates.map(template => (
                                <div
                                    key={template.id}
                                    onClick={() => setSelectedTemplateId(template.id)}
                                    className={`group cursor-pointer bg-white rounded-[2rem] border-2 transition-all overflow-hidden flex flex-col ${selectedTemplateId === template.id ? 'border-accent-500 shadow-2xl shadow-accent-500/10 scale-[1.02]' : 'border-[#e5dec9] hover:border-accent-200 shadow-sm'}`}
                                >
                                    <div className="aspect-[16/9] bg-[#f7f3ed] relative overflow-hidden flex items-center justify-center">
                                        <div className={`absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent transition-opacity ${selectedTemplateId === template.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                                        <BriefcaseIcon className={`w-16 h-16 transition-transform duration-500 ${selectedTemplateId === template.id ? 'text-accent-500 scale-110' : 'text-[#1c1917]/5 group-hover:scale-110'}`} />
                                        <div className="absolute top-4 left-4">
                                            <span className={`bg-white/90 backdrop-blur-md text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${selectedTemplateId === template.id ? 'text-accent-600 border-accent-200' : 'text-[#1c1917]/40 border-[#e5dec9]'}`}>
                                                {template.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-2">
                                        <p className={`text-sm font-black uppercase tracking-tight transition-colors ${selectedTemplateId === template.id ? 'text-accent-500' : 'text-[#1c1917] group-hover:text-accent-500'}`}>
                                            {template.name}
                                        </p>
                                        <p className="text-[10px] font-medium text-[#1c1917]/40 leading-relaxed line-clamp-2 italic font-serif">
                                            {template.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-[#e5dec9] bg-[#f7f3ed]/30 flex items-center justify-between px-10">
                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="no-show" className="w-4 h-4 rounded border-[#e5dec9] text-accent-500 focus:ring-accent-500" />
                        <label htmlFor="no-show" className="text-[10px] font-black uppercase tracking-widest text-[#1c1917]/40">Do not show this again</label>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="px-8 py-3.5 bg-white border border-[#e5dec9] text-[10px] font-black uppercase tracking-widest text-[#1c1917] rounded-xl hover:bg-[#f7f3ed] transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={isCreating}
                            className="px-8 py-3.5 bg-accent-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent-600 shadow-xl shadow-accent-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating ? 'Deploying...' : 'Create Project'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
