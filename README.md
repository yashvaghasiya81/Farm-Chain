# Farm Chain

A comprehensive agricultural platform that connects farmers and users through a modern marketplace with real-time bidding capabilities.

## 🚀 Features

### Core Features
- Real-time communication using Socket.io
- Modern React-based frontend with TypeScript
- Node.js backend with Express
- Tailwind CSS for responsive design
- WebSocket support for live updates

### Platform Features

## 🚀 Key Features

### Farmer Features
- Profile & Product Management
- Inventory Tracking
- Bidding Management
- Sales Analytics

### User Features
- Product Browsing & Search
- Real-time Bidding
- Order Tracking
- Secure Payments

### Marketplace
- Live Auctions
- Product Categories
- Price Tracking
- Quality Assurance

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd Farm-Chain
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

## 🔧 Configuration

1. Backend Configuration:
   - Navigate to the `Backend` directory
   - Create a `.env` file with necessary environment variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     SOCKET_PORT=5001
     ```

2. Frontend Configuration:
   - Navigate to the `Frontend` directory
   - Create a `.env` file with necessary environment variables:
     ```
     VITE_API_URL=http://localhost:5000
     VITE_SOCKET_URL=http://localhost:5001
     ```

## 🚀 Running the Application

1. Start the Backend Server:
```bash
cd Backend
npm start
```

2. Start the Frontend Development Server:
```bash
cd Frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- WebSocket Server: `http://localhost:5001`

## 📁 Project Structure

```
Farm-Chain/
├── Backend/
│   ├── routes/         # API routes
│   │   ├── auth.js     # Authentication routes
│   │   ├── products.js # Product management
│   │   ├── bids.js     # Bidding system
│   │   └── users.js    # User management
│   ├── utils/          # Utility functions
│   ├── socket/         # WebSocket handlers
│   └── node_modules/
├── Frontend/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   │   ├── Farmer/ # Farmer dashboard
│   │   │   ├── User/   # User dashboard
│   │   │   └── Market/ # Marketplace
│   │   ├── services/   # API services
│   │   └── utils/      # Utility functions
│   ├── public/         # Static assets
│   └── node_modules/
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Socket.io Client
- Redux Toolkit (State Management)
- React Query (Data Fetching)

### Backend
- Node.js
- Express
- Socket.io
- TypeScript
- MongoDB (Database)
- JWT (Authentication)
- Redis (Caching)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## 🙏 Acknowledgments

### Project Contributors
- **Yash Vaghasiya** 
- **Milan Baladaniya** 
- **Meet Vaghasiya** 

### Special Thanks
- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for their invaluable tools and libraries 
