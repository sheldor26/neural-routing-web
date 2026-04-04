-- Migration 005: blog posts table
-- Run this in Supabase SQL Editor.
-- Safe to run on existing tables (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  excerpt     TEXT,
  content     TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  tag         TEXT NOT NULL DEFAULT 'Engineering',
  read_time   TEXT NOT NULL DEFAULT '5 min',
  published   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add new columns to existing table (no-op if already present)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS excerpt     TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ DEFAULT now();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug       ON posts (slug);
CREATE INDEX IF NOT EXISTS idx_posts_published  ON posts (published, created_at DESC);

-- RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts (public blog)
DROP POLICY IF EXISTS "Public read published posts" ON posts;
CREATE POLICY "Public read published posts"
  ON posts FOR SELECT
  USING (published = TRUE);

-- Authenticated users (admin via Clerk JWT) can do everything
DROP POLICY IF EXISTS "Authenticated full access" ON posts;
CREATE POLICY "Authenticated full access"
  ON posts FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
