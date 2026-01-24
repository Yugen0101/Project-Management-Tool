'use client';

import { UserCircleIcon, IdentificationIcon, UserGroupIcon, StarIcon } from '@heroicons/react/24/outline';

interface TeamMember {
    id: string;
    full_name: string;
    role: string;
    email: string;
}

interface TeamOverviewProps {
    projectName: string;
    teamName: string;
    members: TeamMember[];
    adminName: string;
}

export default function TeamOverview({ projectName, teamName, members, adminName }: TeamOverviewProps) {
    return (
        <div className="card bg-white border-[#e5dec9] p-10 space-y-10 shadow-xl shadow-[#d9cfb0]/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <IdentificationIcon className="w-32 h-32" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="w-6 h-px bg-[#d97757]"></span>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d97757]">Active Project Matrix</h4>
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-[#1c1917] tracking-tighter uppercase leading-none">{projectName}</h3>
                        <p className="text-[#1c1917]/30 text-xs font-black uppercase tracking-widest mt-3 italic font-serif">Registry: {teamName}</p>
                    </div>
                    <div className="p-6 bg-[#f7f3ed] rounded-3xl border border-[#e5dec9] flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#d97757] border border-[#e5dec9] shadow-sm">
                            <StarIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-[#1c1917]/30 uppercase tracking-[0.3em]">Operational Lead</p>
                            <p className="text-lg font-black text-[#1c1917] uppercase tracking-tight">{adminName}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="w-6 h-px bg-[#d97757]"></span>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d97757]">Assigned Operators</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {members.filter(m => m !== null).map((member) => (
                            <div key={member.id} className="flex items-center gap-4 p-4 hover:bg-[#f7f3ed]/50 rounded-2xl transition-all border border-transparent hover:border-[#e5dec9]">
                                <div className="w-10 h-10 rounded-xl bg-[#f7f3ed] flex items-center justify-center text-[#1c1917]/40 border border-[#e5dec9]">
                                    <UserCircleIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-[#1c1917] uppercase tracking-tight">{member.full_name}</p>
                                    <p className="text-[9px] font-black text-[#1c1917]/30 uppercase tracking-widest">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
