/*
  # Game History and Referral System

  1. New Tables
    - `game_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `result` (text) - 'win' or 'loss'
      - `amount` (decimal)
      - `created_at` (timestamp)
    - `referrals`
      - `id` (uuid, primary key)
      - `referrer_id` (uuid, foreign key)
      - `referred_id` (uuid, foreign key)
      - `code` (text)
      - `status` (text) - 'pending' or 'completed'
      - `created_at` (timestamp)
      - `completed_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create game_history table
CREATE TABLE IF NOT EXISTS game_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  result text NOT NULL CHECK (result IN ('win', 'loss')),
  amount decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enable RLS
ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Policies for game_history
CREATE POLICY "Users can view their own game history"
  ON game_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game history"
  ON game_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for referrals
CREATE POLICY "Users can view their referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referral codes"
  ON referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Users can update their referral status"
  ON referrals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = referred_id)
  WITH CHECK (status = 'completed' AND referred_id = auth.uid());