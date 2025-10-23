# Sonora - Interactive AI Audiobook Platform

## 🎯 Project Overview

**Sonora** is an innovative interactive audiobook platform developed during my time at Edgen, exploring partnerships in the toy industry. The application enables users to generate immersive stories with AI-powered voice narration, creating personalized audio experiences for children and families.

## 🚀 **Live Demo**

**Website**: [Sonora](https://sonora-d09e63.gitlab.io)

## 🚀 Key Features

### Interactive Story Generation
- **Dynamic Storytelling**: Interactive stories with branching narratives and user choices
- **Multiple Story Formats**: 10+ pre-built stories including fantasy, sci-fi, and educational content
- **Real-time Story Progression**: Seamless navigation through story nodes with choice-based outcomes

### AI Voice Technology
- **ElevenLabs Integration**: Advanced text-to-speech with custom voice generation
- **Voice Management**: Create, customize, and manage multiple AI voices
- **Audio Generation**: Automated speech synthesis for story narration
- **Voice Cloning**: Upload audio samples to create personalized voices

### Advanced Audio Features
- **Pre-recorded Audio Support**: High-quality audio for enhanced user experience
- **Audio Timing Synchronization**: Precise word-level timing for subtitle generation
- **Audio Availability Detection**: Smart detection of available audio content
- **Progressive Audio Loading**: Optimized audio streaming and caching

### User Experience
- **Responsive Design**: Mobile-first design with 3D card interactions
- **Dark/Light Mode**: Adaptive theming for optimal viewing
- **Internationalization**: Multi-language support with i18n framework
- **Accessibility**: Screen reader support and keyboard navigation

## 🛠 Technical Architecture

### Frontend Stack
- **Next.js 15**: React framework with App Router and Server Components
- **TypeScript**: Full type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first styling with custom design system
- **Framer Motion**: Advanced animations and 3D interactions
- **React Query**: Efficient data fetching and state management

### Backend & APIs
- **ElevenLabs API**: AI voice generation and text-to-speech
- **OpenAI Integration**: Story content generation and processing
- **Supabase**: Database and authentication services
- **Node.js Scripts**: Audio processing and content generation

### Development Tools
- **ESLint & Prettier**: Code quality and formatting
- **TypeScript**: Static type checking
- **PNPM**: Fast package management
- **Git**: Version control with structured workflow

## 📊 Project Impact & Results

### Development Timeline
- **Day 1-2**: Initial development and core functionality
- **Day 3**: UI improvements based on user feedback
- **Day 4+**: Production-ready application for continued use

### User Feedback Integration
- **Rapid Iteration**: Implemented user suggestions within hours
- **UI/UX Optimization**: Enhanced interface based on real user testing
- **Performance Improvements**: Optimized audio loading and story navigation

### Technical Achievements
- **Complex State Management**: Implemented sophisticated story player with choice tracking
- **Audio Processing**: Built automated audio generation pipeline
- **Performance Optimization**: Achieved smooth 3D animations and audio playback
- **Scalable Architecture**: Designed for easy content addition and voice management

## 🎨 User Interface Highlights

### Story Selection
- **3D Interactive Cards**: Engaging visual presentation of available stories
- **Story Metadata**: Duration estimates, step counts, and audio availability
- **Responsive Grid**: Adaptive layout for different screen sizes

### Story Player
- **Immersive Experience**: Full-screen story navigation with audio controls
- **Choice Interface**: Intuitive decision-making with visual feedback
- **Progress Tracking**: Real-time story progression and timing

### Voice Management
- **Voice Library**: Comprehensive voice browsing and management
- **Custom Voice Creation**: Upload and train personal AI voices
- **Voice Preview**: Test voices before story generation

## 🔧 Technical Implementation

### Story Engine
```typescript
// Complex story state management with choice tracking
export function useStoryPlayer({ initialNodeId, nodes }: UseStoryPlayerProps) {
  const [currentNode, setCurrentNode] = useState<ContentNode>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  // ... sophisticated audio and choice management
}
```

### Audio Processing
- **Automated Generation**: Scripts for bulk audio creation
- **Timing Synchronization**: Precise subtitle generation
- **Quality Control**: Audio validation and optimization

### Voice Integration
```typescript
// ElevenLabs API integration with error handling
export async function createVoice(params: { 
  name: string; 
  description?: string; 
  files: File[]; 
}): Promise<ElevenLabsVoice> {
  // ... robust API integration with comprehensive error handling
}
```

## 📈 Business Value

### Market Potential
- **Toy Industry Partnership**: Strategic collaboration with toy industry connections
- **Educational Applications**: Interactive learning through storytelling
- **Entertainment Value**: Engaging content for children and families

### Technical Innovation
- **AI Integration**: Cutting-edge voice generation technology
- **Interactive Media**: Next-generation storytelling platform
- **Scalable Solution**: Architecture supporting rapid content expansion

## 🎯 Skills Demonstrated

### Frontend Development
- **React/Next.js**: Advanced component architecture and state management
- **TypeScript**: Complex type definitions and API integrations
- **UI/UX Design**: Responsive design with accessibility considerations
- **Performance Optimization**: Efficient rendering and audio handling

### Backend Integration
- **API Development**: RESTful services with comprehensive error handling
- **Audio Processing**: Node.js scripts for content generation
- **Database Design**: Structured data models for stories and voices
- **Authentication**: Secure user management with Supabase

### DevOps & Tools
- **Version Control**: Git workflow with feature branches
- **Package Management**: PNPM for efficient dependency management
- **Code Quality**: ESLint, Prettier, and TypeScript for maintainable code
- **Build Optimization**: Next.js production builds and static generation

## 🚀 Future Enhancements

### Planned Features
- **Multi-language Support**: Expanded internationalization
- **Advanced Analytics**: User engagement and story completion tracking
- **Content Management**: Admin interface for story creation
- **Mobile App**: Native mobile application development

### Technical Roadmap
- **Performance Optimization**: Advanced caching and CDN integration
- **AI Improvements**: Enhanced voice quality and customization
- **Scalability**: Microservices architecture for enterprise deployment

## 📞 Contact & Portfolio

This project demonstrates expertise in:
- **Full-stack development** with modern React/Next.js
- **AI integration** and voice technology
- **Complex state management** and user experience design
- **Rapid prototyping** and user feedback integration
- **Production deployment** and performance optimization

---

*Developed during partnership exploration at Edgen, showcasing rapid development capabilities and user-centric design approach.*
