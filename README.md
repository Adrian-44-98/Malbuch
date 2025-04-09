# MeinMalbuch - Personalized Coloring Book Creator

Transform your photos into beautiful coloring book pages and create your own personalized coloring book.

## Features

- Upload multiple photos
- Automatic transformation into coloring book style
- Customizable book size (A4/A5)
- Multiple cover design options
- Dynamic page count calculation
- Drag and drop interface
- Real-time preview

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- OpenAI API (for image transformation)
- Canvas API (for client-side image processing)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/meinmalbuch.git
cd meinmalbuch
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
meinmalbuch/
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   └── page.tsx       # Home page
├── components/        # React components
├── public/           # Static assets
└── styles/           # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update the following environment variables in `.env.local`:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

3. Never commit your `.env.local` file to version control. It's already included in `.gitignore`. 