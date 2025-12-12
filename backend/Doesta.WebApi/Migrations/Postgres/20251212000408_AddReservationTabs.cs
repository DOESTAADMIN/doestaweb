using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Doesta.WebApi.Migrations.Postgres
{
    /// <inheritdoc />
    public partial class AddReservationTabs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplyTax",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContractType",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "DiscountActive",
                table: "Reservations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExchangeDate",
                table: "Reservations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ExchangeRate",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "InvoiceAddress",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "InvoiceTaxType",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "InvoiceTitle",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "ManualPriceActive",
                table: "Reservations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PriceType",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "QTime",
                table: "Reservations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RealCheckInDate",
                table: "Reservations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RealCheckOutDate",
                table: "Reservations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxAccount",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaxIncluded",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaxNumber",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaxOffice",
                table: "Reservations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "ReservationNotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ReservationId = table.Column<int>(type: "INTEGER", nullable: false),
                    Message = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationNotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReservationNotes_Reservations_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReservationRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ReservationId = table.Column<int>(type: "INTEGER", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    Department = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReservationRequests_Reservations_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReservationNotes_ReservationId",
                table: "ReservationNotes",
                column: "ReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationRequests_ReservationId",
                table: "ReservationRequests",
                column: "ReservationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReservationNotes");

            migrationBuilder.DropTable(
                name: "ReservationRequests");

            migrationBuilder.DropColumn(
                name: "ApplyTax",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ContractType",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "DiscountActive",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ExchangeDate",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ExchangeRate",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "InvoiceAddress",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "InvoiceTaxType",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "InvoiceTitle",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ManualPriceActive",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "PriceType",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "QTime",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "RealCheckInDate",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "RealCheckOutDate",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "TaxAccount",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "TaxIncluded",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "TaxNumber",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "TaxOffice",
                table: "Reservations");
        }
    }
}
