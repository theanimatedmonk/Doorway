-- Personal Links MVP schema

create table if not exists links (
  id uuid primary key default gen_random_uuid(),
  purpose text not null,
  recipient_name text not null,
  slug text not null unique,
  destination_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists visits (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references links(id) on delete cascade,
  visited_at timestamptz not null default now(),
  ip_address text,
  country text,
  city text,
  browser text,
  os text,
  device_type text,
  referrer text
);

create index if not exists visits_link_id_idx on visits(link_id);
create index if not exists visits_visited_at_idx on visits(visited_at desc);
