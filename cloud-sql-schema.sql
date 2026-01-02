-- AMRO Academy Database Schema for Google Cloud SQL (PostgreSQL 17)
-- Run this in Cloud SQL Editor

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for clean migration)
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS session_history CASCADE;
DROP TABLE IF EXISTS companions CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;

-- Create companions table
CREATE TABLE companions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    voice TEXT NOT NULL,
    style TEXT NOT NULL,
    duration INTEGER NOT NULL DEFAULT 15,
    author TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create session_history table
CREATE TABLE session_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    companion_id UUID NOT NULL REFERENCES companions(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create bookmarks table
CREATE TABLE bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    companion_id UUID NOT NULL REFERENCES companions(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(companion_id, user_id)
);

-- Create user_badges table for AMRO Academy badge system
CREATE TABLE user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    badge_type TEXT NOT NULL CHECK (badge_type IN ('student', 'mentor', 'instructor', 'graduate', 'top_performer')),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, badge_type)
);

-- Create certificates table for AMRO Academy certificates
CREATE TABLE certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    certificate_type TEXT NOT NULL CHECK (certificate_type IN ('completion', 'top_performer')),
    course_name TEXT,
    completion_date DATE NOT NULL,
    certificate_number TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_companions_author ON companions(author);
CREATE INDEX idx_companions_subject ON companions(subject);
CREATE INDEX idx_session_history_user_id ON session_history(user_id);
CREATE INDEX idx_session_history_companion_id ON session_history(companion_id);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_companion_id ON bookmarks(companion_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_type ON user_badges(badge_type);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_number ON certificates(certificate_number);

-- Grant permissions to database user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO amroacademyuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO amroacademyuser;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO amroacademyuser;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO amroacademyuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO amroacademyuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO amroacademyuser;


