import { NextRequest } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';
import { ChatMessage, ChatRoom } from '@/types';
import { generateId } from '@/lib/utils';

// In-memory storage
const chatRooms = new Map<string, ChatRoom>();
const userRooms = new Map<string, string>();
const socketUsers = new Map<string, string>();

export async function GET(req: NextRequest) {
    const res = (req as any).res;

    if (!res.socket.server.io) {
        console.log('Initializing Socket.io');

        const httpServer: NetServer = res.socket.server;
        const io = new SocketIOServer(httpServer, {
            path: '/api/socket',
            addTrailingSlash: false,
        });

        io.on('connection', (socket) => {
            console.log('User connected:', socket.id);

            socket.on('join-chat', (userId: string) => {
                // Store socket-user mapping
                socketUsers.set(socket.id, userId);

                let roomId: string | null = null;

                // Find all available rooms (rooms with exactly 1 user)
                const availableRooms: string[] = [];
                for (const [id, room] of chatRooms.entries()) {
                    if (room.users.length === 1 && !room.users.includes(userId)) {
                        availableRooms.push(id);
                    }
                }

                // Pick a random room if available
                if (availableRooms.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableRooms.length);
                    roomId = availableRooms[randomIndex];
                }

                if (!roomId) {
                    roomId = generateId();
                    chatRooms.set(roomId, {
                        id: roomId,
                        users: [],
                        messages: [],
                        createdAt: Date.now(),
                    });
                }

                const room = chatRooms.get(roomId)!;
                // Prevent duplicate join
                if (!room.users.includes(userId)) {
                    room.users.push(userId);
                    userRooms.set(userId, roomId);
                    socket.join(roomId);
                }

                socket.emit('room-joined', { roomId, userCount: room.users.length });
                socket.to(roomId).emit('user-joined', { userCount: room.users.length });
            });

            socket.on('send-message', (data: { userId: string; content: string; image?: string }) => {
                const roomId = userRooms.get(data.userId);
                if (!roomId) return;

                const room = chatRooms.get(roomId);
                if (!room) return;

                const message: ChatMessage = {
                    id: generateId(),
                    content: data.content,
                    image: data.image,
                    timestamp: Date.now(),
                    userId: data.userId,
                    roomId,
                };

                room.messages.push(message);
                io.to(roomId).emit('new-message', message);
            });

            socket.on('typing', (data: { userId: string; isTyping: boolean }) => {
                const roomId = userRooms.get(data.userId);
                if (!roomId) return;
                socket.to(roomId).emit('user-typing', data.isTyping);
            });

            const handleCleanup = (userId: string) => {
                const roomId = userRooms.get(userId);
                if (!roomId) return;

                const room = chatRooms.get(roomId);
                if (room) {
                    room.users = room.users.filter(id => id !== userId);

                    if (room.users.length === 0) {
                        chatRooms.delete(roomId);
                    } else {
                        socket.to(roomId).emit('user-left', { userCount: room.users.length });
                        socket.to(roomId).emit('partner-disconnected');
                    }
                }

                userRooms.delete(userId);
                socket.leave(roomId);
            };

            socket.on('leave-chat', (userId: string) => {
                handleCleanup(userId);
                socketUsers.delete(socket.id);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
                const userId = socketUsers.get(socket.id);
                if (userId) {
                    handleCleanup(userId);
                    socketUsers.delete(socket.id);
                }
            });
        });

        res.socket.server.io = io;
    }

    res.end();
}
