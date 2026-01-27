'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/app/actions/projects';
import {
    ArrowLeftIcon,
    InformationCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CalendarIcon,
    Bars3BottomLeftIcon,
    CheckIcon,
    XMarkIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface User {
    id: string;
    full_name: string;
    email: string;
    role: string;
}

const TAB_OPTIONS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'users', label: 'Users' },
    { id: 'reports', label: 'Reports' },
    { id: 'documents', label: 'Documents' },
    { id: 'phases', label: 'Phases' },
    { id: 'time_logs', label: 'Time Logs' },
    { id: 'finance', label: 'Finance' },
    { id: 'expense', label: 'Expense' },
    { id: 'bugs', label: 'Bugs' },
    { id: 'forums', label: 'Forums' },
    { id: 'pages', label: 'Pages' },
    { id: 'timesheet', label: 'Timesheet' }
];

export default function NewProjectForm({ associates, members }: { associates: User[], members: User[] }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const editorRef = useRef<HTMLDivElement>(null);

    // Form state
    const [projectTitle, setProjectTitle] = useState('');
    const [owner, setOwner] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [template, setTemplate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [strictProject, setStrictProject] = useState(false);
    const [projectGroup, setProjectGroup] = useState('');
    const [description, setDescription] = useState('');
    const [businessHours, setBusinessHours] = useState('standard');
    const [taskLayout, setTaskLayout] = useState('standard');
    const [tags, setTags] = useState<string[]>([]);
    const [rollUpEnabled, setRollUpEnabled] = useState(false);
    const [enabledTabs, setEnabledTabs] = useState<string[]>(['dashboard', 'tasks', 'users', 'reports', 'documents', 'phases', 'time_logs', 'bugs']);
    const [projectAccess, setProjectAccess] = useState<'private' | 'public'>('private');

    // UI state
    const [rollUpExpanded, setRollUpExpanded] = useState(false);
    const [tabsExpanded, setTabsExpanded] = useState(false);
    const [accessExpanded, setAccessExpanded] = useState(true);
    const [membersExpanded, setMembersExpanded] = useState(false);



    const toggleTab = (tabId: string) => {
        setEnabledTabs(prev =>
            prev.includes(tabId) ? prev.filter(id => id !== tabId) : [...prev, tabId]
        );
    };



    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await createProject({
                name: projectTitle,
                description,
                start_date: startDate || undefined,
                end_date: endDate,
                associateId: owner || undefined,
                memberIds: selectedMembers,
                is_template: false,
                category: projectGroup || undefined,
                is_strict: strictProject,
                business_hours: businessHours,
                task_layout: taskLayout,
                tags: tags,
                roll_up_enabled: rollUpEnabled,
                tabs_config: enabledTabs,
                is_public: projectAccess === 'public'
            });

            if (result.success) {
                router.push('/admin/projects');
                router.refresh();
            } else {
                setError((result as any).error || 'Failed to create project.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f7f3ed] py-12 px-4 text-[#1c1917] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fffbf5] via-[#f7f3ed] to-[#ede8de]">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link
                    href="/admin/projects"
                    className="flex items-center gap-3 text-[#78716c] hover:text-[#d97757] transition-all group no-underline w-fit"
                >
                    <div className="p-2 bg-white rounded-full shadow-sm border border-[#e5dec9] group-hover:border-[#d97757]/30 transition-colors">
                        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wider">Back to Projects</span>
                </Link>

                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-2xl shadow-[#1c1917]/10 ring-1 ring-[#1c1917]/5 overflow-hidden">
                    {/* Header */}
                    <div className="px-12 py-8 border-b border-[#f7f3ed] flex items-center justify-between bg-white relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d97757] via-[#e89c82] to-[#d97757] opacity-80" />
                        <div>
                            <h1 className="text-3xl font-semibold text-[#1c1917] tracking-tighter uppercase">New Project</h1>
                            <p className="text-xs text-[#78716c] mt-1 font-normal">Configure the details for your new initiative</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-4 py-2 rounded-full bg-[#f7f3ed] border border-[#e5dec9] text-[10px] font-medium uppercase tracking-widest text-[#78716c]">Standard Layout</span>
                        </div>
                    </div>

                    {error && (
                        <div className="mx-10 mt-6 bg-[#c85a54]/10 border border-[#c85a54]/30 text-[#c85a54] px-5 py-3 rounded-xl text-sm font-semibold">
                            {error}
                        </div>
                    )}

                    <div className="p-10 space-y-8">
                        {/* Project Title */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-medium text-[#78716c] uppercase tracking-[0.2em] ml-1">
                                Project Title <span className="text-[#d97757]">*</span>
                                <InformationCircleIcon className="w-4 h-4 text-[#78716c]/40" />
                            </label>
                            <input
                                type="text"
                                required
                                value={projectTitle}
                                onChange={(e) => setProjectTitle(e.target.value)}
                                className="w-full px-5 py-4 bg-white border border-[#e5dec9] rounded-xl text-[#1c1917] placeholder-[#1c1917]/20 focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none shadow-[0_2px_10px_-4px_rgba(28,25,23,0.05)] hover:border-[#d97757]/30 hover:shadow-md"
                                placeholder="Enter project title"
                            />
                        </div>

                        {/* Associate & Members */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-medium text-[#78716c] uppercase tracking-[0.2em] ml-1">Associate</label>
                                <div className="relative">
                                    <select
                                        value={owner}
                                        onChange={(e) => setOwner(e.target.value)}
                                        className="w-full px-5 py-4 bg-white border border-[#e5dec9] rounded-xl text-[#1c1917] appearance-none focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none shadow-[0_2px_10px_-4px_rgba(28,25,23,0.05)] hover:border-[#d97757]/30 hover:shadow-md"
                                    >
                                        <option value="">Select Associate</option>
                                        {associates.map(u => (
                                            <option key={u.id} value={u.id}>{u.full_name}</option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#78716c]" />
                                </div>
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-[10px] font-medium text-[#78716c] uppercase tracking-[0.2em] ml-1">Members</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setMembersExpanded(!membersExpanded)}
                                        className="w-full px-5 py-4 bg-white border border-[#e5dec9] rounded-xl text-left flex items-center justify-between text-[#1c1917] focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none shadow-[0_2px_10px_-4px_rgba(28,25,23,0.05)] hover:border-[#d97757]/30 hover:shadow-md"
                                    >
                                        <span className={selectedMembers.length === 0 ? 'opacity-50' : ''}>
                                            {selectedMembers.length === 0
                                                ? 'Select members'
                                                : `${selectedMembers.length} member${selectedMembers.length === 1 ? '' : 's'} selected`}
                                        </span>
                                        <ChevronDownIcon className="w-5 h-5 text-[#78716c]" />
                                    </button>

                                    {membersExpanded && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setMembersExpanded(false)}
                                            />
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-[#e5dec9] rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto p-2 space-y-1">
                                                {members.map(member => {
                                                    const isSelected = selectedMembers.includes(member.id);
                                                    return (
                                                        <div
                                                            key={member.id}
                                                            onClick={() => {
                                                                setSelectedMembers(prev =>
                                                                    isSelected
                                                                        ? prev.filter(id => id !== member.id)
                                                                        : [...prev, member.id]
                                                                );
                                                            }}
                                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-[#f7f3ed]' : 'hover:bg-[#f7f3ed]/50'}`}
                                                        >
                                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-[#d97757] border-[#d97757]' : 'border-[#e5dec9] bg-white'}`}>
                                                                {isSelected && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-xs font-medium text-[#1c1917]">{member.full_name}</p>
                                                                <p className="text-[10px] text-[#78716c]">{member.email}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {members.length === 0 && (
                                                    <div className="p-4 text-center text-xs text-[#78716c]">
                                                        No members available
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Project Group */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-medium text-[#78716c] uppercase tracking-[0.2em] ml-1">Project Group</label>
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <select
                                        value={projectGroup}
                                        onChange={(e) => setProjectGroup(e.target.value)}
                                        className="w-full px-5 py-4 bg-white border border-[#e5dec9] rounded-xl text-[#1c1917] appearance-none focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none shadow-[0_2px_10px_-4px_rgba(28,25,23,0.05)] hover:border-[#d97757]/30 hover:shadow-md"
                                    >
                                        <option value="">Select</option>
                                        <option value="development">Development</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="design">Design</option>
                                    </select>
                                    <ChevronDownIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#78716c]" />
                                </div>
                                <button type="button" className="text-[#d97757] hover:text-[#c26242] text-[10px] font-medium uppercase tracking-[0.2em] transition-colors whitespace-nowrap bg-[#d97757]/5 px-4 py-4 rounded-xl border border-transparent hover:border-[#d97757]/20 hover:bg-[#d97757]/10">
                                    + New
                                </button>
                            </div>
                        </div>

                        {/* Start Date & End Date */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-medium text-[#78716c] uppercase tracking-[0.2em] ml-1">Start Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-5 py-4 bg-white border border-[#e5dec9] rounded-xl text-[#1c1917] focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none shadow-[0_2px_10px_-4px_rgba(28,25,23,0.05)] hover:border-[#d97757]/30 hover:shadow-md"
                                    />
                                    <CalendarIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#78716c] pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-medium text-[#78716c] uppercase tracking-[0.2em] ml-1">End Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        required
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-5 py-4 bg-white border border-[#e5dec9] rounded-xl text-[#1c1917] font-medium focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none shadow-[0_2px_10px_-4px_rgba(28,25,23,0.05)] hover:border-[#d97757]/30 hover:shadow-md"
                                    />
                                    <CalendarIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#78716c] pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Strict Project */}
                        <div className="flex items-center gap-3 ml-1">
                            <input
                                type="checkbox"
                                id="strictProject"
                                checked={strictProject}
                                onChange={(e) => setStrictProject(e.target.checked)}
                                className="w-5 h-5 rounded-md border-[#e5dec9] bg-white text-[#d97757] focus:ring-[#d97757]/20 transition-all cursor-pointer"
                            />
                            <label htmlFor="strictProject" className="flex items-center gap-2 text-[10px] font-medium text-[#78716c] uppercase tracking-[0.2em]">
                                Make this a strict project
                                <InformationCircleIcon className="w-4 h-4 text-[#78716c]/40" />
                            </label>
                        </div>



                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-medium text-[#78716c] uppercase tracking-[0.2em] ml-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full min-h-[200px] px-5 py-4 bg-white border border-[#e5dec9] rounded-xl text-[#1c1917] placeholder-[#1c1917]/20 focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none shadow-[0_2px_10px_-4px_rgba(28,25,23,0.05)] hover:border-[#d97757]/30 hover:shadow-md resize-y"
                                placeholder="Enter project description..."
                            />
                        </div>









                        {/* Project Access */}
                        <div className="border border-[#e5dec9] rounded-xl overflow-hidden bg-white shadow-sm">
                            <button
                                type="button"
                                onClick={() => setAccessExpanded(!accessExpanded)}
                                className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#fdfcf9] transition-colors"
                            >
                                <span className="text-[11px] font-medium uppercase tracking-widest text-[#1c1917]">Project Access</span>
                                {accessExpanded ? <ChevronUpIcon className="w-4 h-4 text-[#78716c]" /> : <ChevronDownIcon className="w-4 h-4 text-[#78716c]" />}
                            </button>
                            {accessExpanded && (
                                <div className="px-6 py-6 border-t border-[#f7f3ed] space-y-6">
                                    <div
                                        onClick={() => setProjectAccess('private')}
                                        className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${projectAccess === 'private'
                                            ? 'bg-[#d97757]/5 border-[#d97757] shadow-sm'
                                            : 'bg-white border-transparent hover:bg-[#f7f3ed]'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            checked={projectAccess === 'private'}
                                            onChange={() => setProjectAccess('private')}
                                            className="mt-1 w-5 h-5 border-[#e5dec9] text-[#d97757] focus:ring-[#d97757]/20"
                                        />
                                        <div>
                                            <label className="text-[11px] font-medium uppercase tracking-widest text-[#1c1917] block mb-1 pointer-events-none">Private</label>
                                            <p className="text-xs text-[#78716c] font-normal leading-relaxed pointer-events-none">Only project users can view and access this project. Best for internal operations.</p>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setProjectAccess('public')}
                                        className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${projectAccess === 'public'
                                            ? 'bg-[#d97757]/5 border-[#d97757] shadow-sm'
                                            : 'bg-white border-transparent hover:bg-[#f7f3ed]'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            checked={projectAccess === 'public'}
                                            onChange={() => setProjectAccess('public')}
                                            className="mt-1 w-5 h-5 border-[#e5dec9] text-[#d97757] focus:ring-[#d97757]/20"
                                        />
                                        <div>
                                            <label className="text-[11px] font-medium uppercase tracking-widest text-[#1c1917] block mb-1 pointer-events-none">Public</label>
                                            <p className="text-xs text-[#78716c] font-normal leading-relaxed pointer-events-none">Portal users can only view, follow, and comment whereas, project users will have complete access.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-12 py-8 bg-[#fdfcf9] border-t border-[#f7f3ed] flex items-center justify-between">
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading || !projectTitle || !endDate}
                                className="px-10 py-4 bg-gradient-to-r from-[#d97757] to-[#b95d3f] hover:from-[#c26242] hover:to-[#a04e32] text-white rounded-xl font-medium uppercase tracking-widest text-[11px] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#d97757]/25 hover:shadow-xl hover:shadow-[#d97757]/40 hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {loading ? 'Creating...' : 'Add Project'}
                                    {!loading && <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </span>
                            </button>
                            <Link
                                href="/admin/projects"
                                className="px-10 py-4 bg-white border border-[#e5dec9] hover:bg-[#f7f3ed] text-[#1c1917] rounded-xl font-medium uppercase tracking-widest text-[11px] transition-all hover:border-[#d97757]/40 shadow-sm hover:shadow-md"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
