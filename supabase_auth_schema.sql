create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('car_owner','shop_owner')) default 'car_owner',
  full_name text, phone text, avatar_url text, created_at timestamptz default now()
);
create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, role, full_name, phone) values (new.id, coalesce(new.raw_user_meta_data->>'role','car_owner'), new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure handle_new_user();
alter table profiles enable row level security;
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
