import React from 'react';
import { useState } from 'react';
import type { RegistrationState, VirtualNumber } from './types';
import { NumberSelector } from './components/NumberSelector';
import { OTPReceiver } from './components/OTPReceiver';
import { RegistrationComplete } from './components/RegistrationComplete';

function App() {
  const [state, setState] = useState<RegistrationState>({
    step: 'select-number',
    selectedNumber: null,
    otpMessages: []
  });

  const handleNumberSelect = (number: VirtualNumber) => {
    setState({
      ...state,
      step: 'wait-otp',
      selectedNumber: number
    });
  };

  const handleComplete = () => {
    setState({
      ...state,
      step: 'complete'
    });
  };

  const handleReset = () => {
    setState({
      step: 'select-number',
      selectedNumber: null,
      otpMessages: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Virtual Number Registration
          </h1>
          <p className="text-gray-600">
            Get a virtual phone number to register on social media platforms
          </p>
        </div>

        {state.step === 'select-number' && (
          <NumberSelector onSelect={handleNumberSelect} />
        )}

        {state.step === 'wait-otp' && state.selectedNumber && (
          <OTPReceiver
            selectedNumber={state.selectedNumber}
            onComplete={handleComplete}
          />
        )}

        {state.step === 'complete' && state.selectedNumber && (
          <RegistrationComplete
            number={state.selectedNumber}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );

}
export default App;
