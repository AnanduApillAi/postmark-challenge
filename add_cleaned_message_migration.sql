-- Migration: Add cleaned_message column for LLM-extracted content
-- Run this in your Supabase SQL Editor

-- Add cleaned_message column to store LLM-extracted testimonial content
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS cleaned_message TEXT;

-- Add comment for documentation
COMMENT ON COLUMN testimonials.cleaned_message IS 'LLM-extracted core testimonial content without email formalities (greetings, signatures, etc.)';

-- Create index for performance when querying cleaned content
CREATE INDEX IF NOT EXISTS idx_testimonials_cleaned_message 
ON testimonials(cleaned_message) 
WHERE cleaned_message IS NOT NULL;

-- Update existing testimonials to use original message as cleaned_message (fallback)
-- This ensures existing testimonials display properly while new ones use LLM extraction
UPDATE testimonials 
SET cleaned_message = message 
WHERE cleaned_message IS NULL 
AND message IS NOT NULL; 