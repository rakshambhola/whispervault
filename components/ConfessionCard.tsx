'use client';

import { useState } from 'react';
import { Confession } from '@/types';
import { formatTimestamp, calculateVoteScore, getUserId, hasUserVoted, saveUserVote, removeUserVote } from '@/lib/utils';
import { ArrowUp, ArrowDown, MessageCircle, Flag, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface ConfessionCardProps {
    confession: Confession;
    onUpdate: () => void;
}

export default function ConfessionCard({ confession, onUpdate }: ConfessionCardProps) {
    const [showReplies, setShowReplies] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const userId = getUserId();

    const voteScore = calculateVoteScore(confession.upvotes, confession.downvotes);
    const hasUpvoted = hasUserVoted(confession.id, userId, 'upvote');
    const hasDownvoted = hasUserVoted(confession.id, userId, 'downvote');

    const handleVote = async (voteType: 'upvote' | 'downvote') => {
        const currentVote = hasUserVoted(confession.id, userId, voteType);

        try {
            if (currentVote) {
                await fetch('/api/vote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        targetId: confession.id,
                        targetType: 'confession',
                        voteType,
                        action: 'remove',
                    }),
                });
                removeUserVote(confession.id, userId);
            } else {
                const oppositeVote = voteType === 'upvote' ? 'downvote' : 'upvote';
                if (hasUserVoted(confession.id, userId, oppositeVote)) {
                    await fetch('/api/vote', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            targetId: confession.id,
                            targetType: 'confession',
                            voteType: oppositeVote,
                            action: 'remove',
                        }),
                    });
                    removeUserVote(confession.id, userId);
                }

                await fetch('/api/vote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        targetId: confession.id,
                        targetType: 'confession',
                        voteType,
                    }),
                });
                saveUserVote(confession.id, userId, voteType);
            }

            onUpdate();
        } catch (error) {
            console.error('Vote failed:', error);
        }
    };

    const handleReply = async () => {
        if (!replyContent.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await fetch('/api/confessions/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    confessionId: confession.id,
                    content: replyContent,
                }),
            });

            setReplyContent('');
            onUpdate();
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

    return (
        <>
            <Card className="border border-border bg-card shadow-none hover:border-primary/50 transition-colors duration-200">
                <CardContent className="p-6">
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
                        <p className="text-[16px] leading-relaxed text-foreground font-normal whitespace-pre-wrap break-words">
                            {confession.content}
                        </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleVote('upvote')}
                                    className={`h-8 w-8 rounded-md hover:bg-background ${hasUpvoted ? 'text-green-500' : 'text-muted-foreground'
                                        }`}
                                >
                                    <ArrowUp className="h-5 w-5" />
                                </Button>
                                <span className={`text-sm font-bold px-2 min-w-[1.5rem] text-center ${voteScore > 0 ? 'text-green-500' : voteScore < 0 ? 'text-red-500' : 'text-muted-foreground'
                                    }`}>
                                    {voteScore}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleVote('downvote')}
                                    className={`h-8 w-8 rounded-md hover:bg-background ${hasDownvoted ? 'text-red-500' : 'text-muted-foreground'
                                        }`}
                                >
                                    <ArrowDown className="h-5 w-5" />
                                </Button>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowReplies(!showReplies)}
                                className="h-10 px-3 text-muted-foreground hover:text-primary hover:bg-secondary/50 gap-2 rounded-lg transition-colors"
                            >
                                <MessageCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">{confession.replies.length}</span>
                            </Button>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowReportModal(true)}
                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        >
                            <Flag className="h-4 w-4" />
                        </Button>
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

                            {/* Replies List */}
                            <div className="space-y-4">
                                {confession.replies.map((reply) => (
                                    <div key={reply.id} className="bg-secondary/20 p-4 rounded-lg border border-border/50">
                                        <p className="text-sm text-foreground mb-2 leading-relaxed">{reply.content}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{formatTimestamp(reply.timestamp)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full shadow-lg border-border bg-card">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4 text-foreground">Report Confession</h3>
                            <div className="space-y-2">
                                {['Spam', 'Harassment', 'Inappropriate Content', 'Other'].map((reason) => (
                                    <Button
                                        key={reason}
                                        onClick={() => handleReport(reason)}
                                        variant="ghost"
                                        className="w-full justify-start h-10 hover:bg-secondary"
                                    >
                                        {reason}
                                    </Button>
                                ))}
                            </div>
                            <Separator className="my-4" />
                            <Button
                                onClick={() => setShowReportModal(false)}
                                variant="outline"
                                className="w-full"
                            >
                                Cancel
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}
