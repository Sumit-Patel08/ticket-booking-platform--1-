-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Venues policies (public read, organizers and admins can manage)
CREATE POLICY "Anyone can view venues" ON public.venues
  FOR SELECT USING (true);

CREATE POLICY "Organizers and admins can manage venues" ON public.venues
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('organizer', 'admin')
    )
  );

-- Events policies
CREATE POLICY "Anyone can view published events" ON public.events
  FOR SELECT USING (status = 'published' OR organizer_id = auth.uid());

CREATE POLICY "Organizers can manage their own events" ON public.events
  FOR ALL USING (organizer_id = auth.uid());

CREATE POLICY "Admins can manage all events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Seat categories policies
CREATE POLICY "Anyone can view seat categories for published events" ON public.seat_categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE id = seat_categories.event_id AND status = 'published'
    )
  );

CREATE POLICY "Event organizers can manage seat categories" ON public.seat_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE id = seat_categories.event_id AND organizer_id = auth.uid()
    )
  );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Event organizers can view bookings for their events" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE id = bookings.event_id AND organizer_id = auth.uid()
    )
  );

-- Payments policies
CREATE POLICY "Users can view payments for their bookings" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = payments.booking_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage payments" ON public.payments
  FOR ALL USING (true); -- This will be restricted by application logic

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON public.reviews
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = reviews.booking_id AND user_id = auth.uid() AND status = 'confirmed'
    )
  );

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (user_id = auth.uid());
