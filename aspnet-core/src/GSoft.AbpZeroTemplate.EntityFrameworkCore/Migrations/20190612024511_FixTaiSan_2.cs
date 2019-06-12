﻿using Microsoft.EntityFrameworkCore.Migrations;

namespace GSoft.AbpZeroTemplate.Migrations
{
    public partial class FixTaiSan_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaDV",
                table: "ThongTinTaiSans",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "TenDV",
                table: "ThongTinTaiSans",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaDV",
                table: "ThongTinTaiSans");

            migrationBuilder.DropColumn(
                name: "TenDV",
                table: "ThongTinTaiSans");
        }
    }
}
