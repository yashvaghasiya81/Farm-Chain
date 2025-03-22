import { io } from 'socket.io-client';

// Create a mock socket for local development
class MockSocket {
  private listeners: Record<string, Function[]> = {};
  private rooms: Set<string> = new Set();

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return this;
  }

  off(event: string, callback?: Function) {
    if (!this.listeners[event]) return this;
    
    if (callback) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    } else {
      this.listeners[event] = [];
    }
    
    return this;
  }

  emit(event: string, data?: any) {
    console.log(`Socket emit: ${event}`, data);
    
    // Simulate server responses for specific events
    if (event === 'joinAuction') {
      setTimeout(() => {
        this.triggerEvent('participantUpdate', { count: Math.floor(Math.random() * 10) + 5 });
      }, 1000);
    }
    
    if (event === 'placeBid') {
      // Simulate the server broadcasting the bid to all clients
      setTimeout(() => {
        this.triggerEvent('newBid', {
          amount: data.amount,
          bidder: {
            id: 'current-user',
            name: 'You',
          },
          timestamp: new Date()
        });
      }, 500);
    }
    
    return this;
  }

  private triggerEvent(event: string, data: any) {
    if (!this.listeners[event]) return;
    
    this.listeners[event].forEach(callback => {
      callback(data);
    });
  }
}

// Use real socket in production, mock in development
const createSocket = () => {
  if (process.env.NODE_ENV === 'production') {
    // In a real application, connect to your WebSocket server
    return io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000');
  } else {
    // For development/demo use a mock implementation
    return new MockSocket() as any;
  }
};

export const socket = createSocket();

// Helper functions for auction-related socket events
export const joinAuction = (auctionId: string) => {
  socket.emit('joinAuction', { auctionId });
};

export const leaveAuction = (auctionId: string) => {
  socket.emit('leaveAuction', { auctionId });
};

export const placeBid = (auctionId: string, amount: number, userId: string) => {
  socket.emit('placeBid', { auctionId, amount, userId });
};

export default socket; 