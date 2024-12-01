export interface Note { //Model for note
    noteId?: number,
    title: string,
    content: string,
    uploadDate: Date;
    comments?: Comment[];
}