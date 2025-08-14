# IP Address Tracker

![Design preview for the IP address tracker coding challenge](preview.jpg)

A high-performance IP address tracker built with React, TypeScript, and modern web technologies. Track any IP address or domain to get detailed location information displayed on an interactive map.

## 🚀 Features

- **Real-time IP tracking** - Search for any IP address or domain
- **Interactive map** - View location on Leaflet-powered map
- **Responsive design** - Optimized for mobile and desktop
- **High performance** - Lighthouse score optimized
- **Rate limiting** - Built-in API rate limiting protection
- **Caching** - Smart caching for improved performance
- **Error handling** - Comprehensive error boundaries
- **Accessibility** - WCAG 2.1 compliant

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **TanStack Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **React Hook Form** - Efficient form handling
- **Leaflet** - Interactive maps
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool

## 📊 Performance Optimizations

- Lazy loading for map components
- Image preloading for critical resources
- Chunk splitting for optimal caching
- Resource hints (preconnect, dns-prefetch)
- Font display optimization
- Code splitting with dynamic imports

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- IPify API key (free at [geo.ipify.org](https://geo.ipify.org/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ip-address-tracker
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your IPify API key to `.env`:
   ```
   VITE_IPIFY_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Build for production**
   ```bash
   pnpm build
   ```

## 🎯 Usage

1. **Automatic IP detection** - Your current IP is detected on page load
2. **Manual search** - Enter any IP address or domain in the search field
3. **View details** - See IP address, location, timezone, and ISP information
4. **Interactive map** - Click and explore the location on the map

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── SearchForm.tsx   # Search input with validation
│   ├── IPInfoDisplay.tsx # Information cards display
│   ├── IPMap.tsx        # Leaflet map component
│   └── ErrorBoundary.tsx # Error handling
├── hooks/               # Custom React hooks
│   └── useIPTracker.ts  # IP tracking logic
├── services/            # API services
│   └── ipTracker.ts     # IPify API integration
├── stores/              # Zustand stores
│   └── ipTracker.ts     # Global state management
├── utils/               # Utility functions
│   └── performance.ts   # Performance monitoring
└── App.tsx              # Main application component
```

## 🔧 Configuration

### API Configuration
The app uses the IPify Geolocation API. Configure in `src/services/ipTracker.ts`:

- Rate limiting: 10 requests per minute
- Cache TTL: 5 minutes
- Request timeout: 10 seconds

### Performance Configuration
Performance monitoring can be configured in `src/utils/performance.ts`:

- Core Web Vitals logging
- Custom performance markers
- Analytics integration ready

## 🎨 Design System

The project follows the Frontend Mentor design specifications:

- **Colors**: Gray 950 (#2B2B2B), Gray 400 (#969696)
- **Typography**: Rubik font family (400, 500, 700 weights)
- **Layout**: Mobile-first responsive design
- **Breakpoints**: 375px (mobile), 1440px (desktop)

## 🚀 Deployment

### Vercel (Recommended)
```bash
pnpm build
# Deploy dist/ folder to Vercel
```

### Netlify
```bash
pnpm build
# Deploy dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
EXPOSE 4173
CMD ["pnpm", "preview"]
```

## 🧪 Testing

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Build and test production bundle
pnpm build && pnpm preview
```

## 📈 Performance Metrics

Target Lighthouse scores:
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Frontend Mentor](https://www.frontendmentor.io) for the design challenge
- [IPify](https://www.ipify.org/) for the IP geolocation API
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles
- [Leaflet](https://leafletjs.com/) for the mapping library

## 📞 Support

If you have any questions or issues, please [open an issue](https://github.com/your-username/ip-address-tracker/issues) on GitHub.
