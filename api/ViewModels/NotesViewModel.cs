using InstagramMVC.Models;

namespace InstagramMVC.ViewModels
{
    public class NotesViewModel
    {
        public IEnumerable<Note> Notes;
        public string? CurrentViewName;

        public NotesViewModel(IEnumerable<Note>? notes, string? currentViewName)
        {
            Notes = notes ?? Enumerable.Empty<Note>(); //Provide a default value
            CurrentViewName = currentViewName ?? string.Empty; //Default to an empty string
        }
    }
}