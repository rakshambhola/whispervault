# 🎭 WhisperVault - Anonymous Campus Confession & Chat App

A viral-worthy anonymous confession and chat platform built for college campuses. Share confessions, upvote/downvote, reply to posts, and chat with random strangers - all completely anonymous!

![WhisperVault](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Socket.io](https://img.shields.io/badge/Socket.io-4.8-green) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

## ✨ Features

### 📝 Anonymous Confessions
- **Post Anonymously**: Share your thoughts without revealing your identity
- **Upvote/Downvote System**: Community-driven content ranking
- **Reply System**: Engage in conversations on confessions
- **Trending Feed**: See what's hot on campus
- **Search Functionality**: Find confessions by keywords or tags
- **Tag System**: Categorize confessions with custom tags

### 💬 Live Anonymous Chat
- **Random Matching**: Connect with strangers from your campus
- **Real-time Messaging**: Powered by Socket.io
- **Typing Indicators**: See when someone is typing
- **Skip Feature**: Move to the next stranger anytime
- **Anonymous Names**: Auto-generated fun names like "SilentPanda42"

### 🛡️ Moderation & Safety
- **Report System**: Flag inappropriate content
- **Auto-moderation**: Content with multiple reports gets auto-hidden
- **Content Validation**: Character limits and basic profanity filtering
- **Community Guidelines**: Clear rules for respectful interaction

### 🎨 Premium Design
- **Glassmorphism UI**: Modern, translucent card designs
- **Dark Theme**: Easy on the eyes with vibrant purple/pink gradients
- **Smooth Animations**: Fade-ins, hover effects, and micro-interactions
- **Responsive Layout**: Works perfectly on mobile and desktop
- **Custom Scrollbars**: Styled to match the theme

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Real-time**: Socket.io
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **State Management**: React Hooks

## 📦 Installation

1. **Clone or navigate to the project**:
   ```bash
   cd whisper-vault
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Posting a Confession
1. Navigate to the **Feed** or **Trending** tab
2. Use the "Share Your Confession" card in the sidebar
3. Write your confession (max 500 characters)
4. Optionally add tags (max 5)
5. Click "Post Anonymously"

### Interacting with Confessions
- **Upvote/Downvote**: Click the arrows to vote
- **Reply**: Click the reply count to expand and add your reply
- **Report**: Click the flag icon to report inappropriate content
- **Search**: Use the search bar to find specific confessions

### Using Anonymous Chat
1. Click the **Chat** tab
2. Wait to be matched with a stranger
3. Start chatting anonymously
4. Click "Next" to skip to another stranger

## 🏗️ Project Structure

```
whisper-vault/
├── app/
│   ├── api/
│   │   ├── confessions/
│   │   │   ├── route.ts          # GET/POST confessions
│   │   │   └── reply/route.ts    # POST replies
│   │   ├── vote/route.ts         # POST votes
│   │   └── report/route.ts       # POST reports
│   ├── globals.css               # Global styles & design system
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── ConfessionCard.tsx        # Confession display component
│   ├── NewConfession.tsx         # Create confession form
│   └── Chat.tsx                  # Real-time chat component
├── lib/
│   ├── utils.ts                  # Utility functions
│   ├── confessionStore.ts        # In-memory confession storage
│   └── socket.ts                 # Socket.io utilities
├── types/
│   └── index.ts                  # TypeScript interfaces
├── server.ts                     # Custom server with Socket.io
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#8b5cf6) to Pink (#ec4899) gradient
- **Background**: Dark theme (#0f0f1e, #1a1a2e, #16213e)
- **Accent Colors**: 
  - Success: #10b981
  - Warning: #f59e0b
  - Danger: #ef4444
  - Info: #3b82f6

### Key Components
- **Glass Cards**: Translucent cards with backdrop blur
- **Gradient Buttons**: Purple-pink gradient with hover effects
- **Input Fields**: Glass-style inputs with focus states
- **Badges**: Colored tags for categorization

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for custom configuration:

```env
PORT=3000
NODE_ENV=development
```

### Production Deployment

For production, you can:
1. Replace in-memory storage with Redis
2. Add database for persistent confessions
3. Implement user authentication (optional)
4. Add rate limiting
5. Enhance moderation with AI

## 📱 Features Roadmap

- [ ] Redis integration for scalability
- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] Image upload support
- [ ] Reactions (emoji reactions)
- [ ] User profiles (optional anonymous profiles)
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] AI-powered content moderation
- [ ] Analytics dashboard

## 🤝 Contributing

This is a campus project, but feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this for your campus!

## 🎓 Perfect For

- College campuses
- University communities
- Student organizations
- Anonymous feedback platforms
- Campus social networks

## 🔒 Privacy & Safety

- No personal data is collected
- All interactions are anonymous
- IP addresses are not logged
- Messages are not permanently stored
- Report system for inappropriate content

## 💡 Tips for Going Viral

1. **Launch Strategy**: Start with a small group, let it grow organically
2. **Campus Events**: Promote during orientation or campus events
3. **Word of Mouth**: Encourage sharing through confessions
4. **Trending Content**: Highlight the best confessions daily
5. **Engagement**: Respond to confessions to keep the community active

---

**Made with ❤️ for campus communities**

For issues or questions, check the code or create an issue in the repository.
