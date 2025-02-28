import React from 'react';
import { Facebook, ExternalLink, ClipboardCopy } from 'lucide-react';
import type { VirtualNumber } from '../types';

interface RegistrationGuideProps {
  number: VirtualNumber;
}

export function RegistrationGuide({ number }: RegistrationGuideProps) {
  const handleCopyNumber = () => {
    navigator.clipboard.writeText(number.number);
  };

  const handleOpenFacebook = () => {
    window.open('https://facebook.com/signup', '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Facebook className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Facebook Registration Guide</h3>
      </div>

      <ol className="space-y-4 mb-6">
        <li className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
            1
          </div>
          <div>
            <p className="text-gray-700">Copy your virtual number:</p>
            <button
              onClick={handleCopyNumber}
              className="mt-2 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors text-gray-700"
            >
              <span className="font-mono">{number.number}</span>
              <ClipboardCopy className="w-4 h-4" />
            </button>
          </div>
        </li>
        
        <li className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
            2
          </div>
          <div>
            <p className="text-gray-700">Visit Facebook's signup page and start registration</p>
            <button
              onClick={handleOpenFacebook}
              className="mt-2 flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
            >
              Open Facebook Signup
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
            3
          </div>
          <div className="text-gray-700">
            When prompted, enter the virtual number you copied
          </div>
        </li>

        <li className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
            4
          </div>
          <div className="text-gray-700">
            Wait for the verification code to appear below and enter it on Facebook
          </div>
        </li>
      </ol>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Keep this window open while completing registration. 
          The verification code will appear in the messages section below.
        </p>
      </div>
    </div>
  );
}