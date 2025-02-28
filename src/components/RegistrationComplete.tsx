import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { VirtualNumber } from '../types';

interface RegistrationCompleteProps {
  number: VirtualNumber;
  onReset: () => void;
}

export function RegistrationComplete({ number, onReset }: RegistrationCompleteProps) {
  return (
    <div className="w-full max-w-md text-center">
      <div className="mb-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Registration Complete!
      </h2>
      
      <p className="text-gray-600 mb-6">
        You have successfully registered using the virtual number:
        <br />
        <span className="font-medium text-gray-900">{number.number}</span>
      </p>
      
      <button
        onClick={onReset}
        className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Register Another Number
      </button>
    </div>
  );
}