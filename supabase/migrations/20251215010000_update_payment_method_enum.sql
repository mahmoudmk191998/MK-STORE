-- Update payment_method enum to include bank_transfer
ALTER TYPE public.payment_method ADD VALUE IF NOT EXISTS 'bank_transfer';