// client/src/components/complaints/ReplyModal.jsx
import React, { useState } from 'react';

const ReplyModal = ({ complaint, onClose, onSubmitReply }) => {
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) {
            setError('Reply cannot be empty.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        const success = await onSubmitReply(replyText); // Call the submit function from props
        setIsSubmitting(false);
        // Optionally close modal only on success, handled by parent might be better
        // if (success) {
        //     onClose();
        // } else {
        //    setError('Failed to submit reply. Please try again.'); // Or error comes from onSubmitReply
        // }
    };

    // Simple modal structure using fixed position and overlay
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                 {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold disabled:opacity-50"
                    aria-label="Close modal"
                >
                    ×
                </button>

                <h2 className="text-xl font-semibold mb-4 text-gray-800">Reply to Complaint</h2>
                <div className='mb-4 p-3 bg-gray-50 border rounded'>
                    <p className='text-sm text-gray-600'><span className='font-medium'>Subject:</span> {complaint?.subject}</p>
                    <p className='text-xs text-gray-500 mt-1'><span className='font-medium'>Submitted By:</span> {complaint?.submittedBy?.name || 'N/A'}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="replyText" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Reply: <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="replyText"
                            name="replyText"
                            rows="4"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                            placeholder="Enter your reply here..."
                            value={replyText}
                            onChange={(e) => { setReplyText(e.target.value); setError(''); }} // Clear error on type
                            required
                            disabled={isSubmitting}
                        ></textarea>
                         {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-150 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Reply'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReplyModal;