using Microsoft.AspNetCore.Mvc;
using InstagramMVC.Models;
using InstagramMVC.DAL;
using InstagramMVC.ViewModels;
using Microsoft.AspNetCore.Authorization;
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
    public async Task<IActionResult> GetNotes()
    {
        var notes = await _noteRepository.GetAll();
        if (notes == null)
        {
            _logger.LogError("[NoteController] Could not retrieve notes.");
            return NotFound(new { Message = "Notes not found." });
        }
        var noteDtos = notes.Select(note => new NoteDto
        {
            NoteId = note.NoteId,
            Title = note.Title,
            Content = note.Content,
            UploadDate = note.UploadDate
        });        
        return Ok(noteDtos);
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] NoteDto noteDto)
    {
        if (noteDto == null)
        {
            return BadRequest("Note cannot be null");
        }
        var newNote= new Note
        {
            Title = noteDto.Title,
            Content = noteDto.Content,
            UploadDate = noteDto.UploadDate
        };        
        await _noteRepository.Create(newNote);
        return CreatedAtAction(nameof(GetNotes), new { id = newNote.NoteId }, newNote);

    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetNote(int id)
    {
        var note = await _noteRepository.GetNoteById(id);
        if (note == null)
        {
            _logger.LogError("[NoteAPIController] Note not found for the NoteId {NoteId:0000}", id);
            return NotFound("Note not found for the NoteId");
        }
        return Ok(note);
    }

    [HttpPut("edit/{id}")]
    public async Task<IActionResult> Edit(int id, [FromBody] NoteDto noteDto)
    {
        if (noteDto == null)
        {
            return BadRequest("Note data cannot be null");
        }
        // Find the note in the database
        var existingNote = await _noteRepository.GetNoteById(id);
        if (existingNote == null)
        {
            return NotFound("Note not found");
        }
        // Update the note properties
        existingNote.Title = noteDto.Title;
        existingNote.Content = noteDto.Content;
        existingNote.UploadDate = noteDto.UploadDate;
        // Save the changes
        await _noteRepository.Edit(existingNote);
        return Ok(existingNote); // Return the updated note
    }

    [HttpGet("details/{id}")]
    public async Task<IActionResult> Details(int id)
    {
        var note = await _noteRepository.GetNoteById(id);
        if (note == null)
        {
            return NotFound("Note not found");
        }
        return Ok(note);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        bool returnOk = await _noteRepository.Delete(id);
        if (!returnOk)
        {
            _logger.LogError("[ItemAPIController] Item deletion failed for the ItemId {ItemId:0000}", id);
            return BadRequest("Item deletion failed");
        }
        return NoContent(); // 200 Ok is commonly used when the server returns a response body with additional information about the result of the request. 
    }   

}
public class NoteController : Controller 
{
    private readonly ILogger<NoteController> _logger;
    private readonly ICommentRepository _commentRepository;
    private readonly INoteRepository _noteRepository;
    public NoteController(INoteRepository noteRepository, ICommentRepository commentRepository, ILogger<NoteController> logger)
    {
        _noteRepository = noteRepository;
        _commentRepository = commentRepository;
        _logger = logger;
    }

[HttpGet]
[Authorize]
public async Task<IActionResult> MyPage()
{

    var allNotes = await _noteRepository.GetAll();
    if (allNotes == null)
    {
        _logger.LogError("[NoteController] Could not retrieve notes for user");
        return NotFound();
    }

    
    ViewData["IsMyPage"] = true; // Set the source for MyPage

    return View("MyPage");
}


    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Delete(int id, string source = "Notes")
    {
        var note = await _noteRepository.GetNoteById(id);
        if (note == null)
        {
            _logger.LogError("[NoteController] Note not found for the NoteId: {NoteId}", id);
            return NotFound();
        }


        TempData["Source"] = source; // Store source in TempData
        return View(note);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> DeleteConfirmed(int id, string source)
    {
        var note = await _noteRepository.GetNoteById(id);
        if (note == null)
        {
            _logger.LogError("[NoteController] Note for deletion not found for the NoteId: {NoteId}", id);
            return NotFound();
        }

        await _noteRepository.DeleteConfirmed(id);

        // Redirect to the correct page based on the Source parameter
        return RedirectToAction(source == "MyPage" ? "MyPage" : "Notes");
    }

    [HttpGet]
    [Authorize]
    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(Note note)
    {
        if (ModelState.IsValid)
        {
            await _noteRepository.Create(note);
            return RedirectToAction(nameof(MyPage));
        }
        _logger.LogWarning("[NoteController] Creating Note failed {@note}", note);
        return View(note);
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Edit(int id, string source = "Notes")
    {
        var note = await _noteRepository.GetNoteById(id);
        if (note == null)
        {
            _logger.LogError("[NoteController] Note not found for NoteId {NoteId}", id);
            return NotFound();
        }

        TempData["Source"] = source; // Store source in TempData for use in redirection
        return View(note);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Edit(Note note, string source)
    {
        if (!ModelState.IsValid)
        {
            TempData["Source"] = source; // Preserve source value in case of validation error
            _logger.LogWarning("[NoteController] Note update failed due to invalid ModelState {@note}", note);
            return View(note);
        }

        var existingNote = await _noteRepository.GetNoteById(note.NoteId);
        if (existingNote == null)
        {
            _logger.LogError("[NoteController] Note not found for update. NoteId: {NoteId}", note.NoteId);
            return NotFound();
        }


        existingNote.Title = note.Title;
        existingNote.Content = note.Content;
        existingNote.UploadDate = DateTime.Now;

        await _noteRepository.Edit(existingNote);

        // Redirect to the correct page based on the Source parameter
        return RedirectToAction(source == "MyPage" ? "MyPage" : "Notes");
    }


   [HttpGet]
[Authorize]
public async Task<IActionResult> Notes()
{
    var notes = await _noteRepository.GetAll();
    var notesViewModel = new NotesViewModel(notes, "Notes");
    if (notes == null)
    {
        _logger.LogError("[NoteController] Note List not found when running _noteRepository.GetAll()");
        return NotFound("Note List not found.");
    }
    
    
    ViewData["IsMyPage"] = false; // Set the source for general feed
    
    return View(notesViewModel);
}

    [HttpGet]
    public async Task<IActionResult> Details(int id, string source = "Notes")
    {
        var note = await _noteRepository.GetNoteById(id);
        if (note == null)
        {
            _logger.LogError("[NoteController] Note not found for the NoteId: {NoteId}", id);
            return NotFound("Note not found for the NoteId");
        }

        ViewBag.Source = source; // Lagre source i ViewBag for bruk i visningen
        return View("Details", note);
    }

}
