import React, { useEffect, useState } from 'react';
import { CheckIcon, CrownIcon } from './icons';
import { upgradeToPlan, type PlanType } from '../services/usageService';

interface SuccessPageProps {
  onContinue: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ onContinue }) => {
  const [plan, setPlan] = useState<'pro' | 'lifetime' | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Parse URL parameters to get plan type
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan') as 'pro' | 'lifetime' | null;
    const sessionId = urlParams.get('session_id');

    if (planParam && (planParam === 'pro' || planParam === 'lifetime')) {
      setPlan(planParam);

      // Upgrade the user's plan in localStorage
      upgradeToPlan(planParam);

      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);

      setIsProcessing(false);
    } else {
      // No valid plan parameter, redirect to home
      setIsProcessing(false);
    }
  }, []);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 50%, #F0FFFF 100%)'}}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 50%, #F0FFFF 100%)'}}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-6">We couldn't process your upgrade. Please try again or contact support.</p>
          <button
            onClick={onContinue}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
            style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}
          >
            Return to App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 50%, #F0FFFF 100%)'}}>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        {/* Success Animation */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{background: 'linear-gradient(135deg, #20B2AA 0%, #00D9A5 100%)'}}></div>
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, #20B2AA 0%, #00D9A5 100%)'}}>
            <CheckIcon className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Crown Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold mb-4" style={{background: 'linear-gradient(135deg, #FFB347 0%, #FF6B6B 100%)'}}>
          <CrownIcon className="w-4 h-4" />
          {plan === 'lifetime' ? 'LIFETIME ACCESS' : 'PRO MEMBER'}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Pro!
        </h1>

        <p className="text-gray-600 mb-8">
          {plan === 'lifetime'
            ? "You now have lifetime access to all Pro features. Thank you for your support!"
            : "Your Pro subscription is now active. Enjoy unlimited generations and watermark-free images!"
          }
        </p>

        {/* Benefits List */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-4">What you now have access to:</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-700">
              <CheckIcon className="w-5 h-5 mr-3 text-teal-500 flex-shrink-0" />
              <span>Unlimited listing generations</span>
            </li>
            <li className="flex items-center text-gray-700">
              <CheckIcon className="w-5 h-5 mr-3 text-teal-500 flex-shrink-0" />
              <span>Watermark-free images</span>
            </li>
            <li className="flex items-center text-gray-700">
              <CheckIcon className="w-5 h-5 mr-3 text-teal-500 flex-shrink-0" />
              <span>Priority AI generation</span>
            </li>
            <li className="flex items-center text-gray-700">
              <CheckIcon className="w-5 h-5 mr-3 text-teal-500 flex-shrink-0" />
              <span>Bulk ZIP downloads</span>
            </li>
            {plan === 'lifetime' && (
              <li className="flex items-center text-gray-700">
                <CheckIcon className="w-5 h-5 mr-3 text-teal-500 flex-shrink-0" />
                <span>Lifetime updates & new features</span>
              </li>
            )}
          </ul>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all hover:scale-105 text-lg"
          style={{background: 'linear-gradient(135deg, #20B2AA 0%, #00D9A5 100%)'}}
        >
          Start Creating
        </button>

        <p className="text-sm text-gray-500 mt-4">
          A receipt has been sent to your email.
        </p>
      </div>
    </div>
  );
};
