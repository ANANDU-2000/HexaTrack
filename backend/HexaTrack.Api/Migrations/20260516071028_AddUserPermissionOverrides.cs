using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HexaTrack.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserPermissionOverrides : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Mode",
                table: "Workspaces",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                table: "Workspaces",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "PermissionOverrides",
                table: "Users",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "OwnerPermissions",
                table: "Organizations",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "StaffPermissions",
                table: "Organizations",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "WorkspaceMode",
                table: "Organizations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsEnabled",
                table: "Branches",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "ManagerUserId",
                table: "Branches",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "OrganizationFeatureToggles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OrganizationId = table.Column<Guid>(type: "uuid", nullable: false),
                    FeatureKey = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrganizationFeatureToggles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrganizationFeatureToggles_Organizations_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Organizations_WorkspaceMode",
                table: "Organizations",
                column: "WorkspaceMode");

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationFeatureToggles_OrganizationId_FeatureKey",
                table: "OrganizationFeatureToggles",
                columns: new[] { "OrganizationId", "FeatureKey" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrganizationFeatureToggles");

            migrationBuilder.DropIndex(
                name: "IX_Organizations_WorkspaceMode",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "Mode",
                table: "Workspaces");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Workspaces");

            migrationBuilder.DropColumn(
                name: "PermissionOverrides",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "OwnerPermissions",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "StaffPermissions",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "WorkspaceMode",
                table: "Organizations");

            migrationBuilder.DropColumn(
                name: "IsEnabled",
                table: "Branches");

            migrationBuilder.DropColumn(
                name: "ManagerUserId",
                table: "Branches");
        }
    }
}
