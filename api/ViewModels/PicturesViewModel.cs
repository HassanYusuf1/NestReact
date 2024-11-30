using InstagramMVC.Models;

namespace InstagramMVC.ViewModels
{
    public class PicturesViewModel
    {
        public IEnumerable<Picture> Pictures;
        public string? CurrentViewName;

        public PicturesViewModel(IEnumerable<Picture>? pictures, string? currentViewName)
        {
            Pictures = pictures ?? Enumerable.Empty<Picture>(); // Provide a default value
            CurrentViewName = currentViewName ?? string.Empty;   // Default to an empty string
        }
    }
}