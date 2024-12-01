using System;
using System.ComponentModel.DataAnnotations;

namespace InstagramMVC.Models
{
    public class Note
    {
        public int NoteId {get; set;}
        [Required]
        public string Title {get; set;} = string.Empty;
        [Required]
        public string Content {get; set;} = string.Empty;
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>(); //list of comments
        public DateTime UploadDate {get; set;} //date when it got uploaded

        


        
    }
}