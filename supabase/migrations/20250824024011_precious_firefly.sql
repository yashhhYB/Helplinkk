/*
  # Create patient requests table for doctor-patient communication

  1. New Tables
    - `patient_requests`
      - `id` (text, primary key)
      - `patient_id` (text, foreign key to users)
      - `patient_name` (text)
      - `doctor_id` (text, foreign key to users)
      - `request_type` (text)
      - `title` (text)
      - `description` (text)
      - `priority` (text)
      - `status` (text)
      - `health_data` (jsonb)
      - `request_date` (timestamptz)
      - `assigned_date` (timestamptz)
      - `completed_date` (timestamptz)
      - `region` (text)
      - `notes` (text)
      - `attachments` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `patient_requests` table
    - Add policies for patients to create requests
    - Add policies for doctors to view and update assigned requests
    - Add policies for admins to view all requests
*/

CREATE TABLE IF NOT EXISTS patient_requests (
  id text PRIMARY KEY,
  patient_id text NOT NULL,
  patient_name text NOT NULL,
  doctor_id text,
  request_type text NOT NULL CHECK (request_type IN ('consultation', 'blood_request', 'health_analysis', 'emergency')),
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
  health_data jsonb,
  request_date timestamptz NOT NULL DEFAULT now(),
  assigned_date timestamptz,
  completed_date timestamptz,
  region text NOT NULL,
  notes text,
  attachments text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE patient_requests ENABLE ROW LEVEL SECURITY;

-- Policies for patients (can create and view their own requests)
CREATE POLICY "Patients can create requests"
  ON patient_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = patient_id);

CREATE POLICY "Patients can view own requests"
  ON patient_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = patient_id);

-- Policies for doctors (can view and update assigned requests)
CREATE POLICY "Doctors can view assigned requests"
  ON patient_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = doctor_id);

CREATE POLICY "Doctors can update assigned requests"
  ON patient_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = doctor_id);

-- Policies for admins (can view and manage all requests)
CREATE POLICY "Admins can view all requests"
  ON patient_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patient_requests_doctor_id ON patient_requests(doctor_id);
CREATE INDEX IF NOT EXISTS idx_patient_requests_patient_id ON patient_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_requests_status ON patient_requests(status);
CREATE INDEX IF NOT EXISTS idx_patient_requests_priority ON patient_requests(priority);
CREATE INDEX IF NOT EXISTS idx_patient_requests_region ON patient_requests(region);
CREATE INDEX IF NOT EXISTS idx_patient_requests_request_date ON patient_requests(request_date DESC);