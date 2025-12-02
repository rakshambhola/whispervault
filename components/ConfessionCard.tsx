'use client';

import { useState } from 'react';
import { Confession, Reply } from '@/types';
import { formatTimestamp, calculateVoteScore, getUserId, hasUserVoted, saveUserVote, removeUserVote } from '@/lib/utils';
import { ArrowUp, ArrowDown, MessageCircle, Flag, Send, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import ShareModal from '@/components/ShareModal';

interface ConfessionCardProps {
    confession: Confession;
    onUpdate: () => void;
}

export default function ConfessionCard({ confession, onUpdate }: ConfessionCardProps) {
    const [showReplies, setShowReplies] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareReply, setShareReply] = useState<Reply | undefined>(undefined);
    const userId = getUserId();

    // Optimistic UI state
    const [localUpvotes, setLocalUpvotes] = useState(confession.upvotes || 0);
    const [localDownvotes, setLocalDownvotes] = useState(confession.downvotes || 0);
    const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(() => {
        if (hasUserVoted(confession.id, userId, 'upvote')) return 'upvote';
        if (hasUserVoted(confession.id, userId, 'downvote')) return 'downvote';
        return null;
    });

    const voteScore = calculateVoteScore(localUpvotes, localDownvotes);

    const handleVote = async (voteType: 'upvote' | 'downvote') => {
        const previousUpvotes = localUpvotes;
        const previousDownvotes = localDownvotes;
        const previousUserVote = userVote;

        // Optimistic update
        if (userVote === voteType) {
            // Remove vote
            setUserVote(null);
            if (voteType === 'upvote') setLocalUpvotes(prev => prev - 1);
            else setLocalDownvotes(prev => prev - 1);
            removeUserVote(confession.id, userId);
        } else {
            // Change or add vote
            if (userVote) {
                // Switching vote (e.g. up to down)
                if (voteType === 'upvote') {
                    setLocalUpvotes(prev => prev + 1);
                    setLocalDownvotes(prev => prev - 1);
                } else {
                    setLocalUpvotes(prev => prev - 1);
                    setLocalDownvotes(prev => prev + 1);
                }
            } else {
                // New vote
                if (voteType === 'upvote') setLocalUpvotes(prev => prev + 1);
                else setLocalDownvotes(prev => prev + 1);
            }
            setUserVote(voteType);
            saveUserVote(confession.id, userId, voteType);
        }

        try {
            // Server sync
            const action = userVote === voteType ? 'remove' : undefined;

            if (previousUserVote && previousUserVote !== voteType && action !== 'remove') {
                // Remove old vote first
                await fetch('/api/vote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        targetId: confession.id,
                        targetType: 'confession',
                        voteType: previousUserVote,
                        action: 'remove',
                    }),
                });
            }

            await fetch('/api/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetId: confession.id,
                    targetType: 'confession',
                    voteType,
                    action,
                }),
            });
        } catch (error) {
            console.error('Vote failed:', error);
            // Revert on error
            setLocalUpvotes(previousUpvotes);
            setLocalDownvotes(previousDownvotes);
            setUserVote(previousUserVote);
            if (previousUserVote) saveUserVote(confession.id, userId, previousUserVote);
            else removeUserVote(confession.id, userId);
        }
    };

    const [localReplies, setLocalReplies] = useState(confession.replies || []);
    const [replySuccess, setReplySuccess] = useState(false);

    const handleReply = async () => {
        if (!replyContent.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setReplySuccess(false);
        try {
            const res = await fetch('/api/confessions/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    confessionId: confession.id,
                    content: replyContent,
                }),
            });

            if (!res.ok) throw new Error('Failed to reply');

            const data = await res.json();
            const newReply = data.reply;

            if (!newReply) {
                throw new Error('Invalid reply data received');
            }

            // Update local state immediately without refreshing the whole page
            setLocalReplies(prev => {
                const replyWithTimestamp = {
                    ...newReply,
                    timestamp: newReply.timestamp || Date.now()
                };
                const updated = [...prev, replyWithTimestamp];
                return updated;
            });
            setReplyContent('');
            setReplySuccess(true);
            setTimeout(() => setReplySuccess(false), 3000);
        } catch (error) {
            console.error('Reply failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReport = async (reason: string) => {
        try {
            await fetch('/api/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetId: confession.id,
                    targetType: 'confession',
                    reason,
                }),
            });
            setShowReportModal(false);
            alert('Report submitted successfully');
        } catch (error) {
            console.error('Report failed:', error);
        }
    };

    const handleShare = (reply?: Reply) => {
        setShareReply(reply);
        setShowShareModal(true);
    };

    return (
        <>
            <Card className="border border-border bg-card shadow-none hover:border-primary/50 transition-colors duration-200">
                <CardContent className="p-4 sm:p-6">
                    {/* Header: Tags & Time */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-wrap gap-2">
                            {confession.tags && confession.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-xs font-bold text-primary hover:text-primary/80 cursor-pointer uppercase tracking-wide"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                            {formatTimestamp(confession.timestamp)}
                        </span>
                    </div>

                    {/* Main Content */}
                    <div className="mb-6">
                        <p className="text-sm sm:text-[16px] leading-relaxed text-foreground font-normal whitespace-pre-wrap break-words">
                            {confession.content}
                        </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-0.5 sm:gap-1 bg-secondary/50 rounded-lg p-0.5 sm:p-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleVote('upvote')}
                                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-md hover:bg-green-500/20 hover:backdrop-blur-xl hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-300 ${userVote === 'upvote' ? 'text-green-500 hover:text-green-400' : 'text-muted-foreground hover:text-white'
                                        }`}
                                >
                                    <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
                                </Button>
                                <span className={`text-xs sm:text-sm font-bold px-1.5 sm:px-2 min-w-[1.25rem] sm:min-w-[1.5rem] text-center ${voteScore > 0 ? 'text-green-500' : voteScore < 0 ? 'text-red-500' : 'text-muted-foreground'
                                    }`}>
                                    {voteScore}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleVote('downvote')}
                                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-md hover:bg-red-500/20 hover:backdrop-blur-xl hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300 ${userVote === 'downvote' ? 'text-red-500 hover:text-red-400' : 'text-muted-foreground hover:text-white'
                                        }`}
                                >
                                    <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5" />
                                </Button>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowReplies(!showReplies)}
                                className="h-8 sm:h-10 px-2 sm:px-3 text-muted-foreground hover:text-white hover:bg-primary/20 hover:backdrop-blur-xl hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] gap-1.5 sm:gap-2 rounded-lg transition-all duration-300"
                            >
                                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-xs sm:text-sm font-medium">{localReplies.length}</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleShare()}
                                className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground hover:text-white hover:bg-primary/20 hover:backdrop-blur-xl hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] rounded-lg transition-all duration-300"
                            >
                                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        </div>

                        <div className="relative">
                            {showReportModal && (
                                <div className="absolute bottom-full right-0 mb-2 w-48 bg-background/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-2 space-y-1">
                                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Report as...
                                        </div>
                                        {['Spam', 'Harassment', 'Inappropriate', 'Other'].map((reason) => (
                                            <button
                                                key={reason}
                                                onClick={() => handleReport(reason)}
                                                className="w-full text-left px-2 py-1.5 text-sm rounded-lg hover:bg-white/10 hover:text-white transition-colors text-foreground/80"
                                            >
                                                {reason}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowReportModal(!showReportModal)}
                                className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg transition-all duration-300 ${showReportModal ? 'text-white bg-destructive/20 backdrop-blur-xl shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'text-muted-foreground hover:text-white hover:bg-destructive/20 hover:backdrop-blur-xl hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}
                            >
                                <Flag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Replies Section */}
                    {showReplies && (
                        <div className="mt-6 pt-6 border-t border-border space-y-6">
                            {/* Reply Input */}
                            <div className="flex gap-3">
                                <Input
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="flex-1 h-11 bg-secondary/30 border-border focus:border-primary rounded-lg"
                                    onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                                />
                                <Button
                                    onClick={handleReply}
                                    disabled={isSubmitting || !replyContent.trim()}
                                    className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg"
                                >
                                    Reply
                                </Button>
                            </div>
                            {replySuccess && (
                                <div className="text-xs text-green-400 font-medium px-3 py-1.5 bg-green-500/10 backdrop-blur-xl rounded-full border border-green-500/20 shadow-sm animate-in fade-in slide-in-from-left-2 duration-300 inline-block">
                                    Reply posted successfully!
                                </div>
                            )}

                            {/* Replies List */}
                            <div className="space-y-4">
                                {(localReplies || []).map((reply, index) => (
                                    <div key={reply.id || index} className="rounded-xl bg-secondary/30 backdrop-blur-md border border-border/50 shadow-sm px-3 py-2.5 animate-in slide-in-from-bottom-2 fade-in duration-300 group relative">
                                        <div className="relative z-10">
                                            <p className="text-sm text-foreground mb-2 leading-relaxed">{reply.content}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                                                    <span>{formatTimestamp(reply.timestamp)}</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleShare(reply)}
                                                    className="h-6 w-6 text-muted-foreground hover:text-white hover:bg-primary/20 hover:backdrop-blur-xl hover:shadow-[0_0_10px_rgba(236,72,153,0.2)] rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                                                >
                                                    <Share2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>



            {/* Share Modal */}
            {showShareModal && (
                <ShareModal
                    confession={confession}
                    reply={shareReply}
                    onClose={() => {
                        setShowShareModal(false);
                        setShareReply(undefined);
                    }}
                />
            )}
        </>
    );
}
