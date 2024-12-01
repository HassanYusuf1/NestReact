import React, { useEffect, useState, useCallback } from 'react';
import {
  fetchCommentsNote,
  createCommentNote,
  editCommentForNote,
  deleteCommentForNote,
} from './CommentServiceNote'; 
import { Comment } from '../types/Comment';
import { Note } from '../types/Note';
import { formatTimeAgo } from "../utils/dateUtils";

interface CommentTableProps { //initialize a comment prop for note
  note: Note;
  noteId: number;
}

const CommentTableNote: React.FC<CommentTableProps> = ({ note, noteId }) => {
  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');

  //Memoize loadComments using useCallback
  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCommentsNote(noteId); //Uses service method to fetch comments under note
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    loadComments(); //Always try to load comments when the component mounts
  }, [loadComments]);

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      alert('Please enter a valid comment.');
      return;
    }

    try {
      const createdComment = await createCommentNote({
        noteId: note.noteId,
        commentDescription: newComment,
        userName: 'Harry', 
      });

      setComments((prevComments) => [...prevComments, createdComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleEditComment = async (commentId: number) => { //Handles the note data
    if (!editingCommentText.trim()) {
      alert('Please enter a valid comment.');
      return;
    }

    try {
      await editCommentForNote(commentId, { commentDescription: editingCommentText }); //calls for edit method
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.commentId === commentId
            ? { ...comment, commentDescription: editingCommentText }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditingCommentText('');
    } catch (error) {
      console.error(`Error editing comment with id ${commentId}:`, error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentForNote(commentId); //Uses delete method from service
      setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
    } catch (error) {
      if (error.message.includes('Comment not found')) {
        setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
      } else {
        console.error(`Error deleting comment with id ${commentId}:`, error);
      }
    }
  };

  const toggleCommentsVisibility = () => { //Switch between showing and not showing comments under a note
    setShowComments((prev) => !prev);
  };

  return (
    <div className="picture-card-footer p-3">
      {/* Toggle Comments Visibility */}
      {comments.length > 0 && (
        <p className="text-muted">
          <button
            onClick={toggleCommentsVisibility}
            className="view-comments-link btn btn-link p-0"
            style={{ textDecoration: 'none' }}
          >
            View all {comments.length} comments
          </button>
        </p>
      )}

      {/* Hidden Comments Section */}
      {showComments && (
        <div id="all-comments" style={{ display: showComments ? 'block' : 'none' }}>
          {isLoading && <p>Loading comments...</p>}
          {error && <p className="error-message">{error}</p>}
          
          {!isLoading && !error && comments.length === 0 && (
            <p>No comments found.</p>
          )}

          {!isLoading && !error && comments.length > 0 && (
            <div className="comments-grid">
              {comments.map((comment) => (
                <div key={comment.commentId} className="comment d-flex justify-content-between align-items-center mb-2">
                  <div>
                    {editingCommentId === comment.commentId ? (
                      <>
                        <textarea
                          value={editingCommentText}
                          onChange={(e) => setEditingCommentText(e.target.value)}
                          className="form-control mb-1"
                          rows={1}
                        />
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleEditComment(comment.commentId)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditingCommentText('');
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <strong>{comment.userName.split('@')[0]}:</strong> {comment.commentDescription}
                        <p className="timestamp relative-time text-muted" data-timestamp={comment.commentTime}>
                          {formatTimeAgo(comment.commentTime)}
                        </p>
                      </>
                    )}
                  </div>

                  {editingCommentId !== comment.commentId && (
                    <div className="comment-actions">
                      <button
                        className="btn btn-link text-primary me-2 p-0 fw-bold"
                        onClick={() => {
                          setEditingCommentId(comment.commentId);
                          setEditingCommentText(comment.commentDescription);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-link text-danger p-0 fw-bold"
                        onClick={() => handleDeleteComment(comment.commentId)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Comment Section */}
      <div className="add-comment-section p-3">
        <textarea
          id="newComment"
          name="newComment"
          className="form-control mb-2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={1}
        />
        <button className="btn btn-secondary" onClick={handleCreateComment}>
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default CommentTableNote;
