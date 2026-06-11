-- Run this if you already created the links table without base_url

alter table links add column if not exists base_url text;

-- Set your base URL, then run:
-- update links set base_url = 'https://sajalkumar.com' where base_url is null;

alter table links alter column base_url set not null;
