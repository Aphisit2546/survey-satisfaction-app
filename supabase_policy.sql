-- 1. Enable Row Level Security on the table
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- 2. Policy to allow anyone (anonymous) to INSERT data (Submit survey)
CREATE POLICY "Enable insert for anon" 
ON survey_responses 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 3. Policy to allow anyone to SELECT data (View stats/averages)
CREATE POLICY "Enable select for anon" 
ON survey_responses 
FOR SELECT 
TO anon 
USING (true);
