import { createAdminClient } from '@/lib/supabase/admin';
import {
    PlusIcon,
    UserIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    EnvelopeIcon,
    SparklesIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline';
import UserManagementClient from '@/components/admin/UserManagementClient';
import UserActionMenu from '../../../components/admin/UserActionMenu';
import Pagination from '@/components/ui/Pagination';
import { createClient } from '@/lib/supabase/server';

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1');
    const pageSize = 10;
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = await createAdminClient();

    // Fetch users with counts of assigned projects and tasks
    const [{ data: users }, { count: totalCount }, { count: adminCount }, { count: associateCount }, { count: memberCount }] = await Promise.all([
        supabase.from('users').select('*, projects_count:user_projects(count), tasks_count:tasks!assigned_to(count)').order('created_at', { ascending: false }).range(from, to),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'associate'),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'member'),
    ]);

    const totalPages = Math.ceil((totalCount || 0) / pageSize);

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                        <UserGroupIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Personnel Roster</h1>
                        <p className="text-secondary-400 text-sm font-medium mt-1">
                            Managing {totalCount || 0} active team members across the organization.
                        </p>
                    </div>
                </div>
                <div className="pb-2">
                    <UserManagementClient initialUsers={(users as any) || []} />
                </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card flex items-center gap-6 group hover:border-primary-200 transition-all">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 border border-primary-100 group-hover:scale-110 transition-transform">
                        <IdentificationIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Aggregate</p>
                        <p className="text-2xl font-bold text-secondary-900 tracking-tight">{totalCount || 0}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-6 group hover:border-indigo-200 transition-all">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:scale-110 transition-transform">
                        <ShieldCheckIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Executives</p>
                        <p className="text-2xl font-bold text-secondary-900 tracking-tight">{adminCount || 0}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-6 group hover:border-emerald-200 transition-all">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
                        <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Associates</p>
                        <p className="text-2xl font-bold text-secondary-900 tracking-tight">{associateCount || 0}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-6 group hover:border-amber-200 transition-all">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100 group-hover:scale-110 transition-transform">
                        <SparklesIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Tactical</p>
                        <p className="text-2xl font-bold text-secondary-900 tracking-tight">{memberCount || 0}</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card p-0 overflow-hidden">
                <div className="p-8 border-b border-border bg-secondary-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-widest flex items-center gap-2">
                        <IdentificationIcon className="w-5 h-5 text-primary-600" />
                        Management Registry
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">System Synchronized</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-border">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase text-secondary-400 tracking-widest">Member Entity</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase text-secondary-400 tracking-widest">Clearance Tier</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase text-secondary-400 tracking-widest text-center">Active Assignments</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase text-secondary-400 tracking-widest text-center">Task Queue</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase text-secondary-400 tracking-widest">Operational Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase text-secondary-400 tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users?.map((user: any) => (
                                <tr key={user.id} className="hover:bg-secondary-50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-[#f7f3ed] border border-[#e5dec9] flex items-center justify-center font-black text-accent-500 group-hover:bg-accent-500 group-hover:text-white group-hover:border-accent-500 transition-all shadow-sm shadow-accent-500/5">
                                                {user.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">{user.full_name}</p>
                                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-secondary-400 mt-0.5">
                                                    <EnvelopeIcon className="w-3.5 h-3.5" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className={`badge inline-flex w-fit ${user.role === 'admin' ? 'badge-danger' :
                                                user.role === 'associate' ? 'badge-info' :
                                                    'badge-success'}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="flex -space-x-2">
                                                {[...Array(Math.min(user.projects_count?.[0]?.count || 0, 3))].map((_, i) => (
                                                    <div key={i} className="w-6 h-6 rounded-lg bg-secondary-50 border border-border flex items-center justify-center shadow-sm">
                                                        <div className="w-2 h-2 rounded-full bg-primary-500/40"></div>
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-[11px] font-bold text-secondary-600 tracking-tight">
                                                {user.projects_count?.[0]?.count || 0} Project{user.projects_count?.[0]?.count === 1 ? '' : 's'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex flex-col items-center justify-center w-12 h-12 bg-secondary-50 rounded-2xl border border-border group-hover:border-primary-300 transition-all">
                                            <span className="text-lg font-bold text-primary-600 leading-none">{user.tasks_count?.[0]?.count || 0}</span>
                                            <span className="text-[7px] font-bold text-secondary-400 uppercase tracking-[0.1em] mt-1">Units</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-secondary-300'}`}></span>
                                            <span className={`text-[11px] font-bold uppercase tracking-widest ${user.is_active ? 'text-emerald-600' : 'text-secondary-400'}`}>
                                                {user.is_active ? 'ACTIVE' : 'DORMANT'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <UserActionMenu user={user} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Footer */}
                <div className="p-8 bg-secondary-50/30 border-t border-border flex justify-center">
                    <Pagination currentPage={currentPage} totalPages={totalPages} />
                </div>
            </div>
        </div>
    );
}
