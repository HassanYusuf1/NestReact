using Microsoft.AspNetCore.Mvc;
using InstagramMVC.Models;
using InstagramMVC.DAL;
using InstagramMVC.DTOs;


namespace InstagramMVC.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentAPIController : ControllerBase //initialize controllerbase 
    {
        private readonly ICommentRepository _commentRepository;
        private readonly ILogger<CommentAPIController> _logger;

        public CommentAPIController(ICommentRepository commentRepository, ILogger<CommentAPIController> logger)
        {
            _commentRepository = commentRepository;
            _logger = logger;
        }

        [HttpGet("getcomments/picture/{pictureId}")]
        public async Task<IActionResult> GetCommentsByPictureId(int pictureId)
        {
            var comments = await _commentRepository.GetAll(); //Get comments using repository method
            var filteredComments = comments.Where(c => c.PictureId == pictureId).ToList();

            if (!filteredComments.Any()) //if no comments there
            {
                _logger.LogWarning("[CommentAPIController] No comments found for pictureId {PictureId}", pictureId);
                return Ok(new List<Comment>()); //returns the list of comment
            }

            return Ok(filteredComments);
        }



        [HttpGet("getcomments/note/{noteId}")]
        public async Task<IActionResult> GetCommentsByNoteId(int noteId)
        {
            var comments = await _commentRepository.GetAll(); //Retrieves all the comments under notes
            var filteredComments = comments.Where(c => c.NoteId == noteId).ToList(); //filters it

            if (!filteredComments.Any()) //if no comments under chosen note
            {
                _logger.LogWarning("[CommentAPIController] No comments found for noteId {NoteId}", noteId);
                return Ok(new List<Comment>()); //Returns the comments as a list
            }

            return Ok(filteredComments);
        }





        [HttpPost("create")]
        public async Task<IActionResult> CreateComment([FromBody] CommentDto commentDto) //takes in dto as argument on creation
        {
            if (commentDto == null)
            {
                return BadRequest("Comment data cannot be null"); //Model has to be valid
            }

            // Check that only one of the ids are set
            if ((commentDto.PictureId == null && commentDto.NoteId == null) ||
                (commentDto.PictureId != null && commentDto.NoteId != null))
            {
                return BadRequest("Either PictureId or NoteId must be specified, but not both.");
            }

            var newComment = new Comment //initialize the variables
            {
                PictureId = commentDto.PictureId,
                NoteId = commentDto.NoteId,
                CommentDescription = commentDto.CommentDescription,
                CommentTime = DateTime.Now,
                UserName = commentDto.UserName
            };

            try
            {
                await _commentRepository.Create(newComment); //uses repository method
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[CommentAPIController] Could not create comment.");
                return StatusCode(500, "Internal server error while creating the comment.");
            }

            return CreatedAtAction(nameof(CreateComment), new { id = newComment.CommentId }, newComment);
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditComment(int id, [FromBody] CommentDto updatedCommentDto) //takes in dto on edit metho
        {
            if (updatedCommentDto == null || id != updatedCommentDto.CommentId) //has to be found in database
            {
                return BadRequest("Invalid comment data");
            }

            var existingComment = await _commentRepository.GetCommentById(id); //finds the comment with repo method
            if (existingComment == null) //if not found
            {
                _logger.LogError("[CommentAPIController] Comment with id {CommentId} not found", id);
                return NotFound("Comment not found.");
            }

            existingComment.CommentDescription = updatedCommentDto.CommentDescription; //sets new description
            existingComment.CommentTime = DateTime.Now;

            var success = await _commentRepository.Edit(existingComment); //returns a bool after post to database
            if (!success)
            {
                _logger.LogWarning("[CommentAPIController] Could not update the comment.");
                return StatusCode(500, "Internal server error while updating the comment.");
            }

            return Ok(existingComment);
        }

        

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteComment(int id) //method for deletion
        {
            var comment = await _commentRepository.GetCommentById(id); //finds the comment by its id
            if (comment == null) //if comment not found
            {
                _logger.LogError("[CommentAPIController] Comment with id {CommentId} not found", id);
                return NotFound("Comment not found.");
            }

            var success = await _commentRepository.Delete(id); //Deletes with repo method and returns true if successful
            if (!success)
            {
                _logger.LogError("[CommentAPIController] Comment with id {CommentId} could not be deleted", id);
                return StatusCode(500, "Internal server error while deleting the comment.");
            }

            return NoContent();
        }
    }
}


