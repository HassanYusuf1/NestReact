export interface Picture {
    pictureId: number;              
    pictureUrl?: string;           
    title?: string;                 
    description?: string;           
    uploadDate: Date;               
    comments: Comment[];            
    userName?: string;              
  }
  
  export interface Comment {
    commentId: number;              
    text: string;                   
    userName: string;               
    createdAt: Date;               
  }
  