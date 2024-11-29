import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Picture } from '../types/picture';
import { Comment } from '../types/Comment';
import { createComment, fetchComments, editComment, deleteComment } from '../Comment/CommentService';

type PictureCardProps = {
  picture: Picture;
  returnUrl: string;
};

const PictureCard: React.FC<PictureCardProps> = ({ picture, returnUrl }) => {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState<string>("");
  const [commentsVisible, setCommentsVisible] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await fetchComments(picture.pictureId);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    loadComments();
  }, [picture.pictureId]);

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      alert("Please enter a valid comment.");
      return;
    }

    try {
      const createdComment = await createComment({
        pictureId: picture.pictureId,
        commentDescription: newComment,
        userName: "currentUserName"
      });

      setComments(prevComments => [...prevComments, createdComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
    } catch (error) {
      if (error.message.includes("Comment not found")) {
        setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
      } else {
        console.error(`Error deleting comment with id ${commentId}:`, error);
      }
    }
  };

  return (
    <div className="card mb-4 shadow-sm rounded">
      <div className="card-header d-flex align-items-center justify-content-between p-2">
        <h5 className="mb-0">{picture.title}</h5>
        <small className="text-muted">{new Date(picture.uploadDate).toLocaleString()}</small>
      </div>

      <img
        src={picture.pictureUrl}
        alt={picture.title || 'Picture'}
        className="card-img-top img-fluid rounded"
        style={{ objectFit: 'cover', width: '100%', height: 'auto', maxHeight: '400px' }}
      />

      <div className="card-body">
        <p className="card-text">{picture.description}</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-warning"
            onClick={() => navigate(`/pictures/${picture.pictureId}/edit?source=${returnUrl}`)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => navigate(`/pictures/${picture.pictureId}/delete?source=${returnUrl}`)}
          >
            Delete
          </button>
          <button
            className="btn btn-primary"
            onClick={() => window.location.href = picture.pictureUrl}
          >
            Download Image
          </button>
        </div>
      </div>

      <div className="card-footer bg-white">
        {comments.length > 0 && (
          <button
            type="button"
            onClick={() => setCommentsVisible(!commentsVisible)}
            className="btn btn-link p-0 mb-2 text-muted"
          >
            {commentsVisible ? "Hide comments" : `View all ${comments.length} comments`}
          </button>
        )}

        {commentsVisible && (
          <div className="comments-section">
            {comments.map(comment => (
              <div key={comment.commentId} className="mb-2">
                <p className="mb-1"><strong>{comment.userName}</strong>: {comment.commentDescription}</p>
                <small className="text-muted">{comment.uploadDate ? new Date(comment.uploadDate).toLocaleString() : "Unknown date"}</small>
                <div className="d-flex gap-2 mt-1">
                  {comment.userName === 'currentUserName' && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteComment(comment.commentId)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="add-comment-section mt-3">
          <form onSubmit={(e) => { e.preventDefault(); handleCreateComment(); }}>
            <div className="input-group">
              <input
                id="newComment"
                name="newComment"
                className="form-control"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                required
              />
              <button className="btn btn-warning" type="submit">
                Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PictureCard;
