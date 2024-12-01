using System.ComponentModel.DataAnnotations;

namespace InstagramMVC.DTOs
{
    public class NoteDto //DTO for Notes
    {
        public int NoteId { get; set; }

        [Required]
        [Display(Name = "Title")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Content")]
        public string Content { get; set; } = string.Empty;
        public DateTime UploadDate {get; set;} //When the note got uploaded
        
    }
}