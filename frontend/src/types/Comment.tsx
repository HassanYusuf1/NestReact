export interface Comment {
    commentId: number; // Unique identifier for the comment
    noteId?: number;
    pictureId?: number;
    userName: string; // Username of the commenter
    Content: string; // Text of the comment
    uploadDate: Date; // Timestamp of the comment (ISO 8601 format preferred)
  }  