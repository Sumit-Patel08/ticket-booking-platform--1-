-- Insert sample venues
INSERT INTO public.venues (id, name, address, city, state, country, postal_code, capacity, description, amenities, images) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sardar Patel Stadium', 'Motera, Ahmedabad', 'Ahmedabad', 'Gujarat', 'India', '382424', 132000, 'World''s largest cricket stadium, also hosts major concerts and events', '["Parking", "Concessions", "Accessibility", "VIP Lounges", "Air Conditioning"]', '["https://example.com/motera1.jpg"]'),
('550e8400-e29b-41d4-a716-446655440002', 'NSCI Dome', 'Worli Sports Club, Dr. Annie Besant Road', 'Mumbai', 'Maharashtra', 'India', '400018', 8000, 'Premier indoor entertainment venue in Mumbai', '["Parking", "Food Court", "Accessibility", "Premium Seating"]', '["https://example.com/nsci1.jpg"]');

-- Insert sample events
INSERT INTO public.events (id, title, description, category, venue_id, start_date, end_date, status, base_price, total_seats, available_seats, images, tags, featured) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Aditya Ghadvi Live Concert in Ahmedabad', 'Experience the soulful voice of Aditya Ghadvi live in concert. Join us for an evening of Gujarati folk music, devotional songs, and contemporary hits that will touch your heart.', 'Music', '550e8400-e29b-41d4-a716-446655440001', '2024-09-15 19:00:00+00', '2024-09-15 23:00:00+00', 'published', 999.00, 50000, 48500, '["https://example.com/aditya-ghadvi1.jpg", "https://example.com/aditya-ghadvi2.jpg"]', '["music", "gujarati", "folk", "devotional", "live"]', true),
('660e8400-e29b-41d4-a716-446655440002', 'Akash Gupta Standup Comedy in Mumbai', 'Get ready to laugh until your stomach hurts! Akash Gupta brings his hilarious standup comedy show to Mumbai. Known for his witty observations and relatable humor.', 'Comedy', '550e8400-e29b-41d4-a716-446655440002', '2024-09-22 20:00:00+00', '2024-09-22 22:30:00+00', 'published', 799.00, 6000, 5800, '["https://example.com/akash-gupta1.jpg"]', '["comedy", "standup", "humor", "entertainment"]', true);

-- Insert seat categories for events
INSERT INTO public.seat_categories (id, event_id, name, price, total_seats, available_seats, description) VALUES
-- Aditya Ghadvi Concert
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'General Pass', 999.00, 35000, 34000, 'General admission with access to main concert area'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Premium Pass', 1999.00, 10000, 9500, 'Premium seating area with better view and complimentary refreshments'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'VIP Pass', 4999.00, 5000, 5000, 'VIP experience with front row seating, meet & greet, and exclusive merchandise'),

-- Akash Gupta Comedy Show
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Standard Pass', 799.00, 4000, 3800, 'Standard seating with full show access'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Premium Pass', 1299.00, 1500, 1500, 'Premium seating with better view and complimentary snacks'),
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', 'VIP Pass', 2499.00, 500, 500, 'VIP seating with meet & greet and exclusive photo opportunity');
