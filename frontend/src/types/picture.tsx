export interface Picture {
    pictureId: number;              
    pictureUrl?: string;           
    title?: string;                 
    description?: string;           
    uploadDate: Date;               
    comments: Comment[];            
    userName?: string;              
  }
  
 