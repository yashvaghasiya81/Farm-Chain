import { io, Socket } from 'socket.io-client';

// Debug mode for enhanced logging
const DEBUG_MODE = true;

// Socket instance
let socket: Socket | null = null;

// User information
let currentUserId: string | null = null;
let currentAuctionId: string | null = null;

/**
 * Get the WebSocket server URL based on environment
 * @returns {string} WebSocket server URL
 */
export function getSocketUrl(): string {
  // Use environment variable in production, fallback for development
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  if (DEBUG_MODE) console.log(`[Socket] Using server URL: ${apiUrl}`);
  return apiUrl;
}

/**
 * Create and configure a Socket.io client instance
 * @returns {Socket} Socket.io client instance
 */
export function createSocket(): Socket {
  if (socket) {
    if (DEBUG_MODE) console.log('[Socket] Reusing existing socket connection');
    return socket;
  }

  const url = getSocketUrl();
  if (DEBUG_MODE) console.log(`[Socket] Creating new socket connection to ${url}`);

  // Create socket instance with reconnection enabled
  socket = io(url, {
    transports: ['websocket', 'polling'], // Try websocket first, fall back to polling
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
    forceNew: true // Force a new connection
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log(`[Socket] Connected successfully! Socket ID: ${socket.id}`);
  });

  socket.on('connect_error', (error) => {
    console.error(`[Socket] Connection error: ${error.message}`);
    console.log(`[Socket] Connection details: URL=${url}, Transport=${socket.io.engine.transport.name}`);
    
    // If we're on websocket and it failed, try polling
    if (socket.io.engine.transport.name === 'websocket') {
      if (DEBUG_MODE) console.log('[Socket] WebSocket failed, trying polling transport');
      socket.io.engine.transport.close();
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`[Socket] Disconnected: ${reason}`);
  });

  socket.io.on('reconnect_attempt', (attemptNumber) => {
    console.log(`[Socket] Reconnection attempt #${attemptNumber}`);
  });

  // Welcome message from server
  socket.on('connect:welcome', (data) => {
    if (DEBUG_MODE) console.log(`[Socket] Welcome message received:`, data);
  });

  return socket;
}

/**
 * Get the socket instance, creating it if necessary
 * @returns {Socket} Socket.io client instance
 */
export function getSocket(): Socket {
  return socket || createSocket();
}

/**
 * Close the socket connection
 */
export function closeSocket(): void {
  if (socket) {
    if (DEBUG_MODE) console.log('[Socket] Closing socket connection');
    socket.disconnect();
    socket = null;
  }
}

/**
 * Set current user ID for socket events
 * @param {string} userId - User ID
 */
export function setCurrentUser(userId: string): void {
  currentUserId = userId;
  if (DEBUG_MODE) console.log(`[Socket] Current user set to: ${userId}`);
}

/**
 * Join an auction room
 * @param {string} auctionId - Auction ID to join
 * @returns {Promise<object>} Promise resolving to join response
 */
export function joinAuction(auctionId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const socketInstance = getSocket();
    if (DEBUG_MODE) console.log(`[Socket] Joining auction: ${auctionId}`);
    
    // Leave previous auction if any
    if (currentAuctionId && currentAuctionId !== auctionId) {
      leaveAuction(currentAuctionId).catch(error => {
        console.warn(`[Socket] Error leaving previous auction: ${error.message}`);
      });
    }
    
    socketInstance.emit('auction:join', auctionId, (response: any) => {
      if (response && response.success) {
        currentAuctionId = auctionId;
        if (DEBUG_MODE) console.log(`[Socket] Joined auction ${auctionId} with ${response.participantCount} participants`);
        resolve(response);
      } else {
        const error = response?.error || 'Failed to join auction';
        console.error(`[Socket] Error joining auction: ${error}`);
        reject(new Error(error));
      }
    });
  });
}

/**
 * Leave an auction room
 * @param {string} auctionId - Auction ID to leave
 * @returns {Promise<object>} Promise resolving to leave response
 */
export function leaveAuction(auctionId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const socketInstance = getSocket();
    if (DEBUG_MODE) console.log(`[Socket] Leaving auction: ${auctionId}`);
    
    socketInstance.emit('auction:leave', auctionId, (response: any) => {
      if (response && response.success) {
        if (currentAuctionId === auctionId) {
          currentAuctionId = null;
        }
        if (DEBUG_MODE) console.log(`[Socket] Left auction ${auctionId}`);
        resolve(response);
      } else {
        const error = response?.error || 'Failed to leave auction';
        console.error(`[Socket] Error leaving auction: ${error}`);
        reject(new Error(error));
      }
    });
  });
}

/**
 * Place a bid on an auction
 * @param {string} auctionId - Auction ID
 * @param {number} amount - Bid amount
 * @param {string} userId - User ID (optional, will use currentUserId if not provided)
 * @returns {Promise<object>} Promise resolving to bid response
 */
export function placeBid(auctionId: string, amount: number, userId?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Use provided userId or fall back to currentUserId
    const bidUserId = userId || currentUserId;
    
    if (!bidUserId) {
      const error = 'User ID is required to place a bid';
      console.error(`[Socket] ${error}`);
      reject(new Error(error));
      return;
    }
    
    const socketInstance = getSocket();
    if (DEBUG_MODE) console.log(`[Socket] Placing bid of $${amount} on auction ${auctionId} by user ${bidUserId}`);
    
    const bidData = {
      auctionId,
      amount,
      userId: bidUserId
    };
    
    socketInstance.emit('auction:bid', bidData, (response: any) => {
      if (response && response.success) {
        if (DEBUG_MODE) console.log(`[Socket] Bid placed successfully on auction ${auctionId}: $${amount}`);
        resolve(response);
      } else {
        const error = response?.error || 'Failed to place bid';
        console.error(`[Socket] Error placing bid: ${error}`);
        reject(new Error(error));
      }
    });
  });
}

/**
 * Register a handler for auction updates (participant counts, etc.)
 * @param {function} handler - Handler function for updates
 * @returns {function} Function to unregister the handler
 */
export function onAuctionUpdate(handler: (data: any) => void): () => void {
  const socketInstance = getSocket();
  
  if (DEBUG_MODE) console.log('[Socket] Registering auction:update handler');
  socketInstance.on('auction:update', handler);
  
  return () => {
    if (DEBUG_MODE) console.log('[Socket] Unregistering auction:update handler');
    socketInstance.off('auction:update', handler);
  };
}

/**
 * Register a handler for new bids
 * @param {function} handler - Handler function for new bids
 * @returns {function} Function to unregister the handler
 */
export function onBid(handler: (data: any) => void): () => void {
  const socketInstance = getSocket();
  
  if (DEBUG_MODE) console.log('[Socket] Registering auction:bid handler');
  socketInstance.on('auction:bid', handler);
  
  return () => {
    if (DEBUG_MODE) console.log('[Socket] Unregistering auction:bid handler');
    socketInstance.off('auction:bid', handler);
  };
}

/**
 * Check and fix socket connection if needed
 * @returns {boolean} True if connection is now active, false otherwise
 */
export function checkConnection(): boolean {
  if (DEBUG_MODE) console.log('[Socket] Checking connection status');
  
  // If no socket exists, create one
  if (!socket) {
    if (DEBUG_MODE) console.log('[Socket] No socket instance found, creating new socket');
    createSocket();
    return socket?.connected || false;
  }
  
  // If socket exists but is not connected, try reconnecting
  if (!socket.connected) {
    if (DEBUG_MODE) console.log('[Socket] Socket exists but not connected, attempting to connect');
    
    // If socket is already attempting to reconnect, don't interfere
    if (socket.io.reconnecting) {
      if (DEBUG_MODE) console.log('[Socket] Reconnection already in progress');
      return false;
    }
    
    // Check if we've exceeded maximum reconnection attempts
    if (socket.io.reconnectionAttempts && socket.io.reconnectionAttempts > 3) {
      if (DEBUG_MODE) console.log('[Socket] Too many reconnection attempts, creating new socket');
      closeSocket(); // Close the current socket
      createSocket(); // Create a new one
      return socket?.connected || false;
    }
    
    // Force reconnection
    try {
      if (DEBUG_MODE) console.log('[Socket] Forcing socket to reconnect');
      socket.connect();
      return socket.connected;
    } catch (error) {
      console.error('[Socket] Error while reconnecting:', error);
      
      // If reconnection fails, try creating a new socket
      if (DEBUG_MODE) console.log('[Socket] Reconnection failed, creating new socket');
      closeSocket();
      createSocket();
      return socket?.connected || false;
    }
  }
  
  // Socket exists and is connected
  if (DEBUG_MODE) console.log('[Socket] Socket connection is active');
  return true;
}

export default {
  getSocket,
  createSocket,
  closeSocket,
  setCurrentUser,
  joinAuction,
  leaveAuction,
  placeBid,
  onAuctionUpdate,
  onBid,
  checkConnection
}; 