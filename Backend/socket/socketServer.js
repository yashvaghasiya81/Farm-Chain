const { Server } = require('socket.io');
const logger = require('./socketLogger');

/**
 * Configures and initializes a Socket.io server
 * @param {Object} httpServer - HTTP server instance to attach Socket.io to
 * @param {Object} options - Configuration options
 * @returns {Object} Configured Socket.io server instance
 */
function createSocketServer(httpServer, options = {}) {
  // Default options
  const config = {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    ...options
  };

  // Create Socket.io server
  const io = new Server(httpServer, config);
  
  // Data stores for tracking connections and auction rooms
  const connectedUsers = new Map();
  const auctionRooms = new Map();
  
  // Set up connection handler
  io.on('connection', (socket) => {
    const socketId = socket.id;
    
    // Store user information
    connectedUsers.set(socketId, {
      id: socketId,
      joinedAt: new Date(),
      rooms: []
    });
    
    logger.info(`Client connected: ${socketId}`);
    logger.debug(`Total connections: ${connectedUsers.size}`);
    
    // Send welcome message
    socket.emit('connect:welcome', { 
      socketId,
      timestamp: new Date().toISOString()
    });
    
    // Handle joining auction room
    socket.on('auction:join', (auctionId, callback) => {
      const roomId = `auction:${auctionId}`;
      logger.info(`Client ${socketId} joining auction: ${auctionId}`);
      
      // Join the room
      socket.join(roomId);
      
      // Track user in room
      const user = connectedUsers.get(socketId);
      if (user && !user.rooms.includes(roomId)) {
        user.rooms.push(roomId);
      }
      
      // Track room participants
      if (!auctionRooms.has(auctionId)) {
        auctionRooms.set(auctionId, new Set());
      }
      
      auctionRooms.get(auctionId).add(socketId);
      const participantCount = auctionRooms.get(auctionId).size;
      
      // Notify all room participants
      io.to(roomId).emit('auction:update', {
        auctionId,
        action: 'participant_joined',
        participantCount,
        timestamp: new Date().toISOString()
      });
      
      // Send acknowledgment
      if (typeof callback === 'function') {
        callback({
          success: true,
          auctionId,
          participantCount,
          socketId
        });
      }
    });
    
    // Handle leaving auction room
    socket.on('auction:leave', (auctionId, callback) => {
      const roomId = `auction:${auctionId}`;
      logger.info(`Client ${socketId} leaving auction: ${auctionId}`);
      
      socket.leave(roomId);
      
      // Update tracking
      const user = connectedUsers.get(socketId);
      if (user) {
        user.rooms = user.rooms.filter(r => r !== roomId);
      }
      
      if (auctionRooms.has(auctionId)) {
        auctionRooms.get(auctionId).delete(socketId);
        
        const participantCount = auctionRooms.get(auctionId).size;
        
        // Clean up empty rooms
        if (participantCount === 0) {
          auctionRooms.delete(auctionId);
          logger.debug(`Auction room ${auctionId} closed (no participants)`);
        } else {
          // Notify remaining participants
          io.to(roomId).emit('auction:update', {
            auctionId,
            action: 'participant_left',
            participantCount,
            timestamp: new Date().toISOString()
          });
        }
      }
      
      if (typeof callback === 'function') {
        callback({
          success: true,
          auctionId
        });
      }
    });
    
    // Handle bid placement
    socket.on('auction:bid', (data, callback) => {
      const { auctionId, amount, userId } = data;
      
      if (!auctionId || !amount || !userId) {
        logger.warn(`Invalid bid data from ${socketId}: ${JSON.stringify(data)}`);
        if (typeof callback === 'function') {
          callback({
            success: false,
            error: 'Invalid bid data'
          });
        }
        return;
      }
      
      logger.info(`New bid: ${auctionId}, $${amount} by user ${userId}`);
      
      // Broadcast bid to auction room
      const roomId = `auction:${auctionId}`;
      io.to(roomId).emit('auction:bid', {
        auctionId,
        amount,
        userId,
        bidder: socketId,
        timestamp: new Date().toISOString()
      });
      
      if (typeof callback === 'function') {
        callback({
          success: true,
          auctionId,
          amount,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // Handle disconnect
    socket.on('disconnect', (reason) => {
      logger.info(`Client disconnected: ${socketId} (${reason})`);
      
      // Get user's rooms before removing
      const user = connectedUsers.get(socketId);
      const userRooms = user ? [...user.rooms] : [];
      
      // Remove from tracking
      connectedUsers.delete(socketId);
      
      // Update room participation
      userRooms.forEach(roomId => {
        // Extract auction ID from room ID (format: "auction:123")
        const auctionId = roomId.split(':')[1];
        
        if (auctionRooms.has(auctionId)) {
          auctionRooms.get(auctionId).delete(socketId);
          const participantCount = auctionRooms.get(auctionId).size;
          
          if (participantCount === 0) {
            auctionRooms.delete(auctionId);
            logger.debug(`Auction room ${auctionId} closed (no participants)`);
          } else {
            // Notify remaining participants
            io.to(roomId).emit('auction:update', {
              auctionId,
              action: 'participant_left',
              participantCount,
              timestamp: new Date().toISOString()
            });
          }
        }
      });
    });
  });
  
  // Add helper methods for server management/stats
  io.getStats = () => {
    return {
      connections: {
        total: connectedUsers.size,
        clients: Array.from(connectedUsers.entries()).map(([id, data]) => ({
          id, 
          joinedAt: data.joinedAt,
          rooms: data.rooms
        }))
      },
      auctions: Array.from(auctionRooms.entries()).map(([auctionId, participants]) => ({
        id: auctionId,
        participants: Array.from(participants),
        count: participants.size
      })),
      server: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    };
  };
  
  logger.info('Socket.io server initialized');
  return io;
}

module.exports = { createSocketServer }; 