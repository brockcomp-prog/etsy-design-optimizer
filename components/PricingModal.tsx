import React, { useEffect } from 'react';
import { CloseIcon, CheckIcon, CrownIcon } from './icons';
import { initiateCheckout, getUserState, type PlanType } from '../services/usageService';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'limit_reached' | 'remove_watermark' | 'upgrade';
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, reason = 'upgrade' }) => {
  const userState = getUserState();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const getTitle = () => {
    switch (reason) {
      case 'limit_reached':
        return "You've reached your daily limit";
      case 'remove_watermark':
        return 'Remove Watermarks';
      default:
        return 'Upgrade Your Plan';
    }
  };

  const getSubtitle = () => {
    switch (reason) {
      case 'limit_reached':
        return 'Upgrade to Pro for unlimited generations and watermark-free images.';
      case 'remove_watermark':
        return 'Get crystal-clear, professional images without watermarks.';
      default:
        return 'Unlock the full power of AI-generated Etsy listings.';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-8 pb-4 text-center" style={{background: 'linear-gradient(135deg, #FFF5F5 0%, #F0FFFF 100%)'}}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}>
            <CrownIcon className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{getTitle()}</h2>
          <p className="text-gray-600">{getSubtitle()}</p>
        </div>

        {/* Plans */}
        <div className="p-8 pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pro Monthly */}
            <div className="border-2 rounded-2xl p-6 relative" style={{borderColor: '#FF6B6B'}}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}>
                Most Popular
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">Pro Monthly</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold" style={{color: '#FF6B6B'}}>$9</span>
                <span className="text-gray-500">/month</span>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 mr-2 text-teal-500 flex-shrink-0" />
                  <span>Unlimited listing generations</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 mr-2 text-teal-500 flex-shrink-0" />
                  <span><strong>No watermarks</strong> on images</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 mr-2 text-teal-500 flex-shrink-0" />
                  <span>Priority AI generation</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 mr-2 text-teal-500 flex-shrink-0" />
                  <span>Bulk ZIP downloads</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 mr-2 text-teal-500 flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>

              <button
                onClick={() => initiateCheckout('pro')}
                className="w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all hover:scale-105"
                style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Lifetime */}
            <div className="border border-gray-200 rounded-2xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{background: 'linear-gradient(135deg, #20B2AA 0%, #00D9A5 100%)'}}>
                Best Value
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">Lifetime Access</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold" style={{color: '#20B2AA'}}>$49</span>
                <span className="text-gray-500">/once</span>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 mr-2 text-teal-500 flex-shrink-0" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 mr-2 text-teal-500 flex-shrink-0" />
                  <span><strong>One-time payment</strong></span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 mr-2 text-teal-500 flex-shrink-0" />
                  <span>Lifetime updates</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 mr-2 text-teal-500 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckIcon className="w-5 h-5 mr-2 text-teal-500 flex-shrink-0" />
                  <span>Early access to new features</span>
                </li>
              </ul>

              <button
                onClick={() => initiateCheckout('lifetime')}
                className="w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all hover:scale-105"
                style={{background: 'linear-gradient(135deg, #20B2AA 0%, #00D9A5 100%)'}}
              >
                Get Lifetime Access
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure checkout
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              30-day money-back guarantee
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
