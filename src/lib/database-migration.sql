-- ====================================================================
-- Postmark Testimonial System - Complete Database Setup
-- ====================================================================
-- This file contains the complete database schema for the 
-- Postmark Testimonial System with LLM filtering.
--
-- Run this in your Supabase SQL Editor to set up the complete database
-- ====================================================================

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if you need to recreate (CAUTION: This will delete all data)
-- DROP TABLE IF EXISTS testimonials CASCADE;

-- Create testimonials table with complete schema
CREATE TABLE IF NOT EXISTS testimonials (
    -- Primary key and metadata
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Original email data
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- LLM Analysis fields
    is_testimonial_confidence DECIMAL(5,2) DEFAULT NULL,
    sentiment_score INTEGER DEFAULT NULL,
    sentiment_category TEXT DEFAULT NULL,
    llm_processed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    manual_review_needed BOOLEAN DEFAULT FALSE,
    llm_reasoning TEXT DEFAULT NULL,
    
    -- Administrative fields
    is_featured BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    admin_notes TEXT DEFAULT NULL
);

-- Add data validation constraints
ALTER TABLE testimonials 
ADD CONSTRAINT IF NOT EXISTS check_confidence_range 
CHECK (is_testimonial_confidence IS NULL OR (is_testimonial_confidence >= 0 AND is_testimonial_confidence <= 100));

ALTER TABLE testimonials 
ADD CONSTRAINT IF NOT EXISTS check_sentiment_range 
CHECK (sentiment_score IS NULL OR (sentiment_score >= -100 AND sentiment_score <= 100));

ALTER TABLE testimonials 
ADD CONSTRAINT IF NOT EXISTS check_sentiment_category 
CHECK (sentiment_category IS NULL OR sentiment_category IN ('very_negative', 'negative', 'neutral', 'positive', 'very_positive'));

ALTER TABLE testimonials 
ADD CONSTRAINT IF NOT EXISTS check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_sentiment_score ON testimonials(sentiment_score);
CREATE INDEX IF NOT EXISTS idx_testimonials_sentiment_category ON testimonials(sentiment_category);
CREATE INDEX IF NOT EXISTS idx_testimonials_confidence ON testimonials(is_testimonial_confidence);
CREATE INDEX IF NOT EXISTS idx_testimonials_manual_review ON testimonials(manual_review_needed);
CREATE INDEX IF NOT EXISTS idx_testimonials_llm_processed ON testimonials(llm_processed_at);
CREATE INDEX IF NOT EXISTS idx_testimonials_email ON testimonials(email);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_hidden ON testimonials(is_hidden);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_testimonials_positive_display 
ON testimonials(sentiment_score, sentiment_category, is_hidden, created_at) 
WHERE sentiment_score >= 20 AND is_hidden = FALSE;

CREATE INDEX IF NOT EXISTS idx_testimonials_needs_review 
ON testimonials(manual_review_needed, llm_processed_at) 
WHERE manual_review_needed = TRUE;

-- Add helpful comments to columns
COMMENT ON COLUMN testimonials.id IS 'Primary key using UUID';
COMMENT ON COLUMN testimonials.name IS 'Sender name from email (sanitized)';
COMMENT ON COLUMN testimonials.email IS 'Sender email address';
COMMENT ON COLUMN testimonials.message IS 'Testimonial message content (sanitized)';
COMMENT ON COLUMN testimonials.is_testimonial_confidence IS 'LLM confidence score (0-100) that this content is a genuine testimonial';
COMMENT ON COLUMN testimonials.sentiment_score IS 'LLM sentiment score (-100 to 100) where negative values indicate negative sentiment';
COMMENT ON COLUMN testimonials.sentiment_category IS 'Categorized sentiment: very_negative, negative, neutral, positive, very_positive';
COMMENT ON COLUMN testimonials.llm_processed_at IS 'Timestamp when LLM analysis was completed';
COMMENT ON COLUMN testimonials.manual_review_needed IS 'Flag indicating if this testimonial needs manual review';
COMMENT ON COLUMN testimonials.llm_reasoning IS 'LLM explanation for the analysis decision';
COMMENT ON COLUMN testimonials.is_featured IS 'Admin flag to feature this testimonial prominently';
COMMENT ON COLUMN testimonials.is_hidden IS 'Admin flag to hide this testimonial from public display';
COMMENT ON COLUMN testimonials.admin_notes IS 'Internal admin notes about this testimonial';

-- ====================================================================
-- Row Level Security (RLS) Policies
-- ====================================================================

-- Enable RLS on testimonials table
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to positive, non-hidden testimonials
CREATE POLICY IF NOT EXISTS "Public can view positive testimonials" ON testimonials
    FOR SELECT 
    USING (
        sentiment_score >= 20 
        AND sentiment_category NOT IN ('negative', 'very_negative')
        AND is_hidden = FALSE
    );

-- Policy: Allow authenticated users to insert testimonials (for webhook)
CREATE POLICY IF NOT EXISTS "Service role can insert testimonials" ON testimonials
    FOR INSERT 
    WITH CHECK (true);

-- Policy: Allow authenticated users to update testimonials (for admin functions)
CREATE POLICY IF NOT EXISTS "Service role can update testimonials" ON testimonials
    FOR UPDATE 
    USING (true);

-- ====================================================================
-- Helper Functions
-- ====================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on row changes
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- Sample Data (Optional - for testing)
-- ====================================================================

-- Insert some sample testimonials for testing
-- Uncomment the lines below if you want sample data

/*
INSERT INTO testimonials (name, email, message, is_testimonial_confidence, sentiment_score, sentiment_category, llm_processed_at, manual_review_needed, llm_reasoning) VALUES
('John Doe', 'john@example.com', 'This product is absolutely amazing! It has transformed my workflow completely.', 95.0, 85, 'very_positive', NOW(), FALSE, 'Clear positive testimonial with strong emotional language'),
('Jane Smith', 'jane@example.com', 'Good product, does what it says. Recommended.', 88.0, 65, 'positive', NOW(), FALSE, 'Straightforward positive feedback'),
('Bob Wilson', 'bob@example.com', 'The product is okay, nothing special but it works.', 75.0, 15, 'neutral', NOW(), FALSE, 'Neutral feedback expressing basic satisfaction'),
('Alice Brown', 'alice@example.com', 'Best investment I ever made! Customer service is top notch too.', 98.0, 92, 'very_positive', NOW(), FALSE, 'Enthusiastic testimonial with multiple positive aspects'),
('Mike Davis', 'mike@example.com', 'Really impressed with the quality and ease of use.', 90.0, 78, 'positive', NOW(), FALSE, 'Positive testimonial highlighting specific benefits');
*/

-- ====================================================================
-- Verification Queries
-- ====================================================================

-- Run these queries after migration to verify everything is working:

-- 1. Check table structure
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'testimonials' 
-- ORDER BY ordinal_position;

-- 2. Check indexes
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'testimonials';

-- 3. Check constraints
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'testimonials'::regclass;

-- 4. Test RLS policies
-- SELECT * FROM testimonials; -- Should only show positive testimonials

-- ====================================================================
-- Migration Complete
-- ====================================================================