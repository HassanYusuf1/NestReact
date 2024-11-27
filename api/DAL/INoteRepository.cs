using InstagramMVC.Models;

namespace InstagramMVC.DAL;

public interface INoteRepository
{
    Task<IEnumerable<Note>?> GetAll();
    Task<Note?> GetNoteById(int id);
    Task Create(Note note);
    Task Edit(Note note);
    Task<bool> Delete(int id);
    Task<bool> DeleteConfirmed(int id);
}