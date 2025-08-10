# Lost & Found - Reunite with Your Items

A web application to help people report and find lost items near them. Built with modern web technologies to provide a seamless experience for reuniting users with their lost belongings.

## Features

- Report lost items with detailed descriptions and location
- Browse found items in your area
- Interactive map integration for location-based search
- Modern, responsive UI built with shadcn/ui components
- Real-time updates and notifications

## Technologies Used

This project is built with:

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Maps**: Mapbox GL
- **Backend**: Node.js with Express
- **Database**: Supabase

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_REPOSITORY_URL>
cd reunite-lost-found-1
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Supabase and Mapbox API keys

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and API
└── theme/         # Theme configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
