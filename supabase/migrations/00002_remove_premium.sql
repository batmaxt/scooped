-- Remove premium/Stripe columns from profiles
ALTER TABLE profiles
  DROP COLUMN IF EXISTS is_premium,
  DROP COLUMN IF EXISTS premium_expires_at,
  DROP COLUMN IF EXISTS stripe_customer_id;
