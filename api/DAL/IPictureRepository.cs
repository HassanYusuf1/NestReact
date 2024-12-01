using System.Collections.Generic;
using System.Threading.Tasks;
using InstagramMVC.Models;

namespace InstagramMVC.DAL
{
    public interface IPictureRepository
    {
        //Get all pictures
        Task<IEnumerable<Picture>?> GetAll();

        //creates new picture
        Task<bool> Create(Picture picture);

        //Get picture by its id
        Task<Picture?> PictureId(int id);

        //Update existing pictures  
        Task<bool> Edit(Picture picture);

        //Deletes a chosen picture
        Task<bool> Delete(int id);



    }


}