import { NextRequest, NextResponse } from 'next/server';
import { confessionStoreDB as confessionStore } from '@/lib/confessionStoreDB';
import { getUserIP } from '@/lib/ip';
import { prisma } from '@/lib/db/prisma';

// Force Node.js runtime (required for Mongoose)
export const runtime = 'nodejs';

// POST - Vote on confession or reply
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { targetId, targetType, voteType, action } = body;

        if (!targetId || !targetType || !voteType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get user's IP for tracking
        const ip = await getUserIP();

        let success = false;

        if (action === 'remove') {
            // Remove vote from database
            await prisma.vote.deleteMany({
                where: {
                    ip,
                    targetId,
                    targetType,
                },
            });

            // Remove vote from confession/reply counts
            if (targetType === 'confession') {
                success = await confessionStore.removeVoteConfession(targetId, voteType);
            }
        } else {
            // Check if user already voted differently
            const existingVote = await prisma.vote.findUnique({
                where: {
                    ip_targetId_targetType: {
                        ip,
                        targetId,
                        targetType,
                    },
                },
            });

            // If switching vote type, remove old vote first
            if (existingVote && existingVote.voteType !== voteType) {
                await confessionStore.removeVoteConfession(targetId, existingVote.voteType as 'upvote' | 'downvote');
            }

            // Upsert the vote (create or update)
            await prisma.vote.upsert({
                where: {
                    ip_targetId_targetType: {
                        ip,
                        targetId,
                        targetType,
                    },
                },
                update: {
                    voteType,
                },
                create: {
                    ip,
                    targetId,
                    targetType,
                    voteType,
                },
            });

            // Add vote to confession/reply counts
            if (targetType === 'confession') {
                success = await confessionStore.voteConfession(targetId, voteType);
            }
        }

        if (!success && targetType === 'confession') {
            return NextResponse.json(
                { error: 'Vote failed' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Vote error:', error);
        return NextResponse.json(
            { error: 'Failed to process vote' },
            { status: 500 }
        );
    }
}
