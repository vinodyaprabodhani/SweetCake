import { useState } from 'react';

const ReviewItem = ({ review, user, onDelete, onEdit }) => {
  const isOwner = user && review.user_id === user.id;
  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment);
  const [submitting, setSubmitting] = useState(false);

  const renderStars = (rating, onClick) => {
    return [1,2,3,4,5].map(star => (
      <span
        key={star}
        style={{ cursor: onClick ? 'pointer' : 'default', color: star <= rating ? '#e57373' : '#ccc', fontSize: 18 }}
        onClick={onClick ? () => onClick(star) : undefined}
      >★</span>
    ));
  };

  if (editing) {
    return (
      <div className="review-card">
        <div className="review-header">
          <div className="review-avatar">{review.first_name?.[0]}</div>
          <div>
            <strong>{review.first_name} {review.last_name}</strong>
            <div className="stars">{renderStars(editRating, setEditRating)}</div>
          </div>
        </div>
        <textarea
          value={editComment}
          onChange={e => setEditComment(e.target.value)}
          rows={2}
          style={{ width: '100%', margin: '8px 0', borderRadius: 4, border: '1px solid #ddd' }}
        />
        <div>
          <button
            className="btn btn-rose btn-sm"
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              await onEdit(review.id, editRating, editComment, () => setEditing(false));
              setSubmitting(false);
            }}
          >Save</button>
          <button className="btn btn-secondary btn-sm" style={{marginLeft:8}} onClick={() => setEditing(false)} disabled={submitting}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-avatar">{review.first_name?.[0]}</div>
        <div>
          <strong>{review.first_name} {review.last_name}</strong>
          <div className="stars">{renderStars(review.rating)}</div>
        </div>
      </div>
      <p className="review-comment">{review.comment}</p>
      {isOwner && (
        <div style={{marginTop:8}}>
          <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)} style={{marginRight:8}}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(review.id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
