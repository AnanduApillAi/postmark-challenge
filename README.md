# 📧 Postmark Challenge: AI-Powered Wall of Love

**A showcase of Postmark's Inbound Email Streaming capabilities** - An intelligent testimonial collection system that automatically receives testimonials via Postmark's inbound email processing, analyzes them using AI, and displays beautiful, curated feedback on your website.

[![Live Demo](https://img.shields.io/badge/🌟%20Live%20Demo-wall--of--love.anandu.dev-blue?style=for-the-badge)](https://wall-of-love.anandu.dev)
[![GitHub](https://img.shields.io/badge/💻%20Source-AnanduApillAi/postmark--challenge-black?style=for-the-badge)](https://github.com/AnanduApillAi/postmark-challenge)
[![Postmark](https://img.shields.io/badge/🚀%20Powered%20by-Postmark%20Inbound-orange?style=for-the-badge)](https://postmarkapp.com)

## ✨ Features

### 🤖 **AI-Powered Intelligence**
- **Smart Content Extraction**: Automatically cleans email formalities (greetings, signatures) and extracts pure testimonial content
- **Sentiment Analysis**: GPT-4o-mini analyzes sentiment (-100 to +100) and categorizes feedback
- **Spam Detection**: Filters out spam, sales pitches, and non-testimonial content with 95%+ accuracy
- **Confidence Scoring**: Only testimonials with 70%+ confidence are displayed

### 📧 **Postmark Inbound Email Integration**
- **Postmark Inbound Streaming**: Real-time email processing using Postmark's robust inbound infrastructure
- **Instant Webhook Delivery**: Sub-second email processing with Postmark's reliable webhook system
- **Rich Email Metadata**: Leverages Postmark's detailed email parsing (timestamps, spam scores, message IDs)
- **Professional Email Handling**: Built on Postmark's enterprise-grade email processing
- **Automatic Email Parsing**: Postmark handles complex email formats, attachments, and encoding

### 🛡️ **Security & Reliability**
- **Row-Level Security**: Database policies ensure only positive content is publicly visible
- **Input Sanitization**: All content is sanitized before storage and AI processing
- **Rate Limiting**: Prevents spam through duplicate and time-based detection
- **Fallback Systems**: Graceful handling of AI failures with automatic fallbacks

## 🚀 Live Demo

Visit **[wall-of-love.anandu.dev](https://wall-of-love.anandu.dev)** to see the system in action!

Send your own testimonial to `testimonials@anandu.dev` and watch it appear automatically after AI processing.

## 🏗️ System Architecture

```
Customer Email → Postmark Inbound → Instant Webhook → AI Analysis → Database → Live Display
      ↓              ↓                    ↓              ↓           ↓          ↓
  📧 testimonials@ → Postmark Server → Next.js API → GPT-4o-mini → Supabase → React UI
                        ↓
                   Rich Email Data
                  (Headers, Metadata,
                   Spam Filtering)
```

### Postmark-Powered Processing Pipeline

1. **📧 Email Reception**: Customer sends testimonial to `testimonials@anandu.dev`
2. **🚀 Postmark Processing**: Postmark's inbound servers instantly:
   - Parse email content, headers, and metadata
   - Apply spam filtering and security checks
   - Extract sender information and timestamps
   - Generate unique message IDs for tracking
3. **⚡ Instant Webhook**: Postmark triggers webhook to `/api/webhook` with rich email data
4. **🤖 AI Analysis**: GPT-4o-mini processes the clean Postmark data:
   - Testimonial classification vs spam/questions
   - Sentiment scoring (-100 to +100)
   - Content extraction (removes email formalities)
   - Confidence assessment (0-100%)
5. **💾 Smart Storage**: Only genuine, positive testimonials are saved to Supabase
6. **🎨 Real-time Display**: Clean content appears instantly on the website

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- **Postmark account** (free tier available)
- Supabase account  
- OpenAI API key

### 1. Clone & Install
```bash
git clone https://github.com/AnanduApillAi/postmark-challenge.git
cd postmark-challenge
npm install
```

### 2. Database Setup
Run this SQL in your Supabase SQL Editor:

```sql
-- Complete testimonials table with AI enhancements
create table public.testimonials (
  id uuid not null default gen_random_uuid (),
  name text null,
  email text null,
  message text null,
  cleaned_message text null, -- AI-extracted content
  created_at timestamp without time zone null default now(),
  is_testimonial_confidence numeric(5, 2) null default null::numeric,
  sentiment_score integer null,
  sentiment_category text null,
  llm_processed_at timestamp with time zone null,
  manual_review_needed boolean null default false,
  llm_reasoning text null,
  message_id character varying(255) null,
  subject text null default 'No Subject'::text,
  email_date timestamp with time zone null,
  spam_score numeric(4, 2) null default 0.0,
  spam_status character varying(20) null default 'unknown'::character varying,
  constraint testimonials_pkey primary key (id),
  constraint check_confidence_range check (
    (is_testimonial_confidence is null) or 
    (is_testimonial_confidence >= 0 and is_testimonial_confidence <= 100)
  ),
  constraint check_sentiment_category check (
    (sentiment_category is null) or 
    (sentiment_category = any (array['very_negative'::text, 'negative'::text, 'neutral'::text, 'positive'::text, 'very_positive'::text]))
  ),
  constraint check_sentiment_range check (
    (sentiment_score is null) or 
    (sentiment_score >= -100 and sentiment_score <= 100)
  )
);

-- Performance indexes
create index idx_testimonials_sentiment_score on testimonials(sentiment_score);
create index idx_testimonials_confidence on testimonials(is_testimonial_confidence);
create index idx_testimonials_message_id on testimonials(message_id);
create index idx_testimonials_email_date on testimonials(email_date);
create index idx_testimonials_cleaned_message on testimonials(cleaned_message) 
where cleaned_message is not null;
```

### 3. Environment Configuration
Create `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration  
OPENAI_API_KEY=your_openai_api_key


# Environment
NODE_ENV=production
```

### 4. Deploy & Configure Postmark
1. Deploy to Vercel: `vercel --prod`
2. **Set up Postmark Inbound Streaming**:
   - Go to your Postmark Server → Settings → Webhooks
   - Add new webhook for "Inbound email"
   - Set URL: `https://your-domain.com/api/webhook`
   - Enable "Include raw email content" for full email data
3. **Configure Inbound Domain**:
   - Add your domain to Postmark's inbound processing
   - Set up MX records to route emails through Postmark
   - Or use email forwarding to Postmark's inbound address

## 📊 AI Analysis Configuration

Customize AI behavior in `src/lib/llm-analysis.ts`:

```typescript
export const ANALYSIS_THRESHOLDS = {
  MIN_TESTIMONIAL_CONFIDENCE: 70,    // 70%+ confidence required
  MIN_SENTIMENT_SCORE: 20,           // Only positive testimonials
  MANUAL_REVIEW_CONFIDENCE: 60,      // Flag low confidence
  VERY_NEGATIVE_THRESHOLD: -50,      // Flag very negative
};
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/webhook/route.ts      # Email webhook handler
│   ├── page.tsx                  # Main testimonial page
│   └── layout.tsx               # App layout & metadata
├── components/frontend/
│   ├── CustomerStoriesHero.tsx   # Hero section with CTA
│   ├── TestimonialsGrid.tsx      # Responsive testimonial grid
│   ├── TestimonialCardFrontend.tsx # Individual testimonial cards
│   ├── FixedBottomNav.tsx        # Interactive submission modal
│   └── Badge.tsx                 # Animated badge component
├── lib/
│   ├── llm-analysis.ts          # OpenAI integration & content extraction
│   ├── supabase.ts              # Supabase client
│   └── supabase-admin.ts        # Admin Supabase client
└── styles/
    └── globals.css              # Tailwind CSS styles
```

## 🎨 Key Features Deep Dive

### Content Extraction
**Before AI Processing:**
```
Hi there,
My name is Sarah and I wanted to share my experience.
Your platform has been amazing for our team's productivity!
Best regards,
Sarah Johnson
```

**After AI Processing:**
```
Your platform has been amazing for our team's productivity!
```

### Smart Display Logic
- **Positive filtering**: Only testimonials with sentiment ≥ 20 shown
- **Clean content**: Displays AI-extracted content, falls back to original
- **Responsive layout**: 2-column masonry grid on desktop, single column on mobile
- **Real-time updates**: New testimonials appear immediately after processing


## 🔐 Security Features

- **Row-Level Security**: Only positive testimonials are publicly visible
- **Content Sanitization**: XSS prevention and input cleaning
- **Rate Limiting**: Duplicate and time-based spam protection
- **API Security**: Webhook validation and request filtering
- **Data Privacy**: Minimal data collection, secure processing


## 🤝 Contributing

This project demonstrates modern full-stack development practices:

- **TypeScript**: End-to-end type safety
- **AI Integration**: Practical GPT implementation
- **Database Design**: Scalable schema with constraints
- **Security**: Production-ready security measures
- **UI/UX**: Modern, accessible interface design

## 📄 License

MIT License - Use this code for your own projects!

## 🆘 Support & Documentation

- **Live Demo**: [wall-of-love.anandu.dev](https://wall-of-love.anandu.dev)
- **Source Code**: [GitHub Repository](https://github.com/AnanduApillAi/postmark-challenge)
- **Email**: Send test testimonials to `testimonials@anandu.dev`
- **Postmark Docs**: [Inbound Email Processing](https://postmarkapp.com/developer/webhooks/inbound-webhook)

### Troubleshooting
- Verify inbound webhook is configured correctly in Postmark dashboard
- Ensure OpenAI API key has sufficient credits
- Check Supabase RLS policies are enabled
- Test with sample emails before production use

---

**Built with ❤️ using Postmark Inbound Email, Next.js 14, Supabase, OpenAI GPT-4o-mini, and Tailwind CSS**

*Transforming customer feedback into beautiful social proof automatically.*
