-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'customer')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
BEGIN
  RETURN 'BK' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to update available seats when booking is created/cancelled
CREATE OR REPLACE FUNCTION update_available_seats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    -- Decrease available seats
    UPDATE public.seat_categories 
    SET available_seats = available_seats - NEW.quantity
    WHERE id = NEW.seat_category_id;
    
    UPDATE public.events 
    SET available_seats = available_seats - NEW.quantity
    WHERE id = NEW.event_id;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status changes
    IF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
      -- Booking confirmed, decrease seats
      UPDATE public.seat_categories 
      SET available_seats = available_seats - NEW.quantity
      WHERE id = NEW.seat_category_id;
      
      UPDATE public.events 
      SET available_seats = available_seats - NEW.quantity
      WHERE id = NEW.event_id;
      
    ELSIF OLD.status = 'confirmed' AND NEW.status IN ('cancelled', 'refunded') THEN
      -- Booking cancelled, increase seats
      UPDATE public.seat_categories 
      SET available_seats = available_seats + OLD.quantity
      WHERE id = OLD.seat_category_id;
      
      UPDATE public.events 
      SET available_seats = available_seats + OLD.quantity
      WHERE id = OLD.event_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update available seats
CREATE TRIGGER update_seats_on_booking_change
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_available_seats();
