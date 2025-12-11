CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251210194526_InitialCreate') THEN
    CREATE TABLE "Guests" (
        "Id" INTEGER NOT NULL,
        "FirstName" TEXT NOT NULL,
        "LastName" TEXT NOT NULL,
        "IdentificationNumber" TEXT,
        "PhoneNumber" TEXT,
        "Email" TEXT,
        "Address" TEXT,
        "BirthDate" TEXT,
        "Nationality" TEXT,
        "IsVip" INTEGER NOT NULL,
        "Notes" TEXT,
        CONSTRAINT "PK_Guests" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251210194526_InitialCreate') THEN
    CREATE TABLE "Rooms" (
        "Id" INTEGER NOT NULL,
        "Number" TEXT NOT NULL,
        "Type" TEXT NOT NULL,
        "Floor" INTEGER NOT NULL,
        "Status" TEXT NOT NULL,
        "BasePrice" TEXT NOT NULL,
        "CapacityAdults" INTEGER NOT NULL,
        "CapacityChildren" INTEGER NOT NULL,
        "Features" TEXT,
        CONSTRAINT "PK_Rooms" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251210194526_InitialCreate') THEN
    CREATE TABLE "Reservations" (
        "Id" INTEGER NOT NULL,
        "ReservationNumber" TEXT NOT NULL,
        "GuestId" INTEGER NOT NULL,
        "RoomId" INTEGER,
        "CheckInDate" TEXT NOT NULL,
        "CheckOutDate" TEXT NOT NULL,
        "Adults" INTEGER NOT NULL,
        "Children" INTEGER NOT NULL,
        "TotalAmount" TEXT NOT NULL,
        "Status" TEXT NOT NULL,
        "CreatedAt" TEXT NOT NULL,
        "UpdatedAt" TEXT,
        CONSTRAINT "PK_Reservations" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Reservations_Guests_GuestId" FOREIGN KEY ("GuestId") REFERENCES "Guests" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_Reservations_Rooms_RoomId" FOREIGN KEY ("RoomId") REFERENCES "Rooms" ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251210194526_InitialCreate') THEN
    CREATE TABLE "Folios" (
        "Id" INTEGER NOT NULL,
        "FolioNumber" TEXT NOT NULL,
        "ReservationId" INTEGER NOT NULL,
        "TotalDebit" TEXT NOT NULL,
        "TotalCredit" TEXT NOT NULL,
        "IsClosed" INTEGER NOT NULL,
        CONSTRAINT "PK_Folios" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Folios_Reservations_ReservationId" FOREIGN KEY ("ReservationId") REFERENCES "Reservations" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251210194526_InitialCreate') THEN
    CREATE TABLE "Transactions" (
        "Id" INTEGER NOT NULL,
        "FolioId" INTEGER NOT NULL,
        "Date" TEXT NOT NULL,
        "Description" TEXT NOT NULL,
        "Amount" TEXT NOT NULL,
        "Type" TEXT NOT NULL,
        "Category" TEXT NOT NULL,
        "ProcessedBy" TEXT,
        CONSTRAINT "PK_Transactions" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Transactions_Folios_FolioId" FOREIGN KEY ("FolioId") REFERENCES "Folios" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251210194526_InitialCreate') THEN
    CREATE INDEX "IX_Folios_ReservationId" ON "Folios" ("ReservationId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251210194526_InitialCreate') THEN
    CREATE INDEX "IX_Reservations_GuestId" ON "Reservations" ("GuestId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251210194526_InitialCreate') THEN
    CREATE INDEX "IX_Reservations_RoomId" ON "Reservations" ("RoomId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251210194526_InitialCreate') THEN
    CREATE INDEX "IX_Transactions_FolioId" ON "Transactions" ("FolioId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251210194526_InitialCreate') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20251210194526_InitialCreate', '10.0.1');
    END IF;
END $EF$;
COMMIT;

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000324_InitialPostgres') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20251211000324_InitialPostgres', '10.0.1');
    END IF;
END $EF$;
COMMIT;

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" DROP CONSTRAINT "FK_Reservations_Guests_GuestId";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" DROP CONSTRAINT "FK_Reservations_Rooms_RoomId";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    DROP TABLE "Guests";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    DROP TABLE "Transactions";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    DROP TABLE "Folios";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    DROP INDEX "IX_Reservations_GuestId";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    DROP INDEX "IX_Reservations_RoomId";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Rooms" DROP COLUMN "BasePrice";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Rooms" DROP COLUMN "CapacityAdults";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Rooms" DROP COLUMN "CapacityChildren";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Rooms" DROP COLUMN "Features";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Rooms" DROP COLUMN "Floor";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" DROP COLUMN "Adults";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" DROP COLUMN "Children";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" DROP COLUMN "CreatedAt";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" DROP COLUMN "GuestId";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" DROP COLUMN "ReservationNumber";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" DROP COLUMN "TotalAmount";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" DROP COLUMN "UpdatedAt";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Rooms" ALTER COLUMN "Type" TYPE text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Rooms" ALTER COLUMN "Status" TYPE text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Rooms" ALTER COLUMN "Number" TYPE text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Rooms" ALTER COLUMN "Id" TYPE integer;
    ALTER TABLE "Rooms" ALTER COLUMN "Id" DROP DEFAULT;
    ALTER TABLE "Rooms" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Rooms" ADD "Capacity" integer NOT NULL DEFAULT 0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Rooms" ADD "IsOccupied" boolean NOT NULL DEFAULT FALSE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Rooms" ADD "Price" numeric(18,2) NOT NULL DEFAULT 0.0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" ALTER COLUMN "Status" TYPE text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" ALTER COLUMN "RoomId" TYPE integer;
    UPDATE "Reservations" SET "RoomId" = 0 WHERE "RoomId" IS NULL;
    ALTER TABLE "Reservations" ALTER COLUMN "RoomId" SET NOT NULL;
    ALTER TABLE "Reservations" ALTER COLUMN "RoomId" SET DEFAULT 0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" ALTER COLUMN "CheckOutDate" TYPE timestamp with time zone;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" ALTER COLUMN "CheckInDate" TYPE timestamp with time zone;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" ALTER COLUMN "Id" TYPE integer;
    ALTER TABLE "Reservations" ALTER COLUMN "Id" DROP DEFAULT;
    ALTER TABLE "Reservations" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" ADD "GuestName" text NOT NULL DEFAULT '';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" ADD "IsPaid" boolean NOT NULL DEFAULT FALSE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    ALTER TABLE "Reservations" ADD "TotalPrice" numeric(18,2) NOT NULL DEFAULT 0.0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251211000531_InitialPostgresReal') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20251211000531_InitialPostgresReal', '10.0.1');
    END IF;
END $EF$;
COMMIT;

