-- Insert sample venues
INSERT INTO public.venues (id, name, address, city, state, country, postal_code, capacity, description, amenities, images) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Madison Square Garden', '4 Pennsylvania Plaza', 'New York', 'NY', 'USA', '10001', 20000, 'The World''s Most Famous Arena', '["Parking", "Concessions", "Accessibility", "VIP Lounges"]', '["https://example.com/msg1.jpg"]'),
('550e8400-e29b-41d4-a716-446655440002', 'Central Park SummerStage', 'Rumsey Playfield, Central Park', 'New York', 'NY', 'USA', '10024', 5000, 'Outdoor concert venue in the heart of Central Park', '["Outdoor Setting", "Food Vendors", "Accessibility"]', '["https://example.com/summerstage1.jpg"]'),
('550e8400-e29b-41d4-a716-446655440003', 'Brooklyn Academy of Music', '30 Lafayette Ave', 'Brooklyn', 'NY', 'USA', '11217', 2100, 'Premier performing arts venue', '["Parking", "Restaurant", "Gift Shop", "Accessibility"]', '["https://example.com/bam1.jpg"]');

-- Insert sample events (we'll need to create a sample organizer profile first)
-- Note: In a real app, these would be created by actual users
INSERT INTO public.events (id, title, description, category, venue_id, start_date, end_date, status, base_price, total_seats, available_seats, images, tags, featured) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Summer Music Festival 2024', 'Join us for an unforgettable weekend of music featuring top artists from around the world. Experience multiple stages, food vendors, and an amazing atmosphere.', 'Music', '550e8400-e29b-41d4-a716-446655440002', '2024-07-15 14:00:00+00', '2024-07-17 23:00:00+00', 'published', 89.00, 5000, 4850, '["https://example.com/music-festival1.jpg", "https://example.com/music-festival2.jpg"]', '["music", "festival", "outdoor", "weekend"]', true),
('660e8400-e29b-41d4-a716-446655440002', 'Tech Innovation Conference', 'Discover the latest trends in technology and network with industry leaders. Features keynote speakers, workshops, and networking sessions.', 'Technology', '550e8400-e29b-41d4-a716-446655440001', '2024-08-22 09:00:00+00', '2024-08-22 18:00:00+00', 'published', 299.00, 2000, 1750, '["https://example.com/tech-conf1.jpg"]', '["technology", "conference", "networking", "innovation"]', true),
('660e8400-e29b-41d4-a716-446655440003', 'Broadway Musical Night', 'Experience the magic of Broadway with this spectacular musical performance featuring award-winning actors and musicians.', 'Theater', '550e8400-e29b-41d4-a716-446655440003', '2024-09-05 19:30:00+00', '2024-09-05 22:00:00+00', 'published', 125.00, 2100, 1950, '["https://example.com/broadway1.jpg"]', '["theater", "musical", "broadway", "performance"]', true),
('660e8400-e29b-41d4-a716-446655440004', 'Jazz Night at Blue Note', 'An intimate evening of jazz featuring renowned musicians in a classic club setting.', 'Music', '550e8400-e29b-41d4-a716-446655440003', '2024-06-28 20:00:00+00', '2024-06-28 23:00:00+00', 'published', 45.00, 300, 275, '["https://example.com/jazz1.jpg"]', '["jazz", "music", "intimate", "club"]', false);

-- Insert seat categories for events
INSERT INTO public.seat_categories (id, event_id, name, price, total_seats, available_seats, description) VALUES
-- Summer Music Festival
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'General Admission', 89.00, 4000, 3900, 'General access to all stages and areas'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'VIP Experience', 299.00, 500, 475, 'VIP area with premium viewing, complimentary drinks, and exclusive access'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Premium', 159.00, 500, 475, 'Premium viewing area with better stage access'),

-- Tech Conference
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Standard Pass', 299.00, 1500, 1300, 'Access to all sessions and networking events'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Premium Pass', 499.00, 300, 275, 'All standard benefits plus VIP networking dinner and priority seating'),
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', 'Student Pass', 99.00, 200, 175, 'Discounted pass for students with valid ID'),

-- Broadway Musical
('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440003', 'Orchestra', 199.00, 800, 750, 'Premium orchestra seating with best views'),
('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440003', 'Mezzanine', 125.00, 600, 550, 'Elevated seating with excellent sightlines'),
('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440003', 'Balcony', 75.00, 700, 650, 'Upper level seating at an affordable price'),

-- Jazz Night
('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440004', 'Table Seating', 65.00, 100, 95, 'Reserved table seating with table service'),
('770e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440004', 'Bar Seating', 45.00, 50, 45, 'Bar seating with full bar access'),
('770e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440004', 'Standing Room', 35.00, 150, 135, 'Standing room with full venue access');
