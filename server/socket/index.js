import { Server } from 'socket.io';

export function initSocket(httpServer, allowedOrigin) {
    const io = new Server(httpServer, {
        cors: {
            origin: allowedOrigin,
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('[socket] client connected:', socket.id);

        // Phase 3+ will add real event handlers here.

        socket.on('disconnect', (reason) => {
            console.log('[socket] disconnected:', socket.id, '—', reason);
        });
    });

    return io;
}