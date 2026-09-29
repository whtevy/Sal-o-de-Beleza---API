create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  description text,
  active boolean not null default true
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on update cascade on delete restrict,
  name varchar(120) not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  active boolean not null default true
);

create table if not exists professionals (
  id uuid primary key default gen_random_uuid(),
  name varchar(120) not null,
  specialty varchar(120) not null,
  phone varchar(30),
  active boolean not null default true
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on update cascade on delete restrict,
  professional_id uuid not null references professionals(id) on update cascade on delete restrict,
  client_name varchar(120) not null,
  client_phone varchar(30) not null,
  appointment_date date not null,
  appointment_time time not null,
  status varchar(30) not null default 'agendado'
);

insert into categories (name, description)
values
  ('Cabelos', 'Serviços para corte, escova, coloração e tratamentos'),
  ('Unhas', 'Serviços de manicure e pedicure'),
  ('Estética', 'Serviços de beleza e cuidados pessoais')
on conflict do nothing;