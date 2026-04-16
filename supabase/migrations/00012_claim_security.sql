-- Secure business claims: only admin can view all claims and update claim status
-- Drop existing if re-running
DROP POLICY IF EXISTS "Admin can view all claims" ON business_claims;
DROP POLICY IF EXISTS "Admin can update claims" ON business_claims;
DROP POLICY IF EXISTS "Owner can update own claims" ON business_claims;
DROP POLICY IF EXISTS "Claimed owners can update own location" ON locations;
DROP POLICY IF EXISTS "Admin can update locations" ON locations;

-- Admin can view ALL claims (for the review page)
CREATE POLICY "Admin can view all claims" ON business_claims
  FOR SELECT USING (auth.uid() = 'ed1906c8-2e71-4b6c-ac4a-8af4466edc1c'::uuid);

-- Only admin can update claims (approve/reject)
CREATE POLICY "Admin can update claims" ON business_claims
  FOR UPDATE USING (auth.uid() = 'ed1906c8-2e71-4b6c-ac4a-8af4466edc1c'::uuid);

-- Business owner can update their own claim (for unclaiming)
CREATE POLICY "Owner can update own claims" ON business_claims
  FOR UPDATE USING (auth.uid() = user_id);

-- Claimed owners can update their own location (for unclaiming)
CREATE POLICY "Claimed owners can update own location" ON locations
  FOR UPDATE USING (auth.uid() = claimed_by);

-- Admin can update any location (for approving claims)
CREATE POLICY "Admin can update locations" ON locations
  FOR UPDATE USING (auth.uid() = 'ed1906c8-2e71-4b6c-ac4a-8af4466edc1c'::uuid);
