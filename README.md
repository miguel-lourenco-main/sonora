# 🎙️ Sonora - Interactive AI Audiobook Platform

> **Innovative Interactive Storytelling** | AI-powered voice narration for personalized audio experiences

## 🔗 **Live Demo**

[Sonora](https://sonora-d09e63.gitlab.io)

[![Next.js](https://img.shields.io/badge/Next.js-Framework-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-Library-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Language-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🚀 Project Overview

**Sonora** is an innovative interactive audiobook platform developed during my time at [Edgen](https://edgen.co/), exploring partnerships in the toy industry. The application enables users to generate immersive stories with AI-powered voice narration, creating personalized audio experiences for children and families.

### Key Achievements

- 🎯 **Interactive Storytelling**: Dynamic branching narratives with user choices
- 🤖 **AI Voice Technology**: Advanced text-to-speech with ElevenLabs integration
- 🎨 **Modern UX**: 3D card interactions with Framer Motion animations
- ⚡ **Real-time Audio**: Progressive audio loading and synchronization


---

## 📱 Application Features

### Interactive Story Generation

- **Dynamic Storytelling**: Interactive stories with branching narratives and user choices
- **Multiple Story Formats**: 10+ pre-built stories including fantasy, sci-fi, and educational content
- **Real-time Story Progression**: Seamless navigation through story nodes with choice-based outcomes
- **Story Catalog**: Visual grid of categorized stories with 3D card interactions

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


---

## 🛠️ Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format code
pnpm format

# Generate audio (custom script)
pnpm generate-audio
```


---

## 🔧 Configuration

### Environment Setup

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Database Setup

```bash
# Start Supabase locally
npx supabase start

# Apply migrations
npx supabase db reset

# Generate types
npx supabase gen types typescript --local > lib/database.types.ts

```


---

## 🤖 Automated Code Documentation

This project uses an automated code documentation workflow powered by **n8n**:

### Overview

An n8n workflow runs on an Azure VM that automatically analyzes code changes on every push to the repository. The workflow:

- **Triggers on Push**: Automatically runs when code is pushed to the repository
- **Code Analysis**: Scans the codebase for uncommented code sections
- **Comment Generation**: Automatically generates helpful comments based on the code logic
- **Azure VM Deployment**: Runs reliably on a dedicated Azure virtual machine

### Benefits

- 📝 **Consistent Documentation**: Ensures code remains well-documented without manual effort
- 🔄 **Automated Process**: No need to remember to add comments manually
- 🎯 **Quality Assurance**: Helps maintain code quality standards across the project
- ⚡ **Zero Overhead**: Runs in the background without impacting development workflow

This automation helps maintain high code quality and documentation standards throughout the project lifecycle.


---

## 🤝 **Contributing**

This is a personal portfolio project, but suggestions and feedback are welcome!


---

## 📄 **License**

This project is for portfolio purposes. All rights reserved.


---

**Contact**: [LinkedIn](https://www.linkedin.com/in/miguel-louren%C3%A7o-395335355/) | [GitLab](https://gitlab.com/miguel-lourenco-main) | [Email](mailto:migasoulou@gmail.com)

**Built with ❤️ by Miguel Lourenço**
