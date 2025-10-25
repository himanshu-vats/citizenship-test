'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [includeScreenshot, setIncludeScreenshot] = useState(true);
  const [screenshot, setScreenshot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const captureScreenshot = async () => {
    try {
      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      return null;
    }
  };

  const handleOpen = async () => {
    setIsOpen(true);
    if (includeScreenshot) {
      const screenshotData = await captureScreenshot();
      setScreenshot(screenshotData);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFeedback('');
    setEmail('');
    setScreenshot(null);
    setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback,
          email,
          screenshot: includeScreenshot ? screenshot : null,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Feedback submission failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Feedback Button - Bottom Right */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        title="Send Feedback"
        aria-label="Send Feedback"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        {/* Tooltip */}
        <span className="absolute bottom-full mb-2 right-0 bg-gray-900 text-white text-xs px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Send Feedback
        </span>
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleClose}>
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send Feedback</h2>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
                  Help us improve your experience
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-all"
              >
                <svg className="w-6 h-6 text-gray-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Feedback Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  What&apos;s on your mind? <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Describe your feedback, issue, or suggestion..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 resize-none"
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Your Email <span className="text-gray-400 dark:text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5">
                  We&apos;ll only use this to follow up on your feedback
                </p>
              </div>

              {/* Screenshot Toggle */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <input
                  type="checkbox"
                  id="includeScreenshot"
                  checked={includeScreenshot}
                  onChange={(e) => setIncludeScreenshot(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="includeScreenshot" className="flex-1 text-sm cursor-pointer">
                  <span className="font-semibold text-gray-900 dark:text-white block">Include screenshot</span>
                  <span className="text-gray-600 dark:text-slate-400">
                    Helps us understand the context of your feedback
                  </span>
                </label>
              </div>

              {/* Screenshot Preview */}
              {includeScreenshot && screenshot && (
                <div className="border-2 border-gray-200 dark:border-slate-600 rounded-lg p-2">
                  <img
                    src={screenshot}
                    alt="Screenshot preview"
                    className="w-full rounded"
                  />
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 text-center">
                    Screenshot will be included with your feedback
                  </p>
                </div>
              )}

              {/* Submit Status */}
              {submitStatus === 'success' && (
                <div className="p-3 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 rounded-r">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                    ✓ Thank you! Your feedback has been sent.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                    ✗ Failed to send feedback. Please try again.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !feedback.trim()}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Feedback'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
