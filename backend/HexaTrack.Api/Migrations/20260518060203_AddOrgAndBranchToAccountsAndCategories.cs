using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HexaTrack.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddOrgAndBranchToAccountsAndCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BranchId",
                table: "Categories",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                table: "Categories",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "BranchId",
                table: "Accounts",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "OrganizationId",
                table: "Accounts",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_BranchId",
                table: "Categories",
                column: "BranchId",
                filter: "\"BranchId\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_OrganizationId",
                table: "Categories",
                column: "OrganizationId",
                filter: "\"OrganizationId\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_BranchId",
                table: "Accounts",
                column: "BranchId",
                filter: "\"BranchId\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_OrganizationId",
                table: "Accounts",
                column: "OrganizationId",
                filter: "\"OrganizationId\" IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Accounts_Branches_BranchId",
                table: "Accounts",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Accounts_Organizations_OrganizationId",
                table: "Accounts",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Branches_BranchId",
                table: "Categories",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Organizations_OrganizationId",
                table: "Categories",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Accounts_Branches_BranchId",
                table: "Accounts");

            migrationBuilder.DropForeignKey(
                name: "FK_Accounts_Organizations_OrganizationId",
                table: "Accounts");

            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Branches_BranchId",
                table: "Categories");

            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Organizations_OrganizationId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_BranchId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_OrganizationId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Accounts_BranchId",
                table: "Accounts");

            migrationBuilder.DropIndex(
                name: "IX_Accounts_OrganizationId",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "BranchId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "BranchId",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Accounts");
        }
    }
}
