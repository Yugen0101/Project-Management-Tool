'use client';

import {
    ChartBarIcon,
    ArrowTrendingUpIcon,
    UsersIcon,
    CubeIcon,
    FireIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
    totalProjects: number;
    activeTasks: number;
    completedTasks: number;
    teamCount: number;
    nodeHealth: { name: string; health: number }[];
    workload: { name: string; tasks: number }[];
}

export default function AssociateAnalyticsClient({ data }: { data: AnalyticsData }) {
    const overallCompletion = data.activeTasks + data.completedTasks > 0
        ? (data.completedTasks / (data.activeTasks + data.completedTasks)) * 100
        : 0;

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent-500 mb-1">
                        <ChartBarIcon className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Operations Analytics</span>
                    </div>
                    <h1 className="text-4xl font-semibold text-[#1c1917] tracking-tighter uppercase">
                        Lead <span className="text-accent-500">Intelligence</span>
                    </h1>
                    <p className="text-[#1c1917]/50 font-medium text-sm uppercase tracking-widest">
                        Node performance and personnel velocity telemetry
                    </p>
                </div>
            </div>

            {/* Metric Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Infrastructure Nodes', value: data.totalProjects, icon: CubeIcon, sub: 'Active Projects' },
                    { label: 'Operational Units', value: data.activeTasks + data.completedTasks, icon: FireIcon, sub: 'Total Task Load' },
                    { label: 'Personnel Strength', value: data.teamCount, icon: UsersIcon, sub: 'Assigned Members' },
                    { label: 'Completion Matrix', value: `${Math.round(overallCompletion)}%`, icon: CheckCircleIcon, sub: 'Aggregated Progress' }
                ].map((metric, i) => (
                    <div key={i} className="card bg-white border-[#e5dec9] shadow-xl shadow-[#d9cfb0]/5 p-8 group hover:border-accent-200 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-[#f7f3ed] rounded-xl flex items-center justify-center text-accent-500 group-hover:bg-accent-500 group-hover:text-white transition-all shadow-sm">
                                <metric.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-[32px] font-bold text-[#1c1917] tracking-tighter leading-none mb-1">{metric.value}</div>
                        <div className="text-[9px] font-bold text-accent-500 uppercase tracking-widest mb-1">{metric.label}</div>
                        <div className="text-[10px] text-[#1c1917]/30 font-medium uppercase tracking-tighter">{metric.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Node Health Matrix */}
                <div className="card bg-white border-[#e5dec9] shadow-[#d9cfb0]/10 p-10 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ArrowTrendingUpIcon className="w-5 h-5 text-accent-500" />
                            <h3 className="text-xl font-bold text-[#1c1917] uppercase tracking-tight">Node Health Matrix</h3>
                        </div>
                    </div>
                    <div className="space-y-8">
                        {data.nodeHealth.map((node, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-bold text-[#1c1917] uppercase tracking-widest">{node.name}</span>
                                    <span className="text-[13px] font-bold text-accent-500">{node.health}%</span>
                                </div>
                                <div className="h-2.5 bg-[#f7f3ed] rounded-full overflow-hidden border border-[#e5dec9] p-0.5">
                                    <div
                                        className="h-full bg-accent-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(217,119,87,0.4)]"
                                        style={{ width: `${node.health}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Personnel Load Distribution */}
                <div className="card bg-white border-[#e5dec9] shadow-[#d9cfb0]/10 p-10 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <UsersIcon className="w-5 h-5 text-accent-500" />
                            <h3 className="text-xl font-bold text-[#1c1917] uppercase tracking-tight">Personnel Bandwidth</h3>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        {data.workload.map((staff, i) => (
                            <div key={i} className="flex items-center gap-6">
                                <div className="w-10 h-10 bg-[#f7f3ed] rounded-full border border-[#e5dec9] flex items-center justify-center font-bold text-[10px] text-[#1c1917]/40 shrink-0">
                                    {staff.name.charAt(0)}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-bold text-[#1c1917] uppercase tracking-wider">{staff.name}</span>
                                        <span className="text-[10px] font-bold text-[#1c1917]/30 uppercase tracking-widest">{staff.tasks} Active Units</span>
                                    </div>
                                    <div className="h-2 bg-[#f7f3ed] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#1c1917]/20 rounded-full"
                                            style={{ width: `${Math.min((staff.tasks / 10) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
