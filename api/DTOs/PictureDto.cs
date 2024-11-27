using System;
using System.ComponentModel.DataAnnotations;

namespace InstagramMVC.DTOs
{
    public class PictureDto
    {
        public int PictureId { get; set; }

        [StringLength(500)]
        public string? Title { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        public string? PictureUrl { get; set; } // URL eller sti til bildet

        [Required]
        public DateTime UploadDate { get; set; }

        public string? UserName { get; set; } // Brukernavnet til brukeren som har lastet opp bildet
    }
}
