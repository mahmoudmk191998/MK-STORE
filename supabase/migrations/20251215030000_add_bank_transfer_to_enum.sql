-- Add bank_transfer to payment_method enum if it doesn't exist
DO $$
BEGIN
    -- Check if 'bank_transfer' already exists in the enum
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = 'payment_method' AND e.enumlabel = 'bank_transfer'
    ) THEN
        -- Add 'bank_transfer' to the enum
        ALTER TYPE public.payment_method ADD VALUE 'bank_transfer';
    END IF;
END $$;