# 📧 AI-Powered Testimonial Collection System

An intelligent testimonial collection system that automatically receives testimonials via email, filters them using AI, and displays only positive feedback on your website.

## ✨ Features

- **📬 Email Integration**: Receive testimonials directly via email using Postmark webhooks
- **🤖 AI-Powered Filtering**: OpenAI GPT-4o-mini automatically classifies content and analyzes sentiment
- **🎯 Smart Display**: Only positive testimonials (sentiment score ≥ 20) are shown to the public
- **🏷️ Automatic Tagging**: Testimonials are tagged as very positive, positive, neutral, negative, or very negative
- **🛡️ Spam Protection**: Automatically filters out spam, sales pitches, and non-testimonial content
- **⚡ Real-time Processing**: Instant analysis and storage of incoming testimonials
- **🔒 Secure**: Row-level security ensures only appropriate content is publicly visible

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Supabase account
- OpenAI API account
- Postmark account (or any email service with webhooks)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd postmark-challenge
npm install
```

### 2. Database Setup

1. Create a new project in [Supabase](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Copy and run the complete migration script from `src/lib/database-migration.sql`

### 3. Environment Variables

Create `.env.local` in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Optional: Node Environment
NODE_ENV=development
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your testimonial website.

### 5. Set Up Email Webhook

Configure your email service to send webhooks to:
```
https://your-domain.com/api/webhook
```

For Postmark:
1. Go to your Postmark server settings
2. Add a webhook for "Inbound"
3. Set the URL to your webhook endpoint
4. Set up email forwarding to your testimonial email address

## 🏗️ System Architecture

```
Email → Postmark → Webhook → AI Analysis → Database → Frontend Display
                     ↓
                LLM Classification:
                - Is it a testimonial?
                - Sentiment score (-100 to +100)
                - Automatic tagging
```

### How It Works

1. **Email Reception**: Customer sends testimonial to your designated email
2. **Webhook Trigger**: Postmark sends webhook data to your API endpoint
3. **AI Analysis**: OpenAI analyzes content for:
   - Testimonial classification (vs spam, questions, complaints)
   - Sentiment scoring (-100 to +100)
   - Content categorization
4. **Smart Filtering**: Only genuine testimonials with positive sentiment are saved
5. **Public Display**: Frontend shows only positive testimonials to visitors

## 📁 Project Structure

```
src/
├── app/
│   ├── api/webhook/          # Postmark webhook handler
│   ├── page.tsx              # Main testimonial page
│   └── layout.tsx            # App layout
├── components/
│   ├── TestimonialsGallery/  # Testimonial display component
│   ├── TestimonialCard/      # Individual testimonial card
│   ├── Header/               # Site header
│   ├── Hero/                 # Hero section
│   └── Footer/               # Site footer
├── lib/
│   ├── llm-analysis.ts       # OpenAI integration
│   ├── supabase.ts          # Supabase client (public)
│   ├── supabase-admin.ts    # Supabase admin client
│   └── database-migration.sql # Complete DB setup
└── utils/
    └── clipboard.ts          # Utility functions
```

## 🔧 Configuration

### AI Analysis Thresholds

Edit `src/lib/llm-analysis.ts` to adjust filtering sensitivity:

```typescript
export const ANALYSIS_THRESHOLDS = {
  MIN_TESTIMONIAL_CONFIDENCE: 70,    // Must be 70%+ confident it's a testimonial
  MIN_SENTIMENT_SCORE: -100,         // Allow all sentiments (set to -20 to filter negative)
  MANUAL_REVIEW_CONFIDENCE: 60,      // Flag for review if confidence < 60%
  VERY_NEGATIVE_THRESHOLD: -50,      // Flag very negative testimonials
};
```

### Frontend Display Filtering

The frontend automatically filters to show only positive testimonials:
- Sentiment score ≥ 20
- Excludes "negative" and "very_negative" categories
- Star ratings based on actual sentiment scores

## 💡 Customization

### Email Template

Users can customize the email template shown on your site in `src/components/Hero.tsx`.

### Styling

The project uses Tailwind CSS. Customize colors, fonts, and layouts in:
- `src/app/globals.css` - Global styles
- Component files - Component-specific styling

### AI Prompts

Modify the AI analysis prompts in `src/lib/llm-analysis.ts` to better match your specific use case.

## 📊 Database Schema

The testimonials table includes:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | VARCHAR | Sender name |
| `email` | VARCHAR | Sender email |
| `message` | TEXT | Testimonial content |
| `sentiment_score` | INTEGER | AI sentiment score (-100 to 100) |
| `sentiment_category` | TEXT | Categorized sentiment |
| `is_testimonial_confidence` | DECIMAL | AI confidence (0-100) |
| `llm_processed_at` | TIMESTAMP | When AI analysis completed |
| `manual_review_needed` | BOOLEAN | Flagged for review |
| `is_featured` | BOOLEAN | Admin featured flag |
| `is_hidden` | BOOLEAN | Admin hidden flag |

## 🔐 Security Features

- **Row Level Security**: Database policies ensure only positive testimonials are publicly visible
- **Input Sanitization**: All content is sanitized before storage and AI processing
- **Rate Limiting**: Prevents spam through duplicate detection
- **Content Validation**: Email format and content length validation
- **Safe AI Processing**: Removes sensitive data before sending to OpenAI

## 💰 Cost Estimation

- **OpenAI API**: ~$0.0001-0.0003 per testimonial analysis
- **Supabase**: Free tier supports most small to medium websites
- **Hosting**: Deploy free on Vercel
- **Total**: ~$10-50/month for most use cases

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

The app works on any platform supporting Next.js:
- Netlify
- Railway
- AWS
- DigitalOcean App Platform

## 🤝 Contributing

This is an open-source project! Common practices for open-source projects:

1. **Database Migrations**: Include complete schema setup
2. **Environment Templates**: Provide example environment files
3. **Documentation**: Comprehensive README and inline comments
4. **Type Safety**: Full TypeScript implementation
5. **Error Handling**: Graceful failure handling
6. **Security**: Built-in security best practices

## 📄 License

MIT License - feel free to use this for your own projects!

## 🆘 Support

- Check the database migration file for complete setup
- Review environment variable requirements
- Ensure AI API keys are properly configured
- Test with sample emails before going live

---

**Made with ❤️ using Next.js, Supabase, and OpenAI**
