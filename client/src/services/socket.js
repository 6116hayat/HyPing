import { io } from 'socket.io-client';

let socket = null;

export function connectSocket() {
    if (socket && socket.connected) return socket;
    if (!socket) {
        socket = io('/', {
            autoConnect: true,
            transports: ['websocket'],
        });
    } else {
        socket.connect();
    }
    return socket;
}

export function getSocket() {
    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
    }
}