import React, { useState } from 'react';
import { Star, Send, Smile, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FeedbackPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Feedback message must be at least 10 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, rating, comment })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit feedback.');

      setSuccess(true);
      setName('');
      setEmail('');
      setRating(0);
      setComment('');
    } catch (err) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 text-left">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          Share Your Feedback
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          We want to make BootBox better. Share your experiences, suggestions, or issues directly.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-[var(--border-color)]">
        
        {success ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center space-y-4"
          >
            <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
              <Smile className="h-10 w-10 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Thank You!
              </h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed">
                Your feedback has been logged successfully. It will help us optimize templates and calculators!
              </p>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-pink-600/10"
            >
              Submit Another Response
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Optional Name */}
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">Your Name (Optional)</label>
              <input
                type="text"
                placeholder="Anonymous"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-[var(--text-primary)]"
              />
            </div>

            {/* Optional Email */}
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">Your Email (Optional)</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-[var(--text-primary)]"
              />
            </div>

            {/* Star Rating Select */}
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">Select Rating (Mandatory)</label>
              <div className="flex items-center space-x-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`h-7 w-7 transition-all ${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow'
                          : 'text-pink-200 dark:text-neutral-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Comment */}
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">Your Feedback Message (Min 10 characters)</label>
              <textarea
                placeholder="Write your review, request a missing PDF converter tool, or share calculator bugs..."
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 leading-relaxed text-[var(--text-primary)]"
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-rose-600 text-xs font-bold">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-pink-600/10"
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? 'Submitting...' : 'Send Feedback'}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default FeedbackPage;
