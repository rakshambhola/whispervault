'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { X, Download, Share2, Heart } from 'lucide-react';
import { Confession, Reply } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ShareModalProps {
    confession: Confession;
    reply?: Reply;
    onClose: () => void;
}

export default function ShareModal({ confession, reply, onClose }: ShareModalProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const captureRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!captureRef.current || isGenerating) return;

        setIsGenerating(true);
        try {
            const dataUrl = await toPng(captureRef.current, {
                quality: 1.0,
                pixelRatio: 2,
                backgroundColor: '#09090b', // Ensure dark background
            });

            const link = document.createElement('a');
            link.download = `whisper-vault-${reply ? 'reply' : 'confession'}-${confession.id}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to generate image', err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg p-4 animate-in fade-in duration-200 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[480px] my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="absolute -top-12 right-0 text-white/70 hover:text-white hover:bg-white/10 z-50"
                >
                    <X className="h-8 w-8" />
                </Button>

                <div className="space-y-6">
                    {/* Capture Area - Instagram Portrait (4:5) */}
                    <div
                        ref={captureRef}
                        className="bg-neutral-950 w-full aspect-[4/5] relative flex flex-col overflow-hidden shadow-2xl rounded-3xl border border-white/10"
                    >
                        {/* Rich Background */}
                        <div className="absolute inset-0 w-full h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-neutral-950 to-fuchsia-950" />
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />

                            {/* Abstract Orbs */}
                            <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] bg-violet-600/20 blur-[100px] rounded-full mix-blend-screen" />
                            <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] bg-fuchsia-600/20 blur-[100px] rounded-full mix-blend-screen" />
                            <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-blue-600/10 blur-[80px] rounded-full mix-blend-screen" />
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 flex-1 flex flex-col items-center justify-between p-8 sm:p-10 text-center">

                            {/* Header */}
                            <div className="space-y-3 pt-2">
                                <div className="inline-flex items-center justify-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2 rounded-full border border-white/10 shadow-lg">
                                    {/* Logo Icon */}
                                    <div className="w-5 h-5 bg-white"
                                        style={{
                                            maskImage: "url('/logo.png')",
                                            maskSize: "contain",
                                            maskRepeat: "no-repeat",
                                            maskPosition: "center",
                                            WebkitMaskImage: "url('/logo.png')",
                                            WebkitMaskSize: "contain",
                                            WebkitMaskRepeat: "no-repeat",
                                            WebkitMaskPosition: "center",
                                        }}
                                    />
                                    <span className="text-white/90 font-bold tracking-wide text-xs uppercase">Whisper Vault</span>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="w-full my-auto space-y-6">
                                <div className="space-y-2">
                                    <p className="text-white/50 text-xs font-medium tracking-widest uppercase">Anonymous Confession</p>
                                    <div className="relative py-2">
                                        <span className="absolute -top-4 -left-2 text-5xl text-white/10 font-serif">"</span>
                                        <p className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight drop-shadow-sm px-2">
                                            {confession.content}
                                        </p>
                                        <span className="absolute -bottom-6 -right-2 text-5xl text-white/10 font-serif">"</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-white/60">
                                    <Heart className="w-4 h-4 fill-rose-500/20 text-rose-500" />
                                    <span className="font-medium text-sm">{confession.upvotes} people felt this</span>
                                </div>

                                {/* Reply Section */}
                                {reply && (
                                    <div className="relative mt-6">
                                        <div className="absolute inset-0 bg-white/5 blur-xl rounded-full transform scale-y-50" />
                                        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl p-5 text-left shadow-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-1 h-3 bg-primary rounded-full" />
                                                <span className="text-primary font-bold text-[10px] uppercase tracking-wider">Top Reply</span>
                                            </div>
                                            <p className="text-lg text-white/90 leading-relaxed font-medium">
                                                {reply.content}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="w-full pt-6 border-t border-white/5">
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-white/40 text-xs font-medium">Read more stories at</p>
                                    <div className="px-5 py-1.5 bg-white/5 rounded-full border border-white/10">
                                        <span className="text-white/80 font-semibold tracking-wide text-sm">whispervault.vercel.app</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <Button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="w-full bg-white text-black hover:bg-white/90 font-bold h-12 text-base rounded-xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Generating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Download for Instagram
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
