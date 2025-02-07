using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChildVaccineSystem.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddComboVaccines : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ComboVaccines",
                columns: table => new
                {
                    ComboId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComboName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    ValidityMonths = table.Column<int>(type: "int", nullable: false),
                    EffectiveDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAtUpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComboVaccines", x => x.ComboId);
                });

            migrationBuilder.CreateTable(
                name: "ComboDetail",
                columns: table => new
                {
                    ComboDetailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComboId = table.Column<int>(type: "int", nullable: false),
                    VaccineId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComboDetail", x => x.ComboDetailId);
                    table.ForeignKey(
                        name: "FK_ComboDetail_ComboVaccines_ComboId",
                        column: x => x.ComboId,
                        principalTable: "ComboVaccines",
                        principalColumn: "ComboId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ComboDetail_Vaccines_VaccineId",
                        column: x => x.VaccineId,
                        principalTable: "Vaccines",
                        principalColumn: "VaccineId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ComboDetail_ComboId",
                table: "ComboDetail",
                column: "ComboId");

            migrationBuilder.CreateIndex(
                name: "IX_ComboDetail_VaccineId",
                table: "ComboDetail",
                column: "VaccineId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ComboDetail");

            migrationBuilder.DropTable(
                name: "ComboVaccines");
        }
    }
}
