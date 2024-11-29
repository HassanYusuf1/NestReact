export interface Note {
    noteId?: number,
    title: string,
    content: string,
    uploadDate: Date;
    comments?: Comment[];
}