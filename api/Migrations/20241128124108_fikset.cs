using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class fikset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Pictures_PictureId",
                table: "Comments");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_NoteId",
                table: "Comments",
                column: "NoteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Notes_NoteId",
                table: "Comments",
                column: "NoteId",
                principalTable: "Notes",
                principalColumn: "NoteId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Pictures_PictureId",
                table: "Comments",
                column: "PictureId",
                principalTable: "Pictures",
                principalColumn: "PictureId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Notes_NoteId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Pictures_PictureId",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_NoteId",
                table: "Comments");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Pictures_PictureId",
                table: "Comments",
                column: "PictureId",
                principalTable: "Pictures",
                principalColumn: "PictureId");
        }
    }
}
