import React, { useState } from 'react';
import { CloseIcon, SparklesIcon } from './icons';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onSubmit: (email: string) => void;
  onClose: () => void;
}

export const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({ isOpen, onSubmit, onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    onSubmit(email);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 pb-4 text-center" style={{background: 'linear-gradient(135deg, #FFF5F5 0%, #F0FFFF 100%)'}}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}>
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Creating for Free</h2>
          <p className="text-gray-600">Enter your email to get 3 free generations per day</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 pt-6">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all text-lg"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all hover:scale-105 text-lg"
            style={{background: 'linear-gradient(135deg, #20B2AA 0%, #00D9A5 100%)'}}
          >
            Get Started Free
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            No credit card required. Upgrade anytime for unlimited access.
          </p>
        </form>
      </div>
    </div>
  );
};
