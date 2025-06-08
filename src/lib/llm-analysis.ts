import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface TestimonialAnalysis {
  isTestimonial: boolean;
  confidence: number; // 0-100
  sentimentScore: number; // -100 to 100
  sentimentCategory: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
  reasoning: string;
}

// Sanitize content before sending to LLM (remove sensitive data)
function sanitizeForLLM(content: string): string {
  return content
    // Remove email addresses
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
    // Remove phone numbers
    .replace(/[\+]?[1-9]?[\d\s\-\(\)]{10,}/g, '[PHONE]')
    // Limit length to avoid token limits
    .substring(0, 2000);
}

export async function analyzeTestimonial(
  senderName: string,
  senderEmail: string,
  message: string
): Promise<TestimonialAnalysis> {
  try {
    const sanitizedMessage = sanitizeForLLM(message);
    const sanitizedName = sanitizeForLLM(senderName);
    
    const prompt = `Analyze the following email content to determine:
1. Is this a genuine testimonial/feedback about a product or service? (not spam, sales pitch, or unrelated content)
2. What is the sentiment score from -100 (very negative) to 100 (very positive)?

Email from: ${sanitizedName}
Message: "${sanitizedMessage}"

Please respond with ONLY a JSON object in this exact format:
{
  "isTestimonial": boolean,
  "confidence": number (0-100),
  "sentimentScore": number (-100 to 100),
  "sentimentCategory": "very_negative" | "negative" | "neutral" | "positive" | "very_positive",
  "reasoning": "brief explanation"
}

Classification criteria:
- Testimonial: ANY genuine feedback about a service/product/experience (positive OR negative experiences)
- Not testimonial: Spam, sales pitches, unrelated content, automated messages, general questions
- Include negative reviews/complaints as testimonials if they describe actual experience with the product/service
- Sentiment: Consider overall tone, specific words, and emotional expression`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content analyst specializing in testimonial classification and sentiment analysis. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1, // Low temperature for consistent results
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const analysis: TestimonialAnalysis = JSON.parse(content);
    
    // Validate the response structure
    if (
      typeof analysis.isTestimonial !== 'boolean' ||
      typeof analysis.confidence !== 'number' ||
      typeof analysis.sentimentScore !== 'number' ||
      !analysis.sentimentCategory ||
      !analysis.reasoning
    ) {
      throw new Error('Invalid response structure from LLM');
    }

    // Clamp values to expected ranges
    analysis.confidence = Math.max(0, Math.min(100, analysis.confidence));
    analysis.sentimentScore = Math.max(-100, Math.min(100, analysis.sentimentScore));

    console.log(`LLM Analysis for ${senderEmail}:`, {
      isTestimonial: analysis.isTestimonial,
      confidence: analysis.confidence,
      sentiment: analysis.sentimentScore,
      category: analysis.sentimentCategory
    });

    return analysis;

  } catch (error) {
    console.error('Error in LLM analysis:', error);
    
    // Return fallback analysis in case of LLM failure
    return {
      isTestimonial: true, // Conservative fallback - let through for manual review
      confidence: 50, // Medium confidence since we couldn't analyze
      sentimentScore: 0, // Neutral sentiment
      sentimentCategory: 'neutral',
      reasoning: `LLM analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Configuration thresholds
export const ANALYSIS_THRESHOLDS = {
  MIN_TESTIMONIAL_CONFIDENCE: 70, // Only process if confidence > 70%
  MIN_SENTIMENT_SCORE: -100, // Allow all sentiments (changed from -20 to -100)
  MANUAL_REVIEW_CONFIDENCE: 60, // Flag for manual review if confidence < 60%
  VERY_NEGATIVE_THRESHOLD: -50, // Flag very negative testimonials for attention
}; 