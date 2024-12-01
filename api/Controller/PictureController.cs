using Microsoft.AspNetCore.Mvc;
using InstagramMVC.Models;
using InstagramMVC.DAL;
using InstagramMVC.DTOs;


namespace InstagramMVC.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PictureAPIController : ControllerBase //Initialize controllerBase
    {
        private readonly IPictureRepository _pictureRepository;
        private readonly ILogger<PictureAPIController> _logger;

        public PictureAPIController(IPictureRepository pictureRepository, ILogger<PictureAPIController> logger)
        {
            _pictureRepository = pictureRepository;
            _logger = logger;
        }

        [HttpGet("mypage")]
        public async Task<IActionResult> MyPage() //Method for showing all the user's notes 
        {
            var allPictures = await _pictureRepository.GetAll(); //Uses repository from
            if (allPictures == null)
            {
                _logger.LogError("[PictureAPIController] Could not retrieve images.");
                return NotFound("No pictures found.");
            }

            //Get all pictures with DTO
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
        public async Task<IActionResult> GetAllPictures() //Gets all pictures 
        {
            var pictures = await _pictureRepository.GetAll(); //uses repo method
            if (pictures == null)
            {
                _logger.LogError("[PictureAPIController] Could not retrieve pictures.");
                return NotFound("No pictures found.");
            }

            var pictureDtos = pictures.Select(picture => new PictureDto //initialize new variable
            {
                PictureId = picture.PictureId,
                Title = picture.Title,
                Description = picture.Description,
                UploadDate = picture.UploadDate,
                PictureUrl = picture.PictureUrl,
                UserName = picture.UserName
            });

            return Ok(pictureDtos); //returns the dto
        }

        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetPictureDetails(int id) //method for getting the details from a picture
        {
            var picture = await _pictureRepository.PictureId(id); //uses method from picture repo
            if (picture == null) //if not found
            {
                _logger.LogError("[PictureAPIController] Picture with id {Id} not found", id);
                return NotFound("Picture not found.");
            }

            var pictureDto = new PictureDto //new dto variable with picture variables found from repo
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
        public async Task<IActionResult> CreatePicture([FromForm] PictureDto pictureDto) //method for creating picture and takes in dto
        {
            if (pictureDto == null || pictureDto.PictureFile == null) //if dto is not valid or not found
            {
                return BadRequest("Picture data cannot be null");
            }

            //Save picture to server
            string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
            if (!Directory.Exists(uploadsFolder)) //creates folder under wwwroot if not exist
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(pictureDto.PictureFile.FileName);
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create)) //copies the file
            {
                await pictureDto.PictureFile.CopyToAsync(fileStream);
            }

            //Save new information about the picture in the database
            var newPicture = new Picture
            {
                Title = pictureDto.Title,
                Description = pictureDto.Description,
                UploadDate = DateTime.Now,
                PictureUrl = $"{Request.Scheme}://{Request.Host}/images/{uniqueFileName}"
            };

            bool success = await _pictureRepository.Create(newPicture); //returns true if successful
            if (!success)
            {
                _logger.LogWarning("[PictureAPIController] Could not create new image.");
                return StatusCode(500, "Internal server error while creating the picture.");
            }

            return CreatedAtAction(nameof(GetPictureDetails), new { id = newPicture.PictureId }, newPicture);
        }




        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditPicture(int id, [FromForm] PictureDto updatedPictureDto) //method for editing picture details
        {
            if (updatedPictureDto == null || id != updatedPictureDto.PictureId) //if not found
            {
                return BadRequest("Invalid picture data");
            }

            var existingPicture = await _pictureRepository.PictureId(id); //uses picture repo method to find exact picture
            if (existingPicture == null)
            {
                _logger.LogError("[PictureAPIController] Picture with id {PictureId} not found", id);
                return NotFound("Picture not found.");
            }

            //Updates the title and description
            existingPicture.Title = updatedPictureDto.Title;
            existingPicture.Description = updatedPictureDto.Description; 

            //If a new file is uploaded, update picture-URL
            if (updatedPictureDto.PictureFile != null)
            {
                string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                if (!Directory.Exists(uploadsFolder)) //create new directory if no folder under wwwroot
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(updatedPictureDto.PictureFile.FileName);
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await updatedPictureDto.PictureFile.CopyToAsync(fileStream);
                }

                existingPicture.PictureUrl = "/images/" + uniqueFileName; //Updates URL when new image is saved 
            }

            bool success = await _pictureRepository.Edit(existingPicture); //calls on function for editing the picture
            if (!success)
            {
                _logger.LogWarning("[PictureAPIController] Could not update the picture.");
                return StatusCode(500, "Internal server error while updating the picture.");
            }

            return Ok(existingPicture);
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeletePicture(int id) //deleting picture
        {
            var picture = await _pictureRepository.PictureId(id);
            if (picture == null)
            {
                _logger.LogError("[PictureAPIController] Picture with id {Id} not found", id);
                return NotFound("Picture not found.");
            }

            if (!string.IsNullOrEmpty(picture.PictureUrl)) //checks for picture url
            {
                try
                {
                    Uri pictureUri = new Uri(picture.PictureUrl); 
                    string fileName = Path.GetFileName(pictureUri.LocalPath);
                    string fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", fileName);

                    _logger.LogInformation("Full file path for deletion: {Path}", fullPath);

                    if (System.IO.File.Exists(fullPath)) //deletes picture if file path exists
                    {
                        System.IO.File.SetAttributes(fullPath, FileAttributes.Normal);
                        System.IO.File.Delete(fullPath);
                        _logger.LogInformation("Picture file at {Path} deleted successfully", fullPath);
                    }
                    else 
                    {
                        _logger.LogWarning("Picture file at {Path} was not found on the server", fullPath);
                    }
                }
                catch (Exception ex) //catch if not found
                {
                    _logger.LogError(ex, "Failed to delete picture file from URL {PictureUrl}", picture.PictureUrl);
                    return StatusCode(500, "Failed to delete the picture file from the server.");
                }
            }

            bool success = await _pictureRepository.Delete(id); //calls on picture repo method for deletion
            if (!success)
            {
                _logger.LogError("[PictureAPIController] Picture with id {Id} could not be deleted from the database", id);
                return StatusCode(500, "Internal server error while deleting the picture.");
            }

            return NoContent();
        }




    }
}

