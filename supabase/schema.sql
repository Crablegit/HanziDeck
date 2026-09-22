-- ==============================================================================
-- HANZI DECK - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Chạy script này trong Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Kích hoạt extension cần thiết
create extension if not exists "uuid-ossp";

-- 2. Bảng Hồ sơ người dùng & Cài đặt giao diện (Profiles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  daily_goal int default 10 check (daily_goal > 0),
  theme_id text default 'imperial-jade',
  glass_blur int default 16 check (glass_blur >= 0 and glass_blur <= 40),
  glass_opacity int default 80 check (glass_opacity >= 20 and glass_opacity <= 100),
  language text default 'vi' check (language in ('vi', 'en', 'zh')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS cho profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- 3. Tự động tạo profile khi người dùng đăng ký mới
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Bảng Bộ từ vựng (Decks)
create table if not exists public.decks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  is_public boolean default false,
  color_tag text default 'green',
  total_cards int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.decks enable row level security;

create policy "Decks viewable by owner or if public" 
  on public.decks for select 
  using (auth.uid() = user_id or is_public = true);

create policy "Users can manage their own decks" 
  on public.decks for all 
  using (auth.uid() = user_id);

-- 5. Bảng Thẻ từ vựng (Cards)
create table if not exists public.cards (
  id uuid default gen_random_uuid() primary key,
  deck_id uuid references public.decks on delete cascade not null,
  hanzi text not null,
  pinyin text not null,
  han_viet text,
  meaning_vi text not null,
  meaning_en text,
  examples jsonb default '[]'::jsonb,
  hsk_level int default 1,
  radical text,
  stroke_count int,
  audio_url text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.cards enable row level security;

create policy "Cards viewable if user owns deck or deck is public"
  on public.cards for select
  using (
    exists (
      select 1 from public.decks
      where decks.id = cards.deck_id
      and (decks.user_id = auth.uid() or decks.is_public = true)
    )
  );

create policy "Users can manage cards in their own decks"
  on public.cards for all
  using (
    exists (
      select 1 from public.decks
      where decks.id = cards.deck_id
      and decks.user_id = auth.uid()
    )
  );

-- 6. Bảng Theo dõi tiến độ học & Daily Stack (User Card Progress)
create table if not exists public.user_card_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  card_id uuid references public.cards on delete cascade not null,
  status text check (status in ('queued', 'learning', 'reviewing', 'mastered')) default 'queued',
  repetitions int default 0,
  ease_factor real default 2.5,
  interval_days int default 0,
  last_studied_at timestamp with time zone,
  next_review_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, card_id)
);

alter table public.user_card_progress enable row level security;

create policy "Users can manage own card progress"
  on public.user_card_progress for all
  using (auth.uid() = user_id);

-- 7. Chỉ mục (Indexes) để tăng tốc độ truy vấn
create index if not exists idx_cards_deck_id on public.cards(deck_id);
create index if not exists idx_cards_hanzi on public.cards(hanzi);
create index if not exists idx_user_card_progress_user on public.user_card_progress(user_id);
create index if not exists idx_user_card_progress_next_review on public.user_card_progress(next_review_at);
create index if not exists idx_decks_user on public.decks(user_id);
