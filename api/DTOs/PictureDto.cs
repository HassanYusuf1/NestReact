using Microsoft.AspNetCore.Http;
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

        
        public IFormFile? PictureFile { get; set; }

        
        public string? PictureUrl { get; set; }

        [Required]
        public DateTime UploadDate { get; set; }

        public string? UserName { get; set; }
    }
}
