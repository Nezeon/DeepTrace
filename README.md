# 🔍 DeepTrace - Advanced Digital Forensic Investigation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

> A cutting-edge digital forensic investigation platform with AI-powered analysis, interactive network visualization, and comprehensive case management capabilities.

## 🌟 Features

### 🎯 **Core Capabilities**

- **Case Management**: Comprehensive forensic case tracking and organization
- **AI-Powered Chat**: RAG-integrated forensic assistant for evidence analysis
- **Network Visualization**: Interactive linkage charts showing communication patterns
- **Entity Extraction**: Automatic detection of emails, phones, crypto addresses, and more
- **Real-time Collaboration**: Multi-threaded chat system for team investigations

### 🚀 **Advanced Features**

- **Interactive Linkage Analysis**: Beautiful network graphs showing relationships between contacts, communications, and transactions
- **RAG Integration**: AI assistant powered by retrieval-augmented generation for intelligent evidence analysis
- **Premium UI/UX**: Million-dollar design with glass morphism, animations, and smooth transitions
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Real-time Updates**: Live chat and case updates with WebSocket support

### 🔧 **Technical Highlights**

- **Full-Stack Architecture**: React frontend with Express.js backend
- **Database Integration**: MongoDB with Mongoose for robust data persistence
- **Type Safety**: Complete TypeScript implementation across frontend and backend
- **Modern Tooling**: Vite, Tailwind CSS, Framer Motion, and Radix UI components
- **API-First Design**: RESTful APIs with comprehensive error handling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Nezeon/DeepTrace.git
   cd DeepTrace
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   MONGODB_URI=mongodb://localhost:27017/forensiq
   PORT=5000
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**

   ```bash
   # Start both frontend and backend
   pnpm dev

   # Or start individually
   pnpm dev:client    # Frontend only
   pnpm dev:server    # Backend only
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## 🏗️ Architecture

```
ForensiQ/
├── client/                 # React SPA Frontend
│   ├── components/         # Reusable UI components
│   │   ├── case/          # Case-specific components
│   │   ├── charts/        # Interactive visualizations
│   │   ├── layout/        # Layout components
│   │   └── ui/            # Base UI components
│   ├── pages/             # Route components
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── server/                # Express.js Backend
│   ├── routes/            # API route handlers
│   ├── controllers/       # Business logic
│   ├── models/            # Database schemas
│   └── config/            # Configuration files
├── shared/                # Shared types and interfaces
└── tests/                 # E2E and unit tests
```

## 📊 Interactive Features

### 🔗 **Network Linkage Visualization**

- **Dynamic Network Charts**: Interactive graphs showing relationships between contacts, communications, and financial transactions
- **Multi-layered Analysis**: Separate views for chats, calls, and transactions
- **Real-time Filtering**: Filter by communication type, time range, or entity type
- **Hover Interactions**: Detailed information on hover with smooth animations
- **Export Capabilities**: Generate reports in multiple formats

### 🤖 **AI Forensic Assistant**

- **RAG-Powered Analysis**: Intelligent responses based on case evidence
- **Entity Recognition**: Automatic extraction of emails, phone numbers, crypto addresses
- **Context-Aware Responses**: Maintains conversation context across sessions
- **Evidence Correlation**: Links related pieces of evidence automatically

### 💬 **Advanced Chat System**

- **Thread-based Conversations**: Organized chat threads for different investigation aspects
- **Real-time Messaging**: Instant message delivery and updates
- **Message Persistence**: All conversations saved with timestamps and metadata
- **Rich Media Support**: Support for file attachments and evidence links

## 🛠️ API Documentation

### Chat Endpoints

```typescript
POST /api/chats/case          # Create new chat message
GET  /api/chats/case/:caseId  # Get all chats for a case
GET  /api/chats/:userId       # Get all chats for a user
DELETE /api/chats/:id         # Delete specific chat
```

### Health & Status

```typescript
GET /api/health              # Server health check
```

## 🧪 Testing

### Run Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e:chat

# Type checking
pnpm typecheck
```

### Test Coverage

- **Frontend**: Component testing with Vitest
- **Backend**: API endpoint testing
- **E2E**: Full user journey testing
- **Integration**: Database and external service testing

## 🎨 Design System

### **Premium UI Components**

- **Glass Morphism**: Modern glass effects with backdrop blur
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Dark/Light Themes**: Automatic theme switching
- **Accessibility**: WCAG 2.1 compliant components

### **Color Palette**

- **Primary**: Professional blue tones
- **Brand**: Accent colors for highlights
- **Semantic**: Success, warning, error states
- **Neutral**: Grayscale for text and backgrounds

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: Optimized with code splitting
- **Database**: Indexed queries for fast retrieval
- **Caching**: Intelligent caching strategies
- **CDN Ready**: Optimized for global deployment

## 🔒 Security

- **Input Validation**: Comprehensive data sanitization
- **CORS Protection**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data protection
- **Error Handling**: Secure error responses without data leakage
- **Rate Limiting**: API protection against abuse

## 🚀 Deployment

### **Production Build**

```bash
pnpm build
pnpm start
```

### **Docker Support**

```bash
docker build -t forensiq .
docker run -p 5000:5000 forensiq
```

### **Cloud Deployment**

- **Vercel**: Frontend deployment
- **Railway**: Backend deployment
- **MongoDB Atlas**: Database hosting
- **Netlify**: Alternative frontend hosting

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### **Code Standards**

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing frontend framework
- **Express.js**: For the robust backend framework
- **MongoDB**: For the flexible database solution
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For the smooth animations
- **Radix UI**: For the accessible component primitives

## 📞 Support

- **Documentation**: [Wiki](https://github.com/Nezeon/DeepTrace/wiki)
- **Issues**: [GitHub Issues](https://github.com/Nezeon/DeepTrace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Nezeon/DeepTrace/discussions)
- **Email**: support@forensiq.com

---

<div align="center">

**Built with ❤️ for the digital forensics community**

[⭐ Star this repo](https://github.com/Nezeon/DeepTrace) • [🐛 Report Bug](https://github.com/Nezeon/DeepTrace/issues) • [💡 Request Feature](https://github.com/Nezeon/DeepTrace/issues)

</div>
