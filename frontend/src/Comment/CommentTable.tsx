import React, { useEffect, useState } from 'react';
import { fetchComments } from './CommentService';
import { Comment } from '../types/Comment';

interface CommentTableProps {
  pictureId: number; // Identifier for the specific picture
}

const CommentTable: React.FC<CommentTableProps> = ({ pictureId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors if any
        const data = await fetchComments(pictureId);

        if (data.length === 0) {
          setError('No comments found.');
        } else {
          setComments(data);
        }
      } catch (err: any) {
        setError('Error fetching comments. Please try again later.');
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [pictureId]);

  if (loading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="comments-grid">
      <h2>Comments</h2>
      <div className="grid">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.commentId} className="comment-card">
              <p>{comment.commentDescription}</p>
              <p className="text-muted small">
                {new Date(comment.uploadDate).toLocaleString()}
              </p>
              <p className="text-muted small">by {comment.userName}</p>
            </div>
          ))
        ) : (
          <p>No comments found.</p>
        )}
      </div>
    </div>
  );
};

export default CommentTable;
