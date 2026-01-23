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
            <div className="text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <VideoCameraIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No meetings scheduled for this project.</p>
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
                        className={`card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-md ${
                            isCancelled ? 'opacity-60' : ''
                        }`}
                    >
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3 rounded-xl shrink-0 ${
                                isCancelled ? 'bg-slate-100 text-slate-400' : 
                                isUpcoming ? 'bg-primary-50 text-primary-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                                <VideoCameraIcon className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                    {meeting.title}
                                    {isCancelled && <span className="badge badge-warning text-[10px] py-0.5">Cancelled</span>}
                                    {!isCancelled && !isUpcoming && <span className="badge badge-success text-[10px] py-0.5">Completed</span>}
                                </h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        {format(new Date(meeting.scheduled_at), 'PPP')}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ClockIcon className="w-3.5 h-3.5" />
                                        {format(new Date(meeting.scheduled_at), 'p')} ({meeting.duration} min)
                                    </span>
                                    <span className="text-slate-400">by {meeting.creator?.full_name}</span>
                                </div>
                                {meeting.description && (
                                    <p className="text-sm text-slate-600 mt-2 line-clamp-1">{meeting.description}</p>
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
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
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
