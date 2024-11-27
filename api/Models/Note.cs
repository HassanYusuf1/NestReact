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

        public DateTime UploadDate {get; set;} // dato innlegget ble opprettet

        
    }
}