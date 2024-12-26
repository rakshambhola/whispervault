import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { confessionStoreDB as confessionStore } from '@/lib/confessionStoreDB';

// Force Node.js runtime (required for Mongoose)
export const runtime = 'nodejs';

export async function GET() {
    try {
        // Verify admin token
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token');
        if (!token || token.value !== 'true') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const reports = await confessionStore.getReportedConfessions();
        const allConfessions = await confessionStore.getAllConfessions();

        return NextResponse.json({
            reports,
            blockedIps: [], // Redis-based IP blocking, handled separately
            allConfessions,
            stats: {
                totalConfessions: allConfessions.length,
                totalReports: reports.length,
                totalBlockedIps: 0, // Would need Redis query to get this
            },
        });
    } catch (error) {
        console.error('Admin data error:', error);
        return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 });
    }
}
