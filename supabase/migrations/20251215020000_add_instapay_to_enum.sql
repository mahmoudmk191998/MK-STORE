-- Add instapay to payment_method enum if it doesn't exist
DO $$
BEGIN
    -- Check if 'instapay' already exists in the enum
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = 'payment_method' AND e.enumlabel = 'instapay'
    ) THEN
        -- Add 'instapay' to the enum
        ALTER TYPE public.payment_method ADD VALUE 'instapay';
    END IF;
END $$;