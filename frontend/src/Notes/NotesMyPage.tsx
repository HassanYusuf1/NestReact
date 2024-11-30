import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllNotes } from "./NoteService";
import {
  fetchCommentsNote,
  createCommentNote,
} from "../Comment/CommentServiceNote";
import { Note } from "../types/Note";
import { Comment } from "../types/Comment";
import { Button } from "react-bootstrap";
import { formatTimeAgo } from "../utils/dateUtils";
import '../layout.css'

const NotesMyPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [visibleComments, setVisibleComments] = useState<{
    [key: number]: boolean;
  }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllNotes();
        setNotes(data);
      } catch (err) {
        setError("Could not load notes. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadAllComments = async () => {
      const allComments: { [key: number]: Comment[] } = {};
      for (const note of notes) {
        const noteComments = await fetchCommentsNote(note.noteId!);
        allComments[note.noteId!] = noteComments;
      }
      setComments(allComments);
    };

    if (notes.length > 0) {
      loadAllComments();
    }
  }, [notes]);

  const handleCreateComment = async (noteId: number) => {
    const commentDescription = newComment[noteId]?.trim();
    if (!commentDescription) {
      alert("Please enter a valid comment.");
      return;
    }

    try {
      const createdComment = await createCommentNote({
        noteId,
        commentDescription,
        userName: "currentUserName", // Replace with actual username
      });

      setComments((prev) => ({
        ...prev,
        [noteId]: [...(prev[noteId] || []), createdComment],
      }));

      setNewComment((prev) => ({ ...prev, [noteId]: "" })); // Clear the input
    } catch (error) {
      console.error("Error creating comment for note:", error);
    }
  };

  const toggleComments = (noteId: number) => {
    setVisibleComments((prev) => ({
      ...prev,
      [noteId]: !prev[noteId], // Toggle visibility for the specific note
    }));
  };

  if (loading) {
    return <p>Loading notes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h1 className="text-center mb-4">My Notes</h1>
      <div className="row">
        {notes.map((note) => (
          <div key={note.noteId} className="col-12 col-md-6 mb-4">
            <div className="card shadow-sm" style={{ minHeight: "300px" }}>
              <div className="card-body">
                <h4 className="card-title">{note.title}</h4>
                <p className="card-text">{note.content}</p>
                <p className="card-subtitle mb-2 text-muted">
                  Uploaded: {formatTimeAgo(note.uploadDate)}
                </p>
                <div className="d-flex justify-content-start gap-1 ">
                  <Button
                    onClick={() => navigate(`/edit/${note.noteId}`)}
                    className="btn btn-warning btn-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => navigate(`/NotesDetails/${note.noteId}`)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="card-footer p-3">
                {/* Toggle Comments */}
                <button
                  type="button"
                  onClick={() => toggleComments(note.noteId)}
                  className="btn btn-link p-0 text-muted view-comments-link"
                >
                  {visibleComments[note.noteId]
                    ? `Hide comments (${comments[note.noteId]?.length || 0})`
                    : `View comments (${comments[note.noteId]?.length || 0})`}
                </button>

                {/* Comments Section */}
                {visibleComments[note.noteId] && (
                  <div className="comments-section mt-3">
                    {comments[note.noteId]?.map((comment) => (
                      <div
                        key={comment.commentId}
                        className="d-flex justify-content-between mb-2"
                      >
                        <div>
                          <p className="mb-1">
                            <strong>{comment.userName}</strong>:{" "}
                            {comment.commentDescription}
                          </p>
                          <small className="text-muted">
                            {formatTimeAgo(comment.uploadDate)}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Section */}
                <form
                  className="comment-form mt-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateComment(note.noteId!);
                  }}
                >
                  <textarea
                    className="comment-textarea form-control mb-2"
                    value={newComment[note.noteId] || ""}
                    onChange={(e) =>
                      setNewComment((prev) => ({
                        ...prev,
                        [note.noteId]: e.target.value,
                      }))
                    }
                    placeholder="Write a comment..."
                  />
                  <button type="submit" className="btn btn-primary btn-sm">
                    Comment
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 text-center">
        <button
          className="btn btn-primary btn-lg rounded-pill shadow-sm"
          onClick={() => navigate("/notescreate")}
        >
          📤 Upload New Note
        </button>
      </div>
    </div>
  );
};

export default NotesMyPage;
