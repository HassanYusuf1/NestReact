using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using InstagramMVC.Models;
using Microsoft.Extensions.Options;

namespace InstagramMVC.DAL
{

    public class MediaDbContext : IdentityDbContext<IdentityUser>
    {
        public MediaDbContext(DbContextOptions<MediaDbContext> options) : base(options)
        {
            //Database.EnsureCreated();

        }

        public DbSet<Picture> Pictures { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Note> Notes { get; set; }



        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Configure the relationship between Comment and Note
            modelBuilder.Entity<Comment>()
                .HasOne(k => k.Note)
                .WithMany(n => n.Comments) //Assuming Note has a collection of Comment
                .HasForeignKey(k => k.NoteId)
                .OnDelete(DeleteBehavior.Cascade);

            //Configure the relationship between Comment and Picture
            modelBuilder.Entity<Comment>()
                .HasOne(k => k.Picture)
                .WithMany(b => b.Comments) //Assuming Picture has a collection of Comment
                .HasForeignKey(k => k.PictureId)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
}

