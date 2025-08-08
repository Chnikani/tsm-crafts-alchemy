-- Add status column to order_inquiries table
ALTER TABLE public.order_inquiries ADD COLUMN status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'));

-- Create index for the new status column
CREATE INDEX idx_order_inquiries_status ON public.order_inquiries(status);

-- Update RLS policies to ensure users can only see their own orders
CREATE POLICY "Users can view their own order inquiries" ON public.order_inquiries FOR SELECT USING (auth.uid() = user_id);