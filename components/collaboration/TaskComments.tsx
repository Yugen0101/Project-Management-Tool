'use client';

import { useState, useEffect } from 'react';
import { addComment, getComments } from '@/app/actions/comments';
import { getCurrentUser } from '@/lib/auth/session';
import {
    ChatBubbleLeftRightIcon,
    AtSymbolIcon,
    PaperAirplaneIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { getUsersForMentions } from '@/app/actions/users';

export default function TaskComments({ taskId, projectPath }: { taskId: string, projectPath: string }) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [mentionSearch, setMentionSearch] = useState('');
    const [showMentionList, setShowMentionList] = useState(false);

    useEffect(() => {
        async function loadData() {
            const [cRes, uRes, usersRes] = await Promise.all([
                getComments(taskId),
                getCurrentUser(),
                getUsersForMentions()
            ]);
            if (cRes.success) setComments(cRes.data ?? []);
            if (usersRes.success) setAllUsers(usersRes.data ?? []);
            setCurrentUser(uRes);
            setLoading(false);
        }
        loadData();
    }, [taskId]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setNewComment(value);

        // Simple mention detection logic
        const lastChar = value[value.length - 1];
        const lastWord = value.split(/\s/).pop() || '';

        if (lastWord.startsWith('@')) {
            setMentionSearch(lastWord.slice(1));
            setShowMentionList(true);
        } else {
            setShowMentionList(false);
        }
    };

    const insertMention = (user: any) => {
        const words = newComment.split(/\s/);
        words.pop(); // Remove the partial name
        const updatedText = [...words, `@[${user.id}]`].join(' ') + ' ';
        setNewComment(updatedText);
        setShowMentionList(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || submitting) return;

        setSubmitting(true);
        const res = await addComment(taskId, newComment, projectPath);
        if (res.success) {
            setNewComment('');
            // Reload comments
            const cRes = await getComments(taskId);
            if (cRes.success) setComments(cRes.data ?? []);
        }
        setSubmitting(false);
    };

    if (loading) return <div className="h-32 animate-pulse bg-slate-50 rounded-xl" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-900 mb-4">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold">Discussion</h3>
                <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-full">{comments.length}</span>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 group">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-black text-primary-600 shrink-0 border-2 border-white shadow-sm">
                            {comment.user.full_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <div className="bg-slate-50 rounded-2xl rounded-tl-none p-3 border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">{comment.user.full_name}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {comments.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic opacity-60">No messages yet. Start the conversation!</p>
                    </div>
                )}
            </div>

            {/* Comment Input */}
            {currentUser?.role === 'guest' ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Guest viewing mode is read-only
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight font-medium">
                        You do not have permission to post comments
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="relative">
                    <div className="relative group">
                        <textarea
                            value={newComment}
                            onChange={handleTextChange}
                            placeholder="Add a comment... (use @ to mention users)"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pr-12 text-sm focus:bg-white focus:border-primary-500 transition-all outline-none resize-none h-24 shadow-inner"
                            disabled={submitting}
                        />

                        {/* Mention Autocomplete List */}
                        {showMentionList && (
                            <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-bottom-2 duration-200">
                                <div className="p-2 bg-slate-50 border-b border-slate-50">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mention User</span>
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    {allUsers
                                        .filter(u => u.full_name.toLowerCase().includes(mentionSearch.toLowerCase()))
                                        .map(user => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => insertMention(user)}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-primary-50 text-left transition-colors border-b border-slate-50 last:border-0"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-black text-primary-600">
                                                    {user.full_name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-slate-900">{user.full_name}</p>
                                                    <p className="text-[10px] text-slate-400">{user.email}</p>
                                                </div>
                                            </button>
                                        ))
                                    }
                                    {allUsers.filter(u => u.full_name.toLowerCase().includes(mentionSearch.toLowerCase())).length === 0 && (
                                        <div className="p-4 text-center">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">No users found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="absolute top-4 right-4 text-slate-300">
                            <AtSymbolIcon className="w-5 h-5" />
                        </div>
                        <button
                            type="submit"
                            disabled={!newComment.trim() || submitting}
                            className="absolute bottom-4 right-4 p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:bg-slate-300 transition-all shadow-lg shadow-primary-500/20"
                        >
                            {submitting ? (
                                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                            ) : (
                                <PaperAirplaneIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">
                        Press ENTER to send • {submitting ? 'Sending...' : 'Ready'}
                    </p>
                </form>
            )}
        </div>
    );
}
