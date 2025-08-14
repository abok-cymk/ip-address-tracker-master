# IP Address Tracker Setup Guide

This project uses the [IPify Geolocation API](https://geo.ipify.org/) to track IP addresses. Follow these steps to set up the project properly.

## 🔑 Getting Your API Key

### Step 1: Sign up for IPify
1. Go to [https://geo.ipify.org/](https://geo.ipify.org/)
2. Click "Get Started for Free"
3. Create an account with your email
4. **Important**: Do NOT enter any credit card details. Use only the free tier.

### Step 2: Get Your API Key
1. After signing up, you'll receive an API key that starts with `at_`
2. Copy this key - you'll need it for the next step

### Step 3: Configure Your Environment
1. In the project root, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your API key:
   ```
   VITE_IPIFY_API_KEY=at_your_actual_api_key_here
   ```

## 🚀 Running the Project

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🔄 Fallback Options

If you don't have an API key or encounter issues:

1. **Demo Mode**: The app will automatically use mock data for demonstration
2. **Fallback API**: For current IP detection, it uses a free alternative API
3. **Error Handling**: Graceful degradation with helpful error messages

## 🚨 Troubleshooting

### 403 Forbidden Error
- This means your API key is invalid or you're using the test key
- Get a proper API key from IPify (free tier available)
- Make sure your `.env` file is properly configured

### Rate Limiting
- Free tier allows 1,000 requests per month
- The app includes client-side rate limiting
- Requests are cached to minimize API calls

### Network Issues
- The app includes automatic retry logic
- Fallback to alternative APIs when possible
- Offline-friendly error messages

## 📊 Performance Optimizations

This project includes several performance optimizations:

- **Lazy Loading**: Map component is loaded only when needed
- **Caching**: API responses are cached for 5 minutes
- **Rate Limiting**: Client-side rate limiting to prevent API abuse
- **Code Splitting**: Vendor libraries are split into separate chunks
- **Image Optimization**: Background images are preloaded
- **Font Loading**: Optimized font loading with `font-display: swap`

## 🔒 Security

- API keys are never exposed in the client-side code
- Rate limiting prevents abuse
- Input validation for IP addresses and domains
- HTTPS-only API requests

## 📱 Browser Support

- Modern browsers (Chrome 88+, Firefox 85+, Safari 14+)
- Mobile responsive design
- Progressive enhancement approach

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.
