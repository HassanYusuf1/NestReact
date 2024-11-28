using Microsoft.AspNetCore.Mvc;
using InstagramMVC.Models;
using InstagramMVC.DAL;
using InstagramMVC.DTOs;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace InstagramMVC.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentAPIController : ControllerBase
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
            // Først sjekk om pictureId er gyldig
            var pictureIdResult = await _commentRepository.GetPictureId(pictureId);
            if (pictureIdResult == null)
            {
                _logger.LogError("[CommentAPIController] Could not retrieve pictureId {PictureId}", pictureId);
                return NotFound("Picture ID not found for the specified picture.");
            }

            // Hvis gyldig, hent kommentarene for pictureId
            var comments = await _commentRepository.GetAll();
            var filteredComments = comments.Where(c => c.PictureId == pictureId).ToList();

            if (!filteredComments.Any())
            {
                _logger.LogError("[CommentAPIController] No comments found for pictureId {PictureId}", pictureId);
                return NotFound("No comments found for the specified picture.");
            }

            return Ok(filteredComments);
        }


       
       [HttpGet("getcomments/note/{noteId}")]
        public async Task<IActionResult> GetCommentsByNoteId(int noteId)
        {
            // Først sjekk om noteId er gyldig
            var noteIdResult = await _commentRepository.GetNoteId(noteId);
            if (noteIdResult == null)
            {
                _logger.LogError("[CommentAPIController] Could not retrieve noteId {NoteId}", noteId);
                return NotFound("Note ID not found for the specified note.");
            }

            // Hvis gyldig, hent kommentarene for noteId
            var comments = await _commentRepository.GetAll();
            var filteredComments = comments.Where(c => c.NoteId == noteId).ToList();

            if (!filteredComments.Any())
            {
                _logger.LogError("[CommentAPIController] No comments found for noteId {NoteId}", noteId);
                return NotFound("No comments found for the specified note.");
            }

            return Ok(filteredComments);
        }




        [HttpPost("create")]
        public async Task<IActionResult> CreateComment([FromBody] CommentDto commentDto)
        {
            if (commentDto == null)
            {
                return BadRequest("Comment data cannot be null");
            }

            // Sjekk at enten PictureId eller NoteId er satt, men ikke begge.
            if ((commentDto.PictureId == null && commentDto.NoteId == null) ||
                (commentDto.PictureId != null && commentDto.NoteId != null))
            {
                return BadRequest("Either PictureId or NoteId must be specified, but not both.");
            }

            var newComment = new Comment
            {
                PictureId = commentDto.PictureId,
                NoteId = commentDto.NoteId,
                CommentDescription = commentDto.CommentDescription,
                CommentTime = DateTime.Now,
                UserName = commentDto.UserName
            };

            try
            {
                await _commentRepository.Create(newComment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[CommentAPIController] Could not create comment.");
                return StatusCode(500, "Internal server error while creating the comment.");
            }

            return CreatedAtAction(nameof(CreateComment), new { id = newComment.CommentId }, newComment);
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditComment(int id, [FromBody] CommentDto updatedCommentDto)
        {
            if (updatedCommentDto == null || id != updatedCommentDto.CommentId)
            {
                return BadRequest("Invalid comment data");
            }

            var existingComment = await _commentRepository.GetCommentById(id);
            if (existingComment == null)
            {
                _logger.LogError("[CommentAPIController] Comment with id {CommentId} not found", id);
                return NotFound("Comment not found.");
            }

            existingComment.CommentDescription = updatedCommentDto.CommentDescription;
            existingComment.CommentTime = DateTime.Now;

            var success = await _commentRepository.Edit(existingComment);
            if (!success)
            {
                _logger.LogWarning("[CommentAPIController] Could not update the comment.");
                return StatusCode(500, "Internal server error while updating the comment.");
            }

            return Ok(existingComment);
        }

        [HttpGet("delete/confirm/{id}")]
        public async Task<IActionResult> ConfirmDeleteComment(int id)
        {
            var comment = await _commentRepository.GetCommentById(id);
            if (comment == null)
            {
                _logger.LogError("[CommentAPIController] Comment with id {CommentId} not found", id);
                return NotFound("Comment not found.");
            }

            return Ok(comment);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _commentRepository.GetCommentById(id);
            if (comment == null)
            {
                _logger.LogError("[CommentAPIController] Comment with id {CommentId} not found", id);
                return NotFound("Comment not found.");
            }

            var success = await _commentRepository.Delete(id);
            if (!success)
            {
                _logger.LogError("[CommentAPIController] Comment with id {CommentId} could not be deleted", id);
                return StatusCode(500, "Internal server error while deleting the comment.");
            }

            return NoContent();
        }
    }
}


