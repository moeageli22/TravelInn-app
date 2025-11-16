-- ============================================================
-- TravelInn Database Schema (IMPROVED VERSION)
-- ============================================================

-- 1. USERS (Linked to Supabase Auth)
create table public.users (
                              id uuid primary key references auth.users (id),
                              full_name text,
                              phone varchar,
                              date_of_birth date,
                              profile_image_url varchar,
                              created_at timestamptz default now(),
                              updated_at timestamptz default now()
);

-- 2. HOTELS (Enhanced)
create table public.hotels (
                               id bigserial primary key,
                               name varchar not null,
                               description text,
                               address text not null,
                               city varchar not null,
                               country varchar not null,
                               location varchar not null, -- e.g., "Dubai, UAE"
                               latitude decimal(10, 8),
                               longitude decimal(11, 8),
                               nightly_price numeric(10,2) not null,
                               image_url varchar, -- primary image
                               rating decimal(3,2) default 0.00,
                               total_reviews integer default 0,
                               phone varchar,
                               email varchar,
                               check_in_time time default '14:00:00',
                               check_out_time time default '11:00:00',
                               is_active boolean default true,
                               created_at timestamptz default now(),
                               updated_at timestamptz default now()
);

-- 3. HOTEL IMAGES (Multiple images per hotel)
create table public.hotel_images (
                                     id bigserial primary key,
                                     hotel_id bigint not null references public.hotels(id) on delete cascade,
                                     image_url varchar not null,
                                     caption text,
                                     is_primary boolean default false,
                                     display_order integer default 0,
                                     created_at timestamptz default now()
);

-- 4. ROOM TYPES (Linked to hotels)
create table public.room_types (
                                   id bigserial primary key,
                                   hotel_id bigint not null references public.hotels(id) on delete cascade,
                                   name varchar not null,
                                   description text,
                                   base_price numeric(10,2) not null,
                                   max_guests int not null,
                                   available_rooms integer default 0,
                                   size_sqm decimal(8,2),
                                   bed_type varchar, -- e.g., "King", "Twin", "Queen"
                                   image_url varchar,
                                   is_available boolean default true,
                                   created_at timestamptz default now(),
                                   updated_at timestamptz default now()
);

-- 5. AMENITIES
create table public.amenities (
                                  id bigserial primary key,
                                  name varchar not null unique,
                                  icon varchar, -- for UI display
                                  category varchar -- e.g., "Room", "Hotel", "Services"
);

-- 6. HOTEL_AMENITIES (Many-to-Many)
create table public.hotel_amenities (
                                        hotel_id bigint not null references public.hotels(id) on delete cascade,
                                        amenity_id bigint not null references public.amenities(id) on delete cascade,
                                        primary key (hotel_id, amenity_id)
);

-- 7. ROOM_AMENITIES (Room-specific amenities)
create table public.room_amenities (
                                       room_type_id bigint not null references public.room_types(id) on delete cascade,
                                       amenity_id bigint not null references public.amenities(id) on delete cascade,
                                       primary key (room_type_id, amenity_id)
);

-- 8. BOOKINGS (Enhanced)
create table public.bookings (
                                 id uuid primary key default gen_random_uuid(),
                                 booking_reference varchar unique not null, -- e.g., "TI-2024-001234"
                                 user_id uuid not null references public.users(id) on delete cascade,
                                 hotel_id bigint not null references public.hotels(id) on delete cascade,
                                 room_type_id bigint references public.room_types(id) on delete set null,

                                 check_in date not null,
                                 check_out date not null,
                                 nights integer generated always as (check_out - check_in) stored,
                                 guests integer not null,

                                 special_requests text,

    -- Pricing
                                 room_price numeric(10,2) not null,
                                 taxes numeric(10,2) default 0.00,
                                 service_fee numeric(10,2) default 0.00,
                                 total_price numeric(10,2) not null,

    -- Status tracking
                                 status varchar default 'pending', -- pending, confirmed, checked_in, checked_out, cancelled
                                 payment_status varchar default 'pending', -- pending, paid, refunded, failed
                                 payment_method varchar, -- credit_card, paypal, etc.

                                 cancelled_at timestamptz,
                                 cancellation_reason text,

                                 created_at timestamptz default now(),
                                 updated_at timestamptz default now(),

                                 constraint valid_dates check (check_out > check_in),
                                 constraint valid_guests check (guests > 0)
);

-- 9. PAYMENT_TRANSACTIONS
create table public.payment_transactions (
                                             id uuid primary key default gen_random_uuid(),
                                             booking_id uuid not null references public.bookings(id) on delete cascade,
                                             amount numeric(10,2) not null,
                                             currency varchar(3) default 'USD',
                                             payment_method varchar not null,
                                             transaction_id varchar, -- from payment provider (Stripe, PayPal, etc.)
                                             status varchar default 'pending', -- pending, completed, failed, refunded
                                             error_message text,
                                             created_at timestamptz default now(),
                                             updated_at timestamptz default now()
);

-- 10. REVIEWS (Enhanced)
create table public.reviews (
                                id uuid primary key default gen_random_uuid(),
                                user_id uuid not null references public.users(id) on delete cascade,
                                hotel_id bigint not null references public.hotels(id) on delete cascade,
                                booking_id uuid references public.bookings(id) on delete set null,

                                rating int2 not null check (rating between 1 and 5),
                                title varchar(200),
                                comment text,

    -- Detailed ratings (optional)
                                cleanliness_rating int2 check (cleanliness_rating between 1 and 5),
                                location_rating int2 check (location_rating between 1 and 5),
                                service_rating int2 check (service_rating between 1 and 5),
                                value_rating int2 check (value_rating between 1 and 5),

                                helpful_count integer default 0,
                                is_verified boolean default false, -- verified if linked to actual booking

                                created_at timestamptz default now(),
                                updated_at timestamptz default now()
);

-- 11. REVIEW_RESPONSES (Hotel responses to reviews)
create table public.review_responses (
                                         id uuid primary key default gen_random_uuid(),
                                         review_id uuid not null references public.reviews(id) on delete cascade,
                                         response_text text not null,
                                         responder_name varchar,
                                         responder_role varchar, -- e.g., "Hotel Manager"
                                         created_at timestamptz default now()
);

-- 12. USER_FAVORITES (Wishlist)
create table public.user_favorites (
                                       user_id uuid references public.users(id) on delete cascade,
                                       hotel_id bigint references public.hotels(id) on delete cascade,
                                       created_at timestamptz default now(),
                                       primary key (user_id, hotel_id)
);

-- 13. SEARCH_HISTORY (Track user searches for recommendations)
create table public.search_history (
                                       id bigserial primary key,
                                       user_id uuid references public.users(id) on delete cascade,
                                       search_term varchar not null,
                                       filters jsonb, -- store search filters as JSON
                                       created_at timestamptz default now()
);

-- ============================================================
-- INDEXES for Performance
-- ============================================================

-- Hotels
create index idx_hotels_city on public.hotels(city);
create index idx_hotels_country on public.hotels(country);
create index idx_hotels_rating on public.hotels(rating desc);
create index idx_hotels_price on public.hotels(nightly_price);
create index idx_hotels_active on public.hotels(is_active);

-- Bookings
create index idx_bookings_user on public.bookings(user_id);
create index idx_bookings_hotel on public.bookings(hotel_id);
create index idx_bookings_dates on public.bookings(check_in, check_out);
create index idx_bookings_status on public.bookings(status);
create index idx_bookings_reference on public.bookings(booking_reference);

-- Reviews
create index idx_reviews_hotel on public.reviews(hotel_id);
create index idx_reviews_user on public.reviews(user_id);
create index idx_reviews_rating on public.reviews(rating);
create index idx_reviews_created on public.reviews(created_at desc);

-- Room Types
create index idx_room_types_hotel on public.room_types(hotel_id);
create index idx_room_types_available on public.room_types(is_available);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to update hotel rating after review
create or replace function update_hotel_rating()
returns trigger as $$
begin
update public.hotels
set
    rating = (
        select round(avg(rating)::numeric, 2)
        from public.reviews
        where hotel_id = new.hotel_id
    ),
    total_reviews = (
        select count(*)
        from public.reviews
        where hotel_id = new.hotel_id
    ),
    updated_at = now()
where id = new.hotel_id;

return new;
end;
$$ language plpgsql;

-- Trigger to update hotel rating
create trigger trigger_update_hotel_rating
    after insert or update or delete on public.reviews
    for each row
    execute function update_hotel_rating();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
return new;
end;
$$ language plpgsql;

-- Apply updated_at trigger to relevant tables
create trigger update_users_updated_at before update on public.users
    for each row execute function update_updated_at_column();

create trigger update_hotels_updated_at before update on public.hotels
    for each row execute function update_updated_at_column();

create trigger update_bookings_updated_at before update on public.bookings
    for each row execute function update_updated_at_column();

create trigger update_reviews_updated_at before update on public.reviews
    for each row execute function update_updated_at_column();

-- Function to generate booking reference
create or replace function generate_booking_reference()
returns trigger as $$
begin
    new.booking_reference = 'TI-' || to_char(now(), 'YYYY') || '-' ||
                           lpad(nextval('booking_reference_seq')::text, 6, '0');
return new;
end;
$$ language plpgsql;

-- Sequence for booking reference
create sequence booking_reference_seq;

-- Trigger for booking reference
create trigger trigger_generate_booking_reference
    before insert on public.bookings
    for each row
    execute function generate_booking_reference();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - Important for Supabase!
-- ============================================================

-- Enable RLS
alter table public.users enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.user_favorites enable row level security;
alter table public.search_history enable row level security;

-- Users can view their own data
create policy "Users can view own profile"
    on public.users for select
                                   using (auth.uid() = id);

create policy "Users can update own profile"
    on public.users for update
                                   using (auth.uid() = id);

-- Bookings policies
create policy "Users can view own bookings"
    on public.bookings for select
                                      using (auth.uid() = user_id);

create policy "Users can create bookings"
    on public.bookings for insert
    with check (auth.uid() = user_id);

create policy "Users can update own bookings"
    on public.bookings for update
                                             using (auth.uid() = user_id);

-- Reviews policies
create policy "Anyone can view reviews"
    on public.reviews for select
                                     to authenticated
                                     using (true);

create policy "Users can create reviews"
    on public.reviews for insert
    with check (auth.uid() = user_id);

create policy "Users can update own reviews"
    on public.reviews for update
                                            using (auth.uid() = user_id);

-- Hotels are public (anyone can view)
alter table public.hotels enable row level security;
create policy "Anyone can view hotels"
    on public.hotels for select
                                    to authenticated, anon
                                    using (is_active = true);

-- ============================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================

-- Insert sample amenities
insert into public.amenities (name, category) values
                                                  ('WiFi', 'Room'),
                                                  ('Air Conditioning', 'Room'),
                                                  ('Swimming Pool', 'Hotel'),
                                                  ('Spa', 'Hotel'),
                                                  ('Gym', 'Hotel'),
                                                  ('Restaurant', 'Hotel'),
                                                  ('Bar', 'Hotel'),
                                                  ('Room Service', 'Services'),
                                                  ('Parking', 'Hotel'),
                                                  ('Beach Access', 'Hotel'),
                                                  ('Pet Friendly', 'Hotel'),
                                                  ('Business Center', 'Hotel');