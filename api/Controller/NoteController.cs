using Microsoft.AspNetCore.Mvc;
using InstagramMVC.Models;
using InstagramMVC.DAL;

using InstagramMVC.DTOs;

namespace InstagramMVC.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NoteAPIController : ControllerBase
{
    private readonly ILogger<NoteAPIController> _logger;
    private readonly ICommentRepository _commentRepository;
    private readonly INoteRepository _noteRepository;

    public NoteAPIController(INoteRepository noteRepository, ICommentRepository commentRepository, ILogger<NoteAPIController> logger)
    {
        _noteRepository = noteRepository;
        _commentRepository = commentRepository;
        _logger = logger;
    }

    [HttpGet("getnotes")]
    public async Task<IActionResult> GetNotes() //method for retrieving all notes
    {
        var notes = await _noteRepository.GetAll(); //calling on repo function for all notes in database
        if (notes == null)
        {
            _logger.LogError("[NoteController] Could not retrieve notes.");
            return NotFound(new { Message = "Notes not found." });
        }
        var noteDtos = notes.Select(note => new NoteDto //uses dto
        {
            NoteId = note.NoteId,
            Title = note.Title,
            Content = note.Content,
            UploadDate = note.UploadDate
        });
        return Ok(noteDtos); //returns dto
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] NoteDto noteDto) //method for creating notes
    {
        if (noteDto == null)
        {
            return BadRequest("Note cannot be null");
        }
        var newNote = new Note //dto 
        {
            Title = noteDto.Title,
            Content = noteDto.Content,
            UploadDate = noteDto.UploadDate
        };
        await _noteRepository.Create(newNote); //Creates the note with repo  
        return CreatedAtAction(nameof(GetNotes), new { id = newNote.NoteId }, newNote);

    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetNote(int id) //Gets the note based on note id
    {
        var note = await _noteRepository.GetNoteById(id); //Calls on repo method for finding note with specific noteid
        if (note == null) //if not found
        {
            _logger.LogError("[NoteAPIController] Note not found for the NoteId {NoteId:0000}", id);
            return NotFound("Note not found for the NoteId");
        }
        return Ok(note);
    }

    [HttpPut("edit/{id}")]
    public async Task<IActionResult> Edit(int id, [FromBody] NoteDto noteDto) //edits the note with DTO
    {
        if (noteDto == null)
        {
            return BadRequest("Note data cannot be null");
        }
        //Find the note in the database
        var existingNote = await _noteRepository.GetNoteById(id);
        if (existingNote == null)
        {
            return NotFound("Note not found");
        }
        //Update the note
        existingNote.Title = noteDto.Title;
        existingNote.Content = noteDto.Content;
        existingNote.UploadDate = noteDto.UploadDate;
        //Save the changes
        await _noteRepository.Edit(existingNote);
        return Ok(existingNote); //Return the updated note
    }

    [HttpGet("details/{id}")]
    public async Task<IActionResult> Details(int id) //finds the details based on noteid
    {
        var note = await _noteRepository.GetNoteById(id); //uses repo method
        if (note == null) //if not found
        {
            return NotFound("Note not found");
        }
        return Ok(note);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        bool returnOk = await _noteRepository.Delete(id); //uses repo method for deletion which returns true if successful
        if (!returnOk)
        {
            _logger.LogError("[ItemAPIController] Item deletion failed for the ItemId {ItemId:0000}", id);
            return BadRequest("Item deletion failed");
        }
        return NoContent(); //200 Ok
    }

}
