namespace InstagramMVC.DTOs
{
    public class CommentDto //DTO for comment
    {
        public int CommentId { get; set; }
        public int? PictureId { get; set; }
        public int? NoteId { get; set; }
        public string? CommentDescription { get; set; }
        public DateTime CommentTime { get; set; }
        public string? UserName { get; set; }
    }
}