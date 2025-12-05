'use client';

import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { X, Download, Terminal, Heart, Sparkles, CloudRain, Smile, Ghost, Shuffle, Gift } from 'lucide-react';
import { Confession, Reply } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

interface ShareModalProps {
    confession: Confession;
    reply?: Reply;
    onClose: () => void;
}

type Theme = 'code' | 'love' | 'valentine' | 'sad' | 'funny' | 'dark' | 'mix';

export default function ShareModal({ confession, reply, onClose }: ShareModalProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const captureRef = useRef<HTMLDivElement>(null);
    const [theme, setTheme] = useState<Theme>('mix');

    useEffect(() => {
        const tags = confession.tags?.map(t => t.toLowerCase()) || [];

        const loveTags = ['love', 'crush', 'romance', 'relationship', 'dating', 'heart', 'soulmate', 'cute'];
        const valentineTags = ['valentine', 'marriage', 'wedding', 'proposal', 'wife', 'husband', 'forever'];
        const sadTags = ['sad', 'depression', 'lonely', 'heartbreak', 'pain', 'crying', 'alone', 'grief'];
        const funnyTags = ['funny', 'joke', 'meme', 'lol', 'humor', 'laugh', 'silly'];
        const darkTags = ['secret', 'dark', 'deep', 'fear', 'scary', 'confession', 'guilt', 'anonymous'];
        const codeTags = ['code', 'coding', 'dev', 'developer', 'programming', 'tech', 'bug', 'linux', 'web', 'javascript', 'typescript', 'python', 'react', 'nextjs'];

        if (tags.some(t => valentineTags.includes(t))) setTheme('valentine');
        else if (tags.some(t => loveTags.includes(t))) setTheme('love');
        else if (tags.some(t => sadTags.includes(t))) setTheme('sad');
        else if (tags.some(t => funnyTags.includes(t))) setTheme('funny');
        else if (tags.some(t => darkTags.includes(t))) setTheme('dark');
        else if (tags.some(t => codeTags.includes(t))) setTheme('code');
        else setTheme('mix');
    }, [confession.tags]);

    const getBackgroundColor = (t: Theme) => {
        switch (t) {
            case 'love': return '#FFF9F0';
            case 'valentine': return '#FDF6E3';
            case 'sad': return '#E8EBF7';
            case 'funny': return '#FFD700';
            case 'dark': return '#0F0F1E';
            case 'mix': return '#F0F4F8';
            default: return '#000000';
        }
    };

    // Dynamic font size based on content length
    const getFontSize = (contentLength: number) => {
        if (contentLength < 50) return 'text-5xl md:text-6xl';
        if (contentLength < 100) return 'text-4xl md:text-5xl';
        if (contentLength < 150) return 'text-3xl md:text-4xl';
        if (contentLength < 200) return 'text-2xl md:text-3xl';
        return 'text-xl md:text-2xl';
    };

    const handleDownload = async () => {
        if (!captureRef.current || isGenerating) return;

        setIsGenerating(true);
        try {
            await document.fonts.ready;

            const dataUrl = await toPng(captureRef.current, {
                quality: 1.0,
                pixelRatio: 3,
                backgroundColor: getBackgroundColor(theme),
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

    const getLineNumbers = () => {
        const lines = Math.ceil(confession.content.length / 40) + (reply ? Math.ceil(reply.content.length / 40) + 3 : 1);
        return Array.from({ length: Math.max(lines, 5) }, (_, i) => i + 1);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-200 overflow-y-auto"
            onClick={onClose}
        >
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Bangers&family=Special+Elite&family=Outfit:wght@400;700&family=Great+Vibes&display=swap');
            `}</style>

            <div
                className="relative w-full max-w-[420px] my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute -top-16 right-0 flex gap-2 z-50">
                    <div className="bg-black/50 backdrop-blur-md rounded-full p-1 flex border border-white/10 gap-1 overflow-x-auto max-w-[calc(100vw-80px)] sm:max-w-none scrollbar-hide">
                        <Button onClick={() => setTheme('mix')} variant="ghost" size="icon" className={cn("rounded-full w-8 h-8 shrink-0", theme === 'mix' ? "bg-violet-500/20 text-violet-400" : "text-white/50 hover:text-violet-400")} title="Mix">
                            <Shuffle className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => setTheme('code')} variant="ghost" size="icon" className={cn("rounded-full w-8 h-8 shrink-0", theme === 'code' ? "bg-white/20 text-white" : "text-white/50 hover:text-white")} title="Code">
                            <Terminal className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => setTheme('love')} variant="ghost" size="icon" className={cn("rounded-full w-8 h-8 shrink-0", theme === 'love' ? "bg-pink-500/20 text-pink-400" : "text-white/50 hover:text-pink-400")} title="Love">
                            <Heart className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => setTheme('valentine')} variant="ghost" size="icon" className={cn("rounded-full w-8 h-8 shrink-0", theme === 'valentine' ? "bg-red-500/20 text-red-500" : "text-white/50 hover:text-red-500")} title="Valentine">
                            <Gift className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => setTheme('sad')} variant="ghost" size="icon" className={cn("rounded-full w-8 h-8 shrink-0", theme === 'sad' ? "bg-blue-500/20 text-blue-400" : "text-white/50 hover:text-blue-400")} title="Sad">
                            <CloudRain className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => setTheme('funny')} variant="ghost" size="icon" className={cn("rounded-full w-8 h-8 shrink-0", theme === 'funny' ? "bg-yellow-500/20 text-yellow-400" : "text-white/50 hover:text-yellow-400")} title="Funny">
                            <Smile className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => setTheme('dark')} variant="ghost" size="icon" className={cn("rounded-full w-8 h-8 shrink-0", theme === 'dark' ? "bg-gray-500/20 text-gray-400" : "text-white/50 hover:text-gray-400")} title="Dark">
                            <Ghost className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button onClick={onClose} variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full shrink-0">
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <div className="space-y-6">
                    <div ref={captureRef} className="w-full aspect-[4/5] relative flex flex-col overflow-hidden shadow-2xl transition-all duration-500">

                        {/* Mix Theme - Modern Glassmorphic */}
                        {theme === 'mix' && (
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#F0F4F8] via-[#E8EBF7] to-[#F0F4F8] flex flex-col items-center justify-between p-12 text-center overflow-hidden">
                                {/* Glassmorphic background elements */}
                                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-violet-400/30 to-blue-400/30 rounded-full blur-3xl" />
                                <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl" />
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-300/20 to-blue-300/20 rounded-full blur-2xl" />

                                {/* Header */}
                                <div className="relative z-10 w-full flex justify-between items-center">
                                    <span className="text-xs font-sans text-slate-600 tracking-wider uppercase">Whisper Vault</span>
                                    <div className="w-8 h-8 rounded-full bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center shadow-lg">
                                        <span className="text-slate-700 text-sm">→</span>
                                    </div>
                                </div>

                                {/* Main content - Glassmorphic card */}
                                <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-full px-4">
                                    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl">
                                        <div style={{ fontFamily: '"Outfit", sans-serif' }} className="leading-tight">
                                            <p className={`${getFontSize(confession.content.length)} font-semibold bg-gradient-to-br from-slate-800 to-slate-600 bg-clip-text text-transparent`}>
                                                {confession.content}
                                            </p>
                                            {reply && (
                                                <div className="mt-6 pt-6 border-t border-slate-300/50">
                                                    <p className="text-lg md:text-xl text-slate-600 italic">{reply.content}</p>
                                                </div>
                                            )}
                                        </div>
                                        {confession.tags && confession.tags.length > 0 && (
                                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                                {confession.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 text-xs font-medium text-slate-600 bg-white/50 backdrop-blur-sm rounded-full border border-white/60">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer with Logo */}
                                <div className="relative z-10 w-full">
                                    <div className="flex items-center justify-center gap-2 bg-white/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/60 inline-flex mx-auto shadow-lg">
                                        <Logo size={16} color="#475569" />
                                        <span className="text-xs font-medium text-slate-600 tracking-wide">@whispervault</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Code Theme - unchanged */}
                        {theme === 'code' && (
                            <>
                                <div className="absolute inset-0 w-full h-full bg-[#0a0a0a]">
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.3),transparent_50%)]" />
                                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(74,58,255,0.2),transparent_50%)]" />
                                    <div className="absolute top-[30%] left-[-20%] w-[60%] h-[60%] bg-fuchsia-500/10 blur-[100px] rounded-full" />
                                    <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[80px] rounded-full" />
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay" />
                                </div>
                                <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-8">
                                    <div className="w-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/5">
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
                                            <div className="w-10" />
                                        </div>
                                        <div className="p-5 font-mono text-sm leading-relaxed relative group">
                                            <div className=" flex gap-4">
                                                <div className="flex flex-col text-right select-none text-white/30 text-xs pt-[2px] min-w-[1.5rem]">
                                                    {getLineNumbers().map(n => (<span key={n} className="leading-relaxed">{n}</span>))}
                                                </div>
                                                <div className="flex-1 text-gray-200">
                                                    <div className="text-purple-300 mb-1">const <span className="text-blue-300">confession</span> = <span className="text-yellow-300">{'{'}</span></div>
                                                    <div className="pl-4"><span className="text-blue-300">id</span>: <span className="text-orange-300">"{confession.id.slice(0, 8)}"</span>,</div>
                                                    <div className="pl-4"><span className="text-blue-300">content</span>: <span className="text-green-300">"{confession.content}"</span>,</div>
                                                    <div className="pl-4"><span className="text-blue-300">tags</span>: [<span className="text-orange-300">{confession.tags?.map(t => `"#${t}"`).join(', ')}</span>],</div>
                                                    <div className="pl-4 mb-1"><span className="text-blue-300">likes</span>: <span className="text-purple-300">{confession.upvotes}</span>,</div>
                                                    {reply && (<><div className="pl-4 mt-2 text-gray-400 italic">// Top Reply</div><div className="pl-4"><span className="text-blue-300">reply</span>: <span className="text-green-300">"{reply.content}"</span>,</div></>)}
                                                    <div className="text-yellow-300">{'}'}</div>
                                                    <div className="mt-2 text-gray-400 animate-pulse">_</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 p-6 pb-8 text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                                        <Logo size={16} color="#FFFFFF" />
                                        <span className="text-xs font-bold text-white/80 tracking-widest uppercase">Whisper Vault</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Love & Valentine themes - unchanged, just update logo */}
                        {theme === 'love' && (
                            <div className="absolute inset-0 w-full h-full bg-[#FFF9F0] flex flex-col items-center justify-center p-8 text-center">
                                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                    <svg viewBox="0 0 200 200" className="w-[120%] h-[120%] text-pink-400 fill-current animate-pulse duration-[3000ms]">
                                        <path d="M100 180s-60-40-80-80c-20-40 10-70 50-60 20 5 30 20 30 20s10-15 30-20c40-10 70 20 50 60C160 140 100 180 100 180z" />
                                    </svg>
                                </div>
                                <Sparkles className="absolute top-12 left-12 w-8 h-8 text-pink-400/60 animate-bounce duration-[2000ms]" />
                                <Sparkles className="absolute bottom-24 right-12 w-6 h-6 text-pink-400/60 animate-bounce duration-[2500ms]" />
                                <div className="absolute top-20 right-16 text-2xl text-pink-400/40">✨</div>
                                <div className="absolute bottom-32 left-16 text-xl text-pink-400/40">✨</div>
                                <div className="relative z-10 max-w-full">
                                    <div style={{ fontFamily: 'Caveat, cursive' }} className="text-[#C0392B] leading-tight">
                                        <p className={`${getFontSize(confession.content.length)} mb-8 font-bold transform -rotate-2`}>"{confession.content}"</p>
                                        {reply && (<div className="mt-8 relative"><div className="h-px w-24 bg-[#C0392B]/30 mx-auto mb-6" /><p className="text-2xl md:text-3xl text-[#D98880] transform rotate-1">{reply.content}</p></div>)}
                                    </div>
                                    {confession.tags && confession.tags.length > 0 && (
                                        <div className="mt-8 flex flex-wrap justify-center gap-2">
                                            {confession.tags.map(tag => (<span key={tag} className="text-sm font-medium text-[#C0392B]/60 tracking-wider uppercase">#{tag}</span>))}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-8 left-0 right-0 text-center">
                                    <div className="inline-flex items-center gap-2">
                                        <Logo size={16} color="#C0392B" />
                                        <span className="text-sm font-bold text-[#C0392B] tracking-widest uppercase">Whisper Vault</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {theme === 'valentine' && (
                            <div className="absolute inset-0 w-full h-full bg-[#FDF6E3] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-red-400/20 blur-3xl rounded-full animate-pulse" />
                                    <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 text-red-500/10 fill-current blur-xl" />
                                    <Heart className="absolute top-10 left-10 w-12 h-12 text-red-400/30 fill-current blur-sm animate-bounce duration-[3000ms]" />
                                    <Heart className="absolute top-20 right-20 w-16 h-16 text-red-400/20 fill-current blur-md animate-bounce duration-[4000ms]" />
                                    <Heart className="absolute bottom-32 left-12 w-20 h-20 text-red-400/20 fill-current blur-md animate-bounce duration-[3500ms]" />
                                    <Heart className="absolute bottom-10 right-10 w-14 h-14 text-red-400/30 fill-current blur-sm animate-bounce duration-[4500ms]" />
                                </div>
                                <div className="relative z-10 max-w-full">
                                    <div style={{ fontFamily: '"Great Vibes", cursive' }} className="text-[#D32F2F] leading-tight">
                                        <p className="text-xl mb-4 tracking-widest uppercase font-sans text-red-800/60">Happy Valentine's Day</p>
                                        <p className={`${getFontSize(confession.content.length)} mb-8 drop-shadow-sm`}>{confession.content}</p>
                                        {reply && (<div className="mt-8"><p className="text-3xl md:text-4xl text-[#E57373]">{reply.content}</p></div>)}
                                    </div>
                                    {confession.tags && confession.tags.length > 0 && (
                                        <div className="mt-12 flex flex-wrap justify-center gap-2">
                                            {confession.tags.map(tag => (<span key={tag} className="text-xs font-bold text-red-800/40 uppercase tracking-widest font-sans">{tag}</span>))}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-8 left-0 right-0 text-center">
                                    <div className="inline-flex items-center gap-2">
                                        <Logo size={16} color="#8B0000" />
                                        <span className="text-xs font-bold text-red-800/60 tracking-widest uppercase font-sans">Whisper Vault</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sad Theme - Redesigned Modern Glassmorphic */}
                        {theme === 'sad' && (
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#E8EBF7] via-[#D6DDEF] to-[#E8EBF7] flex flex-col items-center justify-between p-12 text-center overflow-hidden">
                                {/* Glassmorphic background elements */}
                                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-slate-400/20 to-blue-400/20 rounded-full blur-3xl" />

                                {/* Floating rain drops */}
                                <div className="absolute top-12 left-1/4 w-1 h-12 bg-blue-300/30 rounded-full animate-[fall_3s_ease-in_infinite]" />
                                <div className="absolute top-20 right-1/3 w-1 h-16 bg-blue-300/30 rounded-full animate-[fall_4s_ease-in_infinite_0.5s]" />
                                <div className="absolute top-16 left-1/2 w-1 h-14 bg-blue-300/30 rounded-full animate-[fall_3.5s_ease-in_infinite_1s]" />

                                {/* Header */}
                                <div className="relative z-10 w-full">
                                    <span className="text-xs font-sans text-slate-500/80 tracking-widest uppercase">Whisper Vault</span>
                                </div>

                                {/* Main content - Glassmorphic card */}
                                <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-full px-4">
                                    <div className="bg-white/30 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl">
                                        <div style={{ fontFamily: '"Playfair Display", serif' }} className="leading-tight">
                                            <p className={`${getFontSize(confession.content.length)} font-light italic text-slate-700`}>
                                                {confession.content}
                                            </p>
                                            {reply && (
                                                <div className="mt-6 pt-6 border-t border-slate-400/30">
                                                    <p className="text-base md:text-lg text-slate-600 italic">{reply.content}</p>
                                                </div>
                                            )}
                                        </div>
                                        {confession.tags && confession.tags.length > 0 && (
                                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                                {confession.tags.map(tag => (
                                                    <span key={tag} className="text-xs font-medium text-slate-600/70 tracking-wider uppercase">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer with Logo */}
                                <div className="relative z-10 w-full">
                                    <div className="flex items-center justify-center gap-2 bg-white/25 backdrop-blur-md rounded-full px-4 py-2 border border-white/50 inline-flex mx-auto shadow-lg">
                                        <Logo size={14} color="#64748B" />
                                        <span className="text-xs font-medium text-slate-600 tracking-wide">@whispervault</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Funny theme - unchanged, just update logo */}
                        {theme === 'funny' && (
                            <div className="absolute inset-0 w-full h-full bg-[#FFD700] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
                                <div className="relative z-10 max-w-full transform rotate-1">
                                    <div style={{ fontFamily: 'Bangers, cursive' }} className="text-black leading-tight tracking-wide">
                                        <p className={`${getFontSize(confession.content.length)} mb-6 drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]`}>{confession.content}</p>
                                        {reply && (<div className="mt-6 bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] transform -rotate-2"><p className="text-2xl md:text-3xl text-black">{reply.content}</p></div>)}
                                    </div>
                                    {confession.tags && confession.tags.length > 0 && (
                                        <div className="mt-8 flex flex-wrap justify-center gap-2">
                                            {confession.tags.map(tag => (<span key={tag} className="text-sm font-bold text-black bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase">#{tag}</span>))}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-6 left-0 right-0 text-center">
                                    <div className="inline-flex items-center gap-2 bg-black text-[#FFD700] px-4 py-1 font-bold text-sm uppercase tracking-wider transform -rotate-1 shadow-[4px_4px_0px_rgba(255,255,255,1)]">
                                        <Logo size={16} color="#FFD700" />
                                        <span>Whisper Vault</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dark Theme - Redesigned Modern Glassmorphic */}
                        {theme === 'dark' && (
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0F0F1E] via-[#1A1A2E] to-[#0F0F1E] flex flex-col items-center justify-between p-12 text-center overflow-hidden">
                                {/* Glassmorphic background elements */}
                                <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                                <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full blur-3xl" />
                                <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl" />

                                {/* Spotlight effect */}
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-violet-400/20 blur-2xl" />

                                {/* Header */}
                                <div className="relative z-10 w-full">
                                    <span className="text-xs font-sans text-violet-300/50 tracking-widest uppercase">Whisper Vault</span>
                                </div>

                                {/* Main content - Glassmorphic card */}
                                <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-full px-4">
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                                        <div style={{ fontFamily: '"Outfit", sans-serif' }} className="leading-tight">
                                            <p className={`${getFontSize(confession.content.length)} font-light text-violet-100`}>
                                                {confession.content}
                                            </p>
                                            {reply && (
                                                <div className="mt-6 pt-6 border-t border-violet-400/20">
                                                    <p className="text-base md:text-lg text-violet-200/80 italic">{reply.content}</p>
                                                </div>
                                            )}
                                        </div>
                                        {confession.tags && confession.tags.length > 0 && (
                                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                                {confession.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 text-xs font-medium text-violet-300/70 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer with Logo */}
                                <div className="relative z-10 w-full">
                                    <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 inline-flex mx-auto shadow-lg">
                                        <Logo size={14} color="#A78BFA" />
                                        <span className="text-xs font-medium text-violet-300/80 tracking-wide">@whispervault</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button onClick={handleDownload} disabled={isGenerating} className="w-full bg-white text-black hover:bg-white/90 font-bold h-12 text-base rounded-xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {isGenerating ? (<span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Generating...</span>) : (<span className="flex items-center gap-2"><Download className="w-4 h-4" />Download Image</span>)}
                    </Button>
                </div>
            </div>
        </div>
    );
}
