'use client';

import { useState } from 'react';
import {
    VideoCameraIcon,
    CalendarIcon,
    ClockIcon,
    TrashIcon,
    ArrowTopRightOnSquareIcon,
    PlayIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { cancelMeeting, getMeetingStartUrl } from '@/app/actions/meetings';

interface Meeting {
    id: string;
    title: string;
    description: string;
    scheduled_at: string;
    duration: number;
    status: string;
    join_url: string;
    created_by: string;
    creator: { full_name: string };
}

export default function MeetingList({
    meetings: initialMeetings,
    projectId,
    currentUser
}: {
    meetings: Meeting[],
    projectId: string,
    currentUser: any
}) {
    const [meetings, setMeetings] = useState(initialMeetings);
    const isAdminOrAssociate = currentUser.role === 'admin' || currentUser.role === 'associate';

    const handleCancel = async (meetingId: string) => {
        if (confirm('Are you sure you want to cancel this meeting?')) {
            const result = await cancelMeeting(meetingId, projectId) as any;
            if (result.success) {
                setMeetings(prev => prev.map((m: any) => m.id === meetingId ? { ...m, status: 'cancelled' } : m));
            } else {
                alert(result.error);
            }
        }
    };

    const handleStartMeeting = async (meetingId: string) => {
        const result = await getMeetingStartUrl(meetingId) as any;
        if (result.success && result.data) {
            window.open(result.data, '_blank');
        } else {
            alert(result.error || 'Failed to get start link');
        }
    };

    if (meetings.length === 0) {
        return (
            <div className="text-center py-16 bg-beige-50/50 rounded-[2rem] border-2 border-dashed border-beige-200">
                <VideoCameraIcon className="w-12 h-12 text-beige-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-[#1c1917]/70 uppercase tracking-widest">No syncs scheduled</h4>
                <p className="text-[#1c1917]/60 text-[10px] font-medium uppercase tracking-widest mt-2">Clear operation timeline</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {meetings.map((meeting: Meeting) => {
                const isUpcoming = new Date(meeting.scheduled_at) > new Date();
                const isHost = meeting.created_by === currentUser.id || currentUser.role === 'admin';
                const isCancelled = meeting.status === 'cancelled';

                return (
                    <div
                        key={meeting.id}
                        className={`card !p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:border-accent-100 shadow-sm ${isCancelled ? 'opacity-50 grayscale' : ''
                            }`}
                    >
                        <div className="flex items-start gap-5 flex-1 p-1">
                            <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center border transition-all ${isCancelled ? 'bg-beige-100 text-beige-400 border-beige-200' :
                                isUpcoming ? 'bg-accent-50 text-accent-500 border-accent-100 shadow-sm shadow-accent-500/5' : 'bg-[#7c9473]/10 text-[#7c9473] border-[#7c9473]/20 shadow-sm shadow-[#7c9473]/5'
                                }`}>
                                <VideoCameraIcon className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-[#1c1917] uppercase tracking-tight text-lg leading-none">
                                    {meeting.title}
                                    {isCancelled && <span className="ml-3 badge bg-[#d97757]/10 text-[#d97757] border-[#d97757]/20 text-[9px] py-1 px-3">CANCELLED</span>}
                                    {!isCancelled && !isUpcoming && <span className="ml-3 badge bg-[#7c9473]/10 text-[#7c9473] border-[#7c9473]/20 text-[9px] py-1 px-3">ARCHIVED</span>}
                                </h4>
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-medium uppercase tracking-widest text-[#1c1917]/70">
                                    <span className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-accent-500" />
                                        {format(new Date(meeting.scheduled_at), 'PPP')}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <ClockIcon className="w-4 h-4 text-accent-500" />
                                        {format(new Date(meeting.scheduled_at), 'p')} • {meeting.duration} MIN
                                    </span>
                                    <span className="text-[#1c1917]/60 italic font-semibold">BY {meeting.creator?.full_name}</span>
                                </div>
                                {meeting.description && (
                                    <p className="text-[11px] text-[#1c1917]/75 mt-3 font-medium flex items-center gap-2">
                                        <span className="w-1 h-1 bg-accent-500 rounded-full"></span>
                                        {meeting.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            {!isCancelled && (
                                <>
                                    {isHost && isUpcoming ? (
                                        <button
                                            onClick={() => handleStartMeeting(meeting.id)}
                                            className="btn-primary py-2 px-4 text-xs flex items-center gap-2 flex-1 md:flex-none justify-center"
                                        >
                                            <PlayIcon className="w-4 h-4" />
                                            Start Meeting
                                        </button>
                                    ) : (
                                        <a
                                            href={meeting.join_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-secondary py-2 px-4 text-xs flex items-center gap-2 flex-1 md:flex-none justify-center"
                                        >
                                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                            Join Meeting
                                        </a>
                                    )}

                                    {isAdminOrAssociate && isUpcoming && (
                                        <button
                                            onClick={() => handleCancel(meeting.id)}
                                            className="w-10 h-10 flex items-center justify-center text-[#1c1917]/60 hover:text-[#c85a54] hover:bg-[#c85a54]/5 rounded-xl transition-all border border-transparent hover:border-[#c85a54]/10 shrink-0"
                                            title="Cancel Meeting"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
