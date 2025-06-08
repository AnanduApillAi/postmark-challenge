-- ====================================================================
-- Postmark Testimonial System - Complete Database Setup (Combined)
-- ====================================================================
-- This file contains the complete database schema for the 
-- Postmark Testimonial System with LLM filtering and enhanced email data.
--
-- Run this in your Supabase SQL Editor to set up the complete database.
-- This includes all features: LLM analysis, spam detection, enhanced timestamps, etc.
-- ====================================================================

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if you need to recreate (CAUTION: This will delete all data)
-- DROP TABLE IF EXISTS testimonials CASCADE;

-- Create testimonials table with complete schema (including enhanced fields)
CREATE TABLE IF NOT EXISTS testimonials (
    -- Primary key and metadata
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Original email data
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Enhanced email data (V2 additions)
    message_id VARCHAR(255),
    subject TEXT DEFAULT 'No Subject',
    email_date TIMESTAMP WITH TIME ZONE,
    spam_score DECIMAL(4,2) DEFAULT 0.0,
    spam_status VARCHAR(20) DEFAULT 'unknown',
    
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

-- ====================================================================
-- Add Enhanced Fields to Existing Table (if table already exists)
-- ====================================================================

-- Add enhanced email fields if they don't exist
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS message_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS subject TEXT DEFAULT 'No Subject',
ADD COLUMN IF NOT EXISTS email_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS spam_score DECIMAL(4,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS spam_status VARCHAR(20) DEFAULT 'unknown';

-- ====================================================================
-- Data Validation Constraints
-- ====================================================================

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

ALTER TABLE testimonials 
ADD CONSTRAINT IF NOT EXISTS check_spam_score_range 
CHECK (spam_score >= -50.0 AND spam_score <= 50.0);

ALTER TABLE testimonials 
ADD CONSTRAINT IF NOT EXISTS check_spam_status_values 
CHECK (spam_status IN ('no', 'yes', 'unknown'));

-- ====================================================================
-- Performance Indexes
-- ====================================================================

-- Original indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_sentiment_score ON testimonials(sentiment_score);
CREATE INDEX IF NOT EXISTS idx_testimonials_sentiment_category ON testimonials(sentiment_category);
CREATE INDEX IF NOT EXISTS idx_testimonials_confidence ON testimonials(is_testimonial_confidence);
CREATE INDEX IF NOT EXISTS idx_testimonials_manual_review ON testimonials(manual_review_needed);
CREATE INDEX IF NOT EXISTS idx_testimonials_llm_processed ON testimonials(llm_processed_at);
CREATE INDEX IF NOT EXISTS idx_testimonials_email ON testimonials(email);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_hidden ON testimonials(is_hidden);

-- Enhanced data indexes (V2 additions)
CREATE INDEX IF NOT EXISTS idx_testimonials_message_id ON testimonials(message_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_email_date ON testimonials(email_date DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_spam_score ON testimonials(spam_score);
CREATE INDEX IF NOT EXISTS idx_testimonials_spam_status ON testimonials(spam_status);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_testimonials_positive_display 
ON testimonials(sentiment_score, sentiment_category, is_hidden, email_date) 
WHERE sentiment_score >= 20 AND is_hidden = FALSE;

CREATE INDEX IF NOT EXISTS idx_testimonials_needs_review 
ON testimonials(manual_review_needed, llm_processed_at) 
WHERE manual_review_needed = TRUE;

-- ====================================================================
-- Column Documentation
-- ====================================================================

-- Original field comments
COMMENT ON COLUMN testimonials.id IS 'Primary key using UUID';
COMMENT ON COLUMN testimonials.name IS 'Sender name from email (sanitized)';
COMMENT ON COLUMN testimonials.email IS 'Sender email address';
COMMENT ON COLUMN testimonials.message IS 'Testimonial message content (sanitized)';

-- Enhanced email data comments (V2)
COMMENT ON COLUMN testimonials.message_id IS 'Unique message ID from email provider for duplicate detection';
COMMENT ON COLUMN testimonials.subject IS 'Email subject line, defaults to "No Subject" if empty';
COMMENT ON COLUMN testimonials.email_date IS 'Original email timestamp with timezone from sender';
COMMENT ON COLUMN testimonials.spam_score IS 'Spam score from email provider (-50 to +50 typically)';
COMMENT ON COLUMN testimonials.spam_status IS 'Spam status: no, yes, or unknown';

-- LLM analysis comments
COMMENT ON COLUMN testimonials.is_testimonial_confidence IS 'LLM confidence score (0-100) that this content is a genuine testimonial';
COMMENT ON COLUMN testimonials.sentiment_score IS 'LLM sentiment score (-100 to 100) where negative values indicate negative sentiment';
COMMENT ON COLUMN testimonials.sentiment_category IS 'Categorized sentiment: very_negative, negative, neutral, positive, very_positive';
COMMENT ON COLUMN testimonials.llm_processed_at IS 'Timestamp when LLM analysis was completed';
COMMENT ON COLUMN testimonials.manual_review_needed IS 'Flag indicating if this testimonial needs manual review';
COMMENT ON COLUMN testimonials.llm_reasoning IS 'LLM explanation for the analysis decision';

-- Administrative comments
COMMENT ON COLUMN testimonials.is_featured IS 'Admin flag to feature this testimonial prominently';
COMMENT ON COLUMN testimonials.is_hidden IS 'Admin flag to hide this testimonial from public display';
COMMENT ON COLUMN testimonials.admin_notes IS 'Internal admin notes about this testimonial';

-- ====================================================================
-- Row Level Security (RLS) Policies
-- ====================================================================

-- Enable RLS on testimonials table
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view positive testimonials" ON testimonials;
DROP POLICY IF EXISTS "Service role can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Service role can update testimonials" ON testimonials;

-- Policy: Allow public read access to positive, non-hidden testimonials
CREATE POLICY "Public can view positive testimonials" ON testimonials
    FOR SELECT 
    USING (
        sentiment_score >= 20 
        AND sentiment_category NOT IN ('negative', 'very_negative')
        AND is_hidden = FALSE
    );

-- Policy: Allow authenticated users to insert testimonials (for webhook)
CREATE POLICY "Service role can insert testimonials" ON testimonials
    FOR INSERT 
    WITH CHECK (true);

-- Policy: Allow authenticated users to update testimonials (for admin functions)
CREATE POLICY "Service role can update testimonials" ON testimonials
    FOR UPDATE 
    USING (true);

-- ====================================================================
-- Helper Functions and Triggers
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
INSERT INTO testimonials (
    name, email, message, subject, message_id, email_date, 
    spam_score, spam_status, is_testimonial_confidence, 
    sentiment_score, sentiment_category, llm_processed_at, 
    manual_review_needed, llm_reasoning
) VALUES
(
    'John Doe', 'john@example.com', 
    'This product is absolutely amazing! It has transformed my workflow completely.',
    'Amazing Product Review', 'msg-001-uuid', NOW() - INTERVAL '2 hours',
    -0.5, 'no', 95.0, 85, 'very_positive', NOW(), FALSE, 
    'Clear positive testimonial with strong emotional language'
),
(
    'Jane Smith', 'jane@example.com',
    'Good product, does what it says. Recommended.',
    'Product Feedback', 'msg-002-uuid', NOW() - INTERVAL '1 day',
    -0.2, 'no', 88.0, 65, 'positive', NOW(), FALSE,
    'Straightforward positive feedback'
),
(
    'Alice Brown', 'alice@example.com',
    'Best investment I ever made! Customer service is top notch too.',
    'Excellent Service!', 'msg-003-uuid', NOW() - INTERVAL '3 hours',
    -0.8, 'no', 98.0, 92, 'very_positive', NOW(), FALSE,
    'Enthusiastic testimonial with multiple positive aspects'
);
*/

-- ====================================================================
-- Verification Queries
-- ====================================================================

-- Run these queries after migration to verify everything is working:

-- 1. Check complete table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'testimonials' 
ORDER BY ordinal_position;

-- 2. Check all indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'testimonials'
ORDER BY indexname;

-- 3. Check all constraints
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'testimonials'::regclass
ORDER BY conname;

-- 4. Test RLS policies (should only show positive testimonials)
-- SELECT * FROM testimonials;

-- 5. Check enhanced fields are present
SELECT 
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'testimonials' 
        AND column_name IN ('message_id', 'subject', 'email_date', 'spam_score', 'spam_status')
    ) THEN 'Enhanced fields present ✓' 
    ELSE 'Enhanced fields missing ✗' 
    END as enhanced_fields_status;

-- ====================================================================
-- Migration Complete - Features Included:
-- ====================================================================
-- ✓ Basic testimonial storage
-- ✓ LLM analysis and sentiment scoring  
-- ✓ Enhanced email data (message ID, subject, timezone-aware dates)
-- ✓ Spam detection and tagging
-- ✓ Row Level Security policies
-- ✓ Performance indexes
-- ✓ Data validation constraints
-- ✓ Automatic timestamp updates
-- ✓ Admin features (featured, hidden flags)
-- ✓ Comprehensive documentation
-- ==================================================================== 