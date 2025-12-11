-- Create User
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'doesta_user') THEN

      CREATE ROLE doesta_user LOGIN PASSWORD 'Doesta_2024!';
   END IF;
END
$do$;

-- Grant privileges
ALTER USER doesta_user CREATEDB;

-- Note: Database creation cannot be done inside a transaction block easily in a script
-- You should run: CREATE DATABASE doesta_db OWNER doesta_user; separately or handle it before this script regarding tables.
