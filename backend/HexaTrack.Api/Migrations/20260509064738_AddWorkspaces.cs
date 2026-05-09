using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HexaTrack.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkspaces : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tags_UserId_Name",
                table: "Tags");

            migrationBuilder.DropIndex(
                name: "IX_Categories_UserId_Name_ParentCategoryId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_UserId_Type_ParentCategoryId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Accounts_UserId_Name",
                table: "Accounts");

            migrationBuilder.AddColumn<Guid>(
                name: "WorkspaceId",
                table: "Transactions",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "WorkspaceId",
                table: "Tags",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "WorkspaceId",
                table: "RecurringTransactions",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "WorkspaceId",
                table: "Categories",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "WorkspaceId",
                table: "Accounts",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Workspaces",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Currency = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Workspaces", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Workspaces_Users_OwnerUserId",
                        column: x => x.OwnerUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WorkspaceMembers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WorkspaceId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkspaceMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkspaceMembers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WorkspaceMembers_Workspaces_WorkspaceId",
                        column: x => x.WorkspaceId,
                        principalTable: "Workspaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_WorkspaceId_OccurredOn",
                table: "Transactions",
                columns: new[] { "WorkspaceId", "OccurredOn" });

            migrationBuilder.CreateIndex(
                name: "IX_Tags_WorkspaceId_Name",
                table: "Tags",
                columns: new[] { "WorkspaceId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RecurringTransactions_WorkspaceId_NextRunOn",
                table: "RecurringTransactions",
                columns: new[] { "WorkspaceId", "NextRunOn" });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_WorkspaceId_Name_ParentCategoryId",
                table: "Categories",
                columns: new[] { "WorkspaceId", "Name", "ParentCategoryId" },
                unique: true,
                filter: "\"IsArchived\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_WorkspaceId_Type_ParentCategoryId",
                table: "Categories",
                columns: new[] { "WorkspaceId", "Type", "ParentCategoryId" });

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_WorkspaceId_Name",
                table: "Accounts",
                columns: new[] { "WorkspaceId", "Name" },
                unique: true,
                filter: "\"IsArchived\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_WorkspaceMembers_UserId",
                table: "WorkspaceMembers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkspaceMembers_WorkspaceId_UserId",
                table: "WorkspaceMembers",
                columns: new[] { "WorkspaceId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Workspaces_OwnerUserId",
                table: "Workspaces",
                column: "OwnerUserId");

            migrationBuilder.Sql("""
                INSERT INTO "Workspaces" ("Id", "OwnerUserId", "Name", "Type", "Currency", "IsDefault", "CreatedAt", "UpdatedAt")
                SELECT uuid_generate_v4(), u."Id", 'Personal', 1, 'USD', true, NOW(), NOW()
                FROM "Users" AS u
                WHERE NOT EXISTS (
                    SELECT 1 FROM "Workspaces" AS w WHERE w."OwnerUserId" = u."Id");

                INSERT INTO "WorkspaceMembers" ("Id", "WorkspaceId", "UserId", "Role", "CreatedAt")
                SELECT uuid_generate_v4(), w."Id", w."OwnerUserId", 1, NOW()
                FROM "Workspaces" AS w
                WHERE NOT EXISTS (
                    SELECT 1 FROM "WorkspaceMembers" AS m
                    WHERE m."WorkspaceId" = w."Id" AND m."UserId" = w."OwnerUserId");

                UPDATE "Accounts" AS a SET "WorkspaceId" = w."Id"
                FROM "Workspaces" AS w WHERE w."OwnerUserId" = a."UserId";

                UPDATE "Categories" AS c SET "WorkspaceId" = w."Id"
                FROM "Workspaces" AS w WHERE w."OwnerUserId" = c."UserId";

                UPDATE "Transactions" AS t SET "WorkspaceId" = w."Id"
                FROM "Workspaces" AS w WHERE w."OwnerUserId" = t."UserId";

                UPDATE "Tags" AS g SET "WorkspaceId" = w."Id"
                FROM "Workspaces" AS w WHERE w."OwnerUserId" = g."UserId";

                UPDATE "RecurringTransactions" AS r SET "WorkspaceId" = w."Id"
                FROM "Workspaces" AS w WHERE w."OwnerUserId" = r."UserId";
                """);

            migrationBuilder.AddForeignKey(
                name: "FK_Accounts_Workspaces_WorkspaceId",
                table: "Accounts",
                column: "WorkspaceId",
                principalTable: "Workspaces",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Workspaces_WorkspaceId",
                table: "Categories",
                column: "WorkspaceId",
                principalTable: "Workspaces",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RecurringTransactions_Workspaces_WorkspaceId",
                table: "RecurringTransactions",
                column: "WorkspaceId",
                principalTable: "Workspaces",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_Workspaces_WorkspaceId",
                table: "Tags",
                column: "WorkspaceId",
                principalTable: "Workspaces",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Workspaces_WorkspaceId",
                table: "Transactions",
                column: "WorkspaceId",
                principalTable: "Workspaces",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Accounts_Workspaces_WorkspaceId",
                table: "Accounts");

            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Workspaces_WorkspaceId",
                table: "Categories");

            migrationBuilder.DropForeignKey(
                name: "FK_RecurringTransactions_Workspaces_WorkspaceId",
                table: "RecurringTransactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Tags_Workspaces_WorkspaceId",
                table: "Tags");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Workspaces_WorkspaceId",
                table: "Transactions");

            migrationBuilder.DropTable(
                name: "WorkspaceMembers");

            migrationBuilder.DropTable(
                name: "Workspaces");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_WorkspaceId_OccurredOn",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Tags_WorkspaceId_Name",
                table: "Tags");

            migrationBuilder.DropIndex(
                name: "IX_RecurringTransactions_WorkspaceId_NextRunOn",
                table: "RecurringTransactions");

            migrationBuilder.DropIndex(
                name: "IX_Categories_WorkspaceId_Name_ParentCategoryId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_WorkspaceId_Type_ParentCategoryId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Accounts_WorkspaceId_Name",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "WorkspaceId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "WorkspaceId",
                table: "Tags");

            migrationBuilder.DropColumn(
                name: "WorkspaceId",
                table: "RecurringTransactions");

            migrationBuilder.DropColumn(
                name: "WorkspaceId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "WorkspaceId",
                table: "Accounts");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_UserId_Name",
                table: "Tags",
                columns: new[] { "UserId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_UserId_Name_ParentCategoryId",
                table: "Categories",
                columns: new[] { "UserId", "Name", "ParentCategoryId" },
                unique: true,
                filter: "\"IsArchived\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_UserId_Type_ParentCategoryId",
                table: "Categories",
                columns: new[] { "UserId", "Type", "ParentCategoryId" });

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_UserId_Name",
                table: "Accounts",
                columns: new[] { "UserId", "Name" },
                unique: true,
                filter: "\"IsArchived\" = false");
        }
    }
}
