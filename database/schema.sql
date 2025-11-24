-- TravelInn Database Schema
-- Add your CREATE TABLE statements here.
-- ============================================================
-- TravelInn Database Schema (with all foreign keys).
-- ============================================================

-- 1. USERS (Linked to Supabase Auth)
create table public.users (
    id uuid primary key references auth.users (id),
    full_name text,
    created_at timestamptz default now()
    );
-- TravelInn Database Schema
-- ============================================================
-- Complete Database Schema for Travelinn Application
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extended user information, linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
                                               id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email varchar NOT NULL UNIQUE,
    full_name text,
    username text UNIQUE,
    bio text,
    phone varchar,
    country varchar,
    city varchar,
    date_of_birth date,
    avatar_url text,
    cover_photo_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
    );

-- 2. HOTELS
CREATE TABLE IF NOT EXISTS public.hotels (
                                             id bigserial PRIMARY KEY,
                                             name varchar NOT NULL,
                                             location varchar NOT NULL,
                                             nightly_price numeric(10,2) NOT NULL,
    image_url varchar,
    description text,
    rating numeric(2,1) DEFAULT 4.5,
    amenities text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
    );

-- 3. ROOM TYPES (Linked to hotels)
CREATE TABLE IF NOT EXISTS public.room_types (
                                                 id bigserial PRIMARY KEY,
                                                 hotel_id bigint NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    name varchar NOT NULL,
    base_price numeric(10,2) NOT NULL,
    max_guests int NOT NULL DEFAULT 2,
    beds varchar,
    size varchar,
    image_url varchar,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
    );

-- 4. AMENITIES
CREATE TABLE IF NOT EXISTS public.amenities (
                                                id bigserial PRIMARY KEY,
                                                name varchar NOT NULL UNIQUE,
                                                icon varchar,
                                                created_at timestamptz DEFAULT now()
    );

-- 5. HOTEL_AMENITIES (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.hotel_amenities (
                                                      hotel_id bigint NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    amenity_id bigint NOT NULL REFERENCES public.amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (hotel_id, amenity_id)
    );

-- 6. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
                                               id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    confirmation_id varchar NOT NULL UNIQUE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hotel_id bigint NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    room_type_id bigint REFERENCES public.room_types(id) ON DELETE SET NULL,

    -- Guest Information
    guest_email varchar NOT NULL,
    guest_name varchar,

    -- Room Details
    room_name varchar NOT NULL,
    room_price numeric(10,2) NOT NULL,

    -- Stay Details
    check_in date NOT NULL,
    check_out date NOT NULL,
    nights int NOT NULL,
    guests int NOT NULL,
    special_requests text,

    -- Payment
    total_price numeric(10,2) NOT NULL,
    payment_method varchar,
    payment_status varchar DEFAULT 'paid',

    -- Status
    status varchar DEFAULT 'confirmed',

    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
    );

-- 7. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
                                              id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hotel_id bigint NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
    rating int2 NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
    );

-- ============================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id ON public.bookings(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_confirmation_id ON public.bookings(confirmation_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON public.bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_hotel_id ON public.reviews(hotel_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
                                      USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
                                             USING (auth.uid() = id);

-- Bookings Policies
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
                                      USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
    ON public.bookings FOR UPDATE
                                             USING (auth.uid() = user_id);

-- Reviews Policies
CREATE POLICY "Reviews are viewable by everyone"
    ON public.reviews FOR SELECT
                                     USING (true);

CREATE POLICY "Users can create their own reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON public.reviews FOR UPDATE
                                            USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON public.reviews FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON public.hotels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
INSERT INTO public.profiles (id, email, full_name, avatar_url)
VALUES (
           NEW.id,
           NEW.email,
           NEW.raw_user_meta_data->>'full_name',
           NEW.raw_user_meta_data->>'avatar_url'
       );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- 2. HOTELS
create table public.hotels (
    id bigserial primary key,
    name varchar not null,
    location varchar not null,
    nightly_price numeric(10,2) not null,
    image_url varchar,
    description text,
    created_at timestamptz default now()
    );

-- 3. ROOM TYPES (Linked to hotels)
create table public.room_types (
    id bigserial primary key,
    hotel_id bigint not null references public.hotels(id),
    name varchar not null,
    base_price numeric(10,2),
    max_guests int,
    image_url varchar,
    description text,
    created_at timestamptz default now()
    );

-- 4. AMENITIES
create table public.amenities (
    id bigserial primary key,
    name varchar not null unique
);

-- 5. HOTEL_AMENITIES (Many-to-Many)
create table public.hotel_amenities (
    hotel_id bigint not null references public.hotels(id),
    amenity_id bigint not null references public.amenities(id),
    primary key (hotel_id, amenity_id)
    );

-- 6. BOOKINGS
create table public.bookings (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id),
    hotel_id bigint not null references public.hotels(id),
    room_type_id bigint references public.room_types(id),

    check_in date not null,
    check_out date not null,
    guests int not null,
    special_requests text,
    total_price numeric(10,2),
    status varchar default 'confirmed',

    created_at timestamptz default now()
    );

-- 7. REVIEWS
create table public.reviews (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id),
    hotel_id bigint not null references public.hotels(id),
    rating int2 not null check (rating between 1 and 5),
    comment text,
    created_at timestamptz default now()
    );
