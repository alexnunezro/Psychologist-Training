# Psychologist Training Application

A Next.js application for training psychologists with AI-powered patient simulations.

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- OpenAI API key
- ChromaDB (for knowledge base)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Option 1: Deploy to Vercel (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Vercel
3. Add the following environment variables in Vercel:
   - `OPENAI_API_KEY`
4. Deploy!

### Option 2: Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

Or use the deployment script:
```bash
./scripts/deploy.sh
```

## Features

- AI-powered patient simulations
- Multi-language support (English and Spanish)
- Patient profile management
- Knowledge base integration
- Responsive design
- Dark mode support

## License

MIT 