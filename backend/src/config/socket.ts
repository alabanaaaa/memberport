import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '@/config/app';
import { logger } from '@/utils/logger';

export function setupSocketIO(io: Server) {
  // Authentication middleware for Socket.IO
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.data.user.id}`);
    
    // Join user to their personal room
    socket.join(`user:${socket.data.user.id}`);
    
    // Join admin users to admin room
    if (socket.data.user.role === 'admin') {
      socket.join('admin');
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.data.user.id}`);
    });

    // Handle real-time events
    socket.on('join-room', (room) => {
      socket.join(room);
      logger.info(`User ${socket.data.user.id} joined room: ${room}`);
    });

    socket.on('leave-room', (room) => {
      socket.leave(room);
      logger.info(`User ${socket.data.user.id} left room: ${room}`);
    });
  });

  return io;
}

// Utility functions for emitting events
export function emitToUser(io: Server, userId: string, event: string, data: any) {
  io.to(`user:${userId}`).emit(event, data);
}

export function emitToAdmin(io: Server, event: string, data: any) {
  io.to('admin').emit(event, data);
}

export function emitToAll(io: Server, event: string, data: any) {
  io.emit(event, data);
}
