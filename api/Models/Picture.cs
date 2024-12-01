using System;
using System.ComponentModel.DataAnnotations;
using InstagramMVC.Models;
namespace InstagramMVC.Models {
    public class Picture {
        public int PictureId { get; set; }  
        public string? PictureUrl {get; set;}  //sabed path for picture
        public string? Title {get; set;} //picture title


        //maximum 500 letters
        [StringLength(500)]
        public String? Description {get; set;}

        public DateTime UploadDate {get; set;} //when the post got posted

        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
        
        public string? UserName {get; set;} 


    
}

}