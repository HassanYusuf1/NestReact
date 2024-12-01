export interface Picture { //Interface for picture
    pictureId: number;              
    pictureUrl?: string;           
    title?: string;                 
    description?: string;           
    uploadDate: Date;               
    comments: Comment[];            
    userName?: string;              
  }
  
 