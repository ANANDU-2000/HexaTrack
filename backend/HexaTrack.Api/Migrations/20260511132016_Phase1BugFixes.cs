using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HexaTrack.Api.Migrations
{
    /// <inheritdoc />
    public partial class Phase1BugFixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Organizations");

            migrationBuilder.Sql("""
                ALTER TABLE "Organizations"
                ALTER COLUMN "Plan" TYPE integer
                USING CASE
                    WHEN "Plan" = 'Basic' THEN 1
                    WHEN "Plan" = 'Growth' THEN 2
                    WHEN "Plan" = 'Pro' THEN 3
                    WHEN "Plan" IN ('ProMax', 'Pro Max') THEN 4
                    WHEN "Plan" = 'Enterprise' THEN 5
                    ELSE 0
                END
                """);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Organizations",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsSuspended",
                table: "Organizations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SuspendReason",
                table: "Organizations",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "SuspendedAt",
                table: "Organizations",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Organizations_Plan_IsActive",
                table: "Organizations",
                columns: new[] { "Plan", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_UserId",
                table: "Categories",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_WorkspaceId_UserId",
                table: "Categories",
                columns: new[] { "WorkspaceId", "UserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Users_UserId",
                table: "Categories",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Users_UserId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Organizations_Plan_IsActive",
                table: "Organizations");

            migrationBuilder.DropIndex(
                name: "IX_Categories_UserId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_WorkspaceId_UserId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "IsSuspended",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "SuspendReason",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "SuspendedAt",
                table: "Organizations");

            migrationBuilder.Sql("""
                ALTER TABLE "Organizations"
                ALTER COLUMN "Plan" TYPE character varying(50)
                USING CASE
                    WHEN "Plan" = 1 THEN 'Basic'
                    WHEN "Plan" = 2 THEN 'Growth'
                    WHEN "Plan" = 3 THEN 'Pro'
                    WHEN "Plan" = 4 THEN 'ProMax'
                    WHEN "Plan" = 5 THEN 'Enterprise'
                    ELSE 'Free'
                END
                """);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Organizations",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }
    }
}
