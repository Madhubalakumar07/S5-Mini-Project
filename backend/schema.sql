-- ====================================================================
-- PostgreSQL Database Schema for CampusAI / S5-Mini-Project
-- Database: miniproject
-- User: postgres
-- Port: 5432
-- ====================================================================

-- 1. Users Table (Authentication & User Profiles)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  department VARCHAR(255) NOT NULL,
  roll_number VARCHAR(100),
  staff_id VARCHAR(100),
  designation VARCHAR(255),
  batch VARCHAR(100),
  year INTEGER,
  phone VARCHAR(50),
  cgpa NUMERIC(4, 2),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast user lookups by email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
