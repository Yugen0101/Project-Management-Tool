'use client';

import { useState, useEffect } from 'react';
import { addComment, getComments, deleteComment } from '@/app/actions/comments';
import { getCurrentUser } from '@/lib/auth/session';
import {
    ChatBubbleLeftRightIcon,
    AtSymbolIcon,
    PaperAirplaneIcon,
    ArrowPathIcon,
    TrashIcon
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
        const updatedText = [...words, `${user.email}`].join(' ') + ' ';
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

    const handleDelete = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        // Optimistic update
        const previousComments = [...comments];
        setComments(comments.filter(c => c.id !== commentId));

        const res = await deleteComment(commentId, projectPath);
        if (!res.success) {
            // Revert if failed
            setComments(previousComments);
            alert('Failed to delete comment');
        }
    };

    if (loading) return <div className="h-32 animate-pulse bg-[#f7f3ed] rounded-2xl border border-[#e5dec9]" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#1c1917] mb-4">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-accent-500" />
                <h3 className="font-semibold uppercase tracking-widest text-[10px] text-[#1c1917]/70">Discussion Thread</h3>
                <span className="text-[10px] text-accent-600 font-bold bg-accent-50 border border-accent-100 px-2 py-0.5 rounded-full shadow-sm">{comments.length}</span>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 group">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-semibold text-primary-600 shrink-0 border-2 border-white shadow-sm">
                            {(comment.user?.full_name || '?').charAt(0)}
                        </div>
                        <div className="flex-1">
                            <div className="bg-white rounded-2xl rounded-tl-none p-5 border border-[#e5dec9] group-hover:border-accent-200 transition-all duration-300 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-[#1c1917] uppercase tracking-tight">{comment.user?.full_name || 'Unknown User'}</span>
                                    <span className="text-[9px] font-semibold text-secondary-500 uppercase tracking-widest">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </span>
                                    {(currentUser?.id === comment.user_id || currentUser?.role === 'admin' || currentUser?.role === 'associate') && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-secondary-400 hover:text-red-500 transition-colors ml-2 opacity-0 group-hover:opacity-100"
                                            title="Delete comment"
                                        >
                                            <TrashIcon className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm text-[#1c1917]/80 leading-relaxed whitespace-pre-wrap font-medium">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {comments.length === 0 && (
                    <div className="text-center py-12 bg-[#f7f3ed]/30 rounded-3xl border border-dashed border-[#e5dec9]">
                        <p className="text-[10px] font-bold text-[#1c1917]/40 uppercase tracking-widest italic">
                            No messages yet. Start the conversation!
                        </p>
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
                            className="w-full bg-white border-2 border-[#e5dec9] rounded-2xl p-5 pr-14 text-sm font-medium focus:border-accent-500/50 transition-all outline-none resize-none h-32 shadow-sm text-[#1c1917] placeholder-[#1c1917]/30"
                            disabled={submitting}
                        />

                        {/* Mention Autocomplete List */}
                        {showMentionList && (
                            <div className="absolute bottom-full left-0 mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-[#e5dec9] overflow-hidden z-50 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="p-3 bg-[#f7f3ed] border-b border-[#e5dec9]">
                                    <span className="text-[10px] font-bold text-secondary-600 uppercase tracking-[0.2em]">Select Node</span>
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    {allUsers
                                        .filter(u =>
                                            u.full_name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
                                            u.email?.toLowerCase().includes(mentionSearch.toLowerCase())
                                        )
                                        .map(user => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => insertMention(user)}
                                                className="w-full flex items-center gap-4 p-4 hover:bg-[#f7f3ed] text-left transition-colors border-b border-[#f7f3ed] last:border-0"
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-accent-500/10 flex items-center justify-center text-xs font-bold text-accent-600">
                                                    {user.full_name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-[#1c1917]">{user.full_name}</p>
                                                    <p className="text-[9px] text-secondary-500 font-semibold uppercase tracking-tight">
                                                        {user.email} • {user.role}
                                                    </p>
                                                </div>
                                            </button>
                                        ))
                                    }
                                    {allUsers.filter(u =>
                                        u.full_name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
                                        u.email?.toLowerCase().includes(mentionSearch.toLowerCase())
                                    ).length === 0 && (
                                            <div className="p-4 text-center">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">No users found</p>
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}
                        <div className="absolute top-5 right-5 text-secondary-300">
                            <AtSymbolIcon className="w-5 h-5" />
                        </div>
                        <button
                            type="submit"
                            disabled={!newComment.trim() || submitting}
                            className="absolute bottom-5 right-5 p-2.5 bg-accent-500 text-white rounded-xl hover:bg-accent-600 disabled:opacity-50 transition-all shadow-lg shadow-accent-500/20"
                        >
                            {submitting ? (
                                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                            ) : (
                                <PaperAirplaneIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-[9px] font-bold text-secondary-400 uppercase tracking-[0.2em] mt-3 px-1">
                        Press ENTER to send • {submitting ? 'Encrypting...' : 'Ready'}
                    </p>
                </form>
            )}
        </div>
    );
}
