'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { X, Download, Terminal } from 'lucide-react';
import { Confession, Reply } from '@/types';
import { Button } from '@/components/ui/button';

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
                pixelRatio: 3,
                backgroundColor: '#000000',
            });

            const link = document.createElement('a');
            link.download = `whisper-vault-${confession.id}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to generate image', err);
        } finally {
            setIsGenerating(false);
        }
    };

    // Helper to generate line numbers based on text length
    const getLineNumbers = () => {
        const lines = Math.ceil(confession.content.length / 40) + (reply ? Math.ceil(reply.content.length / 40) + 3 : 1);
        return Array.from({ length: Math.max(lines, 5) }, (_, i) => i + 1);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-200 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[420px] my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="absolute -top-12 right-0 text-white/70 hover:text-white hover:bg-white/10 z-50 rounded-full"
                >
                    <X className="h-6 w-6" />
                </Button>

                <div className="space-y-6">
                    {/* Capture Area - 4:5 Aspect Ratio for Social Media */}
                    <div
                        ref={captureRef}
                        className="w-full aspect-[4/5] relative flex flex-col overflow-hidden shadow-2xl"
                    >
                        {/* Premium Background */}
                        <div className="absolute inset-0 w-full h-full bg-[#0a0a0a]">
                            {/* Mesh Gradients */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.3),transparent_50%)]" />
                            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(74,58,255,0.2),transparent_50%)]" />
                            <div className="absolute top-[30%] left-[-20%] w-[60%] h-[60%] bg-fuchsia-500/10 blur-[100px] rounded-full" />
                            <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[80px] rounded-full" />

                            {/* Noise Texture */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay" />
                        </div>

                        {/* Main Content - Centered */}
                        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-8">

                            {/* Glassmorphic Code Editor Window */}
                            <div className="w-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/5">
                                {/* Window Header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm" />
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm" />
                                        <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm" />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-white/60 font-medium font-mono">
                                        <Terminal className="w-3 h-3" />
                                        <span>confession.ts</span>
                                    </div>
                                    <div className="w-10" /> {/* Spacer for centering */}
                                </div>

                                {/* Editor Content */}
                                <div className="p-5 font-mono text-sm leading-relaxed relative group">
                                    <div className="flex gap-4">
                                        {/* Line Numbers */}
                                        <div className="flex flex-col text-right select-none text-white/30 text-xs pt-[2px] min-w-[1.5rem]">
                                            {getLineNumbers().map(n => (
                                                <span key={n} className="leading-relaxed">{n}</span>
                                            ))}
                                        </div>

                                        {/* Code Content */}
                                        <div className="flex-1 text-gray-200">
                                            <div className="text-purple-300 mb-1">const <span className="text-blue-300">confession</span> = <span className="text-yellow-300">{'{'}</span></div>
                                            <div className="pl-4">
                                                <span className="text-blue-300">id</span>: <span className="text-orange-300">"{confession.id.slice(0, 8)}"</span>,
                                            </div>
                                            <div className="pl-4">
                                                <span className="text-blue-300">content</span>: <span className="text-green-300">"{confession.content}"</span>,
                                            </div>
                                            <div className="pl-4">
                                                <span className="text-blue-300">tags</span>: [<span className="text-orange-300">{confession.tags?.map(t => `"#${t}"`).join(', ')}</span>],
                                            </div>
                                            <div className="pl-4 mb-1">
                                                <span className="text-blue-300">likes</span>: <span className="text-purple-300">{confession.upvotes}</span>,
                                            </div>

                                            {reply && (
                                                <>
                                                    <div className="pl-4 mt-2 text-gray-400 italic">
                                                        // Top Reply
                                                    </div>
                                                    <div className="pl-4">
                                                        <span className="text-blue-300">reply</span>: <span className="text-green-300">"{reply.content}"</span>,
                                                    </div>
                                                </>
                                            )}

                                            <div className="text-yellow-300">{'}'}</div>
                                            <div className="mt-2 text-gray-400 animate-pulse">_</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Footer Branding */}
                        <div className="relative z-10 p-6 pb-8 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                                <div className="w-4 h-4 bg-white"
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
                                <span className="text-xs font-bold text-white/80 tracking-widest uppercase">Whisper Vault</span>
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
                                Download Image
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
