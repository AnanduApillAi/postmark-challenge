// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://gmarxdsuryefbaodnaws.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtYXJ4ZHN1cnllZmJhb2RuYXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDE4MzAsImV4cCI6MjA2MzU3NzgzMH0.tKW-tt8dc9R9YoCBQOSiBe4WfShzwQ7EajmNMjP_sl0'
);
