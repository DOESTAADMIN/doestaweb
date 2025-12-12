using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Doesta.WebApi.Migrations.Postgres
{
    /// <inheritdoc />
    public partial class UpdateGuestEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BedType",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Payer",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SaleType",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TrackingCode",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BirthPlace",
                table: "Guests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CarPlate",
                table: "Guests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Guests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Guests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EmailContactConsent",
                table: "Guests",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Guests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "IdIssueDate",
                table: "Guests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "IdValidDate",
                table: "Guests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsBlacklist",
                table: "Guests",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "KvkkConsent",
                table: "Guests",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "MiddleName",
                table: "Guests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PassportIssueDate",
                table: "Guests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PassportNo",
                table: "Guests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PassportValidDate",
                table: "Guests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "PhoneContactConsent",
                table: "Guests",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Guests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_RoomId",
                table: "Reservations",
                column: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Rooms_RoomId",
                table: "Reservations",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Rooms_RoomId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_RoomId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "BedType",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Payer",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "SaleType",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "TrackingCode",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "BirthPlace",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "CarPlate",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "EmailContactConsent",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "IdIssueDate",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "IdValidDate",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "IsBlacklist",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "KvkkConsent",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "MiddleName",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "PassportIssueDate",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "PassportNo",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "PassportValidDate",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "PhoneContactConsent",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Guests");
        }
    }
}
