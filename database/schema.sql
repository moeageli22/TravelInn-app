-- TravelInn Database Schema
-- Add your CREATE TABLE statements here.
-- ============================================================
-- TravelInn Database Schema (with all foreign keys)
-- ============================================================

-- 1. USERS (Linked to Supabase Auth)
create table public.users (
    id uuid primary key references auth.users (id),
    full_name text,
    created_at timestamptz default now()
    );

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
