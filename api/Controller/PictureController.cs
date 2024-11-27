using Microsoft.AspNetCore.Mvc;
using InstagramMVC.Models;
using InstagramMVC.DAL;
using InstagramMVC.DTOs;
using InstagramMVC.ViewModels;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace InstagramMVC.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PictureAPIController : ControllerBase
    {
        private readonly IPictureRepository _pictureRepository;
        private readonly ILogger<PictureAPIController> _logger;

        public PictureAPIController(IPictureRepository pictureRepository, ILogger<PictureAPIController> logger)
        {
            _pictureRepository = pictureRepository;
            _logger = logger;
        }

        [HttpGet("mypage")]
        
        public async Task<IActionResult> MyPage()
        {
            var allPictures = await _pictureRepository.GetAll();
            if (allPictures == null)
            {
                _logger.LogError("[PictureAPIController] Could not retrieve images.");
                return NotFound("No pictures found.");
            }

            // Hent alle bilder uten å filtrere på bruker.
            var userPictures = allPictures.ToList();
            var pictureDtos = userPictures.Select(picture => new PictureDto
            {
                PictureId = picture.PictureId,
                Title = picture.Title,
                Description = picture.Description,
                UploadDate = picture.UploadDate,
                PictureUrl = picture.PictureUrl,
                UserName = picture.UserName
            });

            return Ok(pictureDtos);
        }

        [HttpGet("allpictures")]
        public async Task<IActionResult> GetAllPictures()
        {
            var pictures = await _pictureRepository.GetAll();
            if (pictures == null)
            {
                _logger.LogError("[PictureAPIController] Could not retrieve pictures.");
                return NotFound("No pictures found.");
            }

            var pictureDtos = pictures.Select(picture => new PictureDto
            {
                PictureId = picture.PictureId,
                Title = picture.Title,
                Description = picture.Description,
                UploadDate = picture.UploadDate,
                PictureUrl = picture.PictureUrl,
                UserName = picture.UserName
            });

            return Ok(pictureDtos);
        }

        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetPictureDetails(int id)
        {
            var picture = await _pictureRepository.PictureId(id);
            if (picture == null)
            {
                _logger.LogError("[PictureAPIController] Picture with id {Id} not found", id);
                return NotFound("Picture not found.");
            }

            var pictureDto = new PictureDto
            {
                PictureId = picture.PictureId,
                Title = picture.Title,
                Description = picture.Description,
                UploadDate = picture.UploadDate,
                PictureUrl = picture.PictureUrl,
                UserName = picture.UserName
            };

            return Ok(pictureDto);
        }

     [HttpPost("create")]
public async Task<IActionResult> CreatePicture([FromForm] PictureDto pictureDto)
{
    if (pictureDto == null || pictureDto.PictureFile == null)
    {
        return BadRequest("Picture data cannot be null");
    }

    // Lagre bildet til serveren
    string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
    if (!Directory.Exists(uploadsFolder))
    {
        Directory.CreateDirectory(uploadsFolder);
    }

    string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(pictureDto.PictureFile.FileName);
    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

    using (var fileStream = new FileStream(filePath, FileMode.Create))
    {
        await pictureDto.PictureFile.CopyToAsync(fileStream);
    }

    // Lagre informasjonen om bildet i databasen
    var newPicture = new Picture
    {
        Title = pictureDto.Title,
        Description = pictureDto.Description,
        UploadDate = DateTime.Now,
        PictureUrl = "/images/" + uniqueFileName // Lagre URL-en som peker til bildet
    };

    bool success = await _pictureRepository.Create(newPicture);
    if (!success)
    {
        _logger.LogWarning("[PictureAPIController] Could not create new image.");
        return StatusCode(500, "Internal server error while creating the picture.");
    }

    return CreatedAtAction(nameof(GetPictureDetails), new { id = newPicture.PictureId }, newPicture);
}




        [HttpPut("edit/{id}")]
       
        public async Task<IActionResult> EditPicture(int id, [FromForm] PictureDto updatedPictureDto)
        {
            if (id != updatedPictureDto.PictureId || updatedPictureDto == null)
            {
                return BadRequest("Invalid picture data");
            }

            var existingPicture = await _pictureRepository.PictureId(id);
            if (existingPicture == null)
            {
                _logger.LogError("[PictureAPIController] Picture with id {PictureId} not found", id);
                return NotFound("Picture not found.");
            }

            existingPicture.Title = updatedPictureDto.Title;
            existingPicture.Description = updatedPictureDto.Description;
            existingPicture.PictureUrl = updatedPictureDto.PictureUrl;

            bool success = await _pictureRepository.Edit(existingPicture);
            if (!success)
            {
                _logger.LogWarning("[PictureAPIController] Could not update the picture.");
                return StatusCode(500, "Internal server error while updating the picture.");
            }

            return Ok(existingPicture);
        }

        [HttpDelete("delete/{id}")]
        
        public async Task<IActionResult> DeletePicture(int id)
        {
            var picture = await _pictureRepository.PictureId(id);
            if (picture == null)
            {
                _logger.LogError("[PictureAPIController] Picture with id {Id} not found", id);
                return NotFound("Picture not found.");
            }

            bool success = await _pictureRepository.Delete(id);
            if (!success)
            {
                _logger.LogError("[PictureAPIController] Picture with id {Id} could not be deleted", id);
                return StatusCode(500, "Internal server error while deleting the picture.");
            }

            return NoContent();
        }
    }
}

   public class PictureController : Controller
{
    private readonly IPictureRepository _pictureRepository;
    private readonly ICommentRepository _commentRepository;
    private readonly ILogger<PictureController> _logger;

    public PictureController(IPictureRepository pictureRepository, ICommentRepository commentRepository, ILogger<PictureController> logger)
    {
        _commentRepository = commentRepository;
        _pictureRepository = pictureRepository;
        _logger = logger;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> MyPage()
    {
        var allPictures = await _pictureRepository.GetAll();
        if (allPictures == null)
        {
            _logger.LogError("[PictureController] Could not retrieve images.");
            allPictures = Enumerable.Empty<Picture>();
        }

        var userPictures = allPictures.ToList();
        var pictureViewModel = new PicturesViewModel(userPictures, "MyPage");

        ViewData["IsMyPage"] = true;
        return View("MyPage", pictureViewModel);
    }

    [HttpGet]
    public async Task<IActionResult> Picture()
    {
        var pictures = await _pictureRepository.GetAll();
        var pictureViewModel = new PicturesViewModel(pictures, "Picture");

        if (pictures == null)
        {
            _logger.LogError("[PictureController] Picture list not found.");
        }

        return View(pictureViewModel);
    }

    public async Task<IActionResult> Grid()
    {
        var pictures = await _pictureRepository.GetAll();
        var pictureViewModel = new PicturesViewModel(pictures, "Picture");

        if (pictures == null)
        {
            _logger.LogError("[PictureController] Picture list not found.");
            return NotFound("Pictures not found");
        }

        ViewData["IsMyPage"] = false;
        return View(pictureViewModel);
    }

    [HttpGet]
    [Authorize]
    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(Picture newImage, IFormFile PictureUrl)
    {
        newImage.UploadDate = DateTime.Now;

        if (!ModelState.IsValid)
        {
            return View(newImage);
        }

        if (PictureUrl != null && PictureUrl.Length > 0)
        {
            string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(PictureUrl.FileName);
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await PictureUrl.CopyToAsync(fileStream);
            }

            newImage.PictureUrl = "/images/" + uniqueFileName;
        }

        bool success = await _pictureRepository.Create(newImage);
        if (success)
        {
            return RedirectToAction(nameof(MyPage));
        }
        else
        {
            _logger.LogWarning("[PictureController] Could not create new image.");
            return View(newImage);
        }
    }

    // Resten av metodene redigert på samme måte, fjernet brukeravhengighet
    // ...

}


