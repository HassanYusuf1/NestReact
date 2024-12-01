namespace InstagramMVC.Models{
public class Comment {

    public int CommentId {get; set;}  // PK
    public int? PictureId{get; set;} //FK
    public int? NoteId {get; set;}//FK

    //Comment content
    public string?  CommentDescription  {get;set;}  

    public DateTime CommentTime {get; set;}

    // relation to picture or note
    public virtual Picture? Picture {get; set;} 

    public virtual Note? Note { get; set; }

    public string? UserName {get; set;} 

    
}
}