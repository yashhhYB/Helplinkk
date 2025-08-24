/*
  # Create patient_requests table

  1. New Tables
    - `patient_requests`
      - `id` (text, primary key)
      - `patient_id` (text, not null)
      - `patient_name` (text, not null)
      - `doctor_id` (text, nullable)
      - `request_type` (text, not null)
      - `title` (text, not null)
      - `description` (text, nullable)
      - `priority` (text, not null)
      - `status` (text, not null)
      - `health_data` (jsonb, nullable)
      - `request_date` (timestamp with time zone, default now)
      - `assigned_date` (timestamp with time zone, nullable)
      - `completed_date` (timestamp with time zone, nullable)
      - `region` (text, nullable)
      - `notes` (text, nullable)
      - `attachments` (text array, nullable)
      - `created_at` (timestamp with time zone, default now)
      - `updated_at` (timestamp with time zone, default now)

  2. Security
    - Enable RLS on `patient_requests` table
    - Add policy for patients to read their own requests
    - Add policy for doctors to read assigned requests
    - Add policy for authenticated users to create requests
    - Add policy for doctors to update assigned requests

  3. Indexes
    - Index on patient_id for fast patient request lookups
    - Index on doctor_id for fast doctor request lookups
    - Index on status for filtering requests
    - Index on request_date for chronological ordering
*/

CREATE TABLE IF NOT EXISTS patient_requests (
  id text PRIMARY KEY,
  patient_id text NOT NULL,
  patient_name text NOT NULL,
  doctor_id text,
  request_type text NOT NULL,
  title text NOT NULL,
  description text,
  priority text NOT NULL,
  status text NOT NULL,
  health_data jsonb,
  request_date timestamptz DEFAULT now(),
  assigned_date timestamptz,
  completed_date timestamptz,
  region text,
  notes text,
  attachments text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE patient_requests ENABLE ROW LEVEL SECURITY;

-- Policies for patient_requests table
CREATE POLICY "Patients can read own requests"
  ON patient_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = patient_id);

CREATE POLICY "Doctors can read assigned requests"
  ON patient_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = doctor_id);

CREATE POLICY "Authenticated users can create requests"
  ON patient_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = patient_id);

CREATE POLICY "Doctors can update assigned requests"
  ON patient_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = doctor_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_patient_requests_patient_id ON patient_requests (patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_requests_doctor_id ON patient_requests (doctor_id);
CREATE INDEX IF NOT EXISTS idx_patient_requests_status ON patient_requests (status);
CREATE INDEX IF NOT EXISTS idx_patient_requests_request_date ON patient_requests (request_date DESC);
CREATE INDEX IF NOT EXISTS idx_patient_requests_region ON patient_requests (region);