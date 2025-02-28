import React, { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw } from 'lucide-react';
import type { OTPMessage, VirtualNumber } from '../types';
import { getMessages, pollForMessages } from '../lib/twilio';
import { RegistrationGuide } from './RegistrationGuide';

interface OTPReceiverProps {
  selectedNumber: VirtualNumber;
  onComplete: () => void;
}

export function OTPReceiver({ selectedNumber, onComplete }: OTPReceiverProps) {
  const [messages, setMessages] = useState<OTPMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    fetchMessages();

    // Start polling for new messages
    const stopPolling = pollForMessages(selectedNumber.number, (newMessages) => {
      setMessages((prev) => [...prev, ...newMessages]);
    });

    return () => stopPolling();
  }, [selectedNumber]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const newMessages = await getMessages(selectedNumber.number);
      setMessages(newMessages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => fetchMessages();

  return (
    <div className="w-full max-w-md">
      <RegistrationGuide number={selectedNumber} />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Waiting for OTP</h2>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="font-medium text-gray-900">{selectedNumber.number}</div>
          <div className="text-sm text-gray-500">{selectedNumber.country}</div>
        </div>

        <div className="divide-y divide-gray-200">
          {messages.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-pulse">
                <div className="mb-2">Waiting for verification code from Facebook...</div>
                <div className="text-sm">Enter your details on Facebook to receive the code</div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-600">
                    SMS from {message.platform}
                  </span>
                  <span className="text-sm text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-900">{message.message}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
          {error}
        </div>
      )}

      {messages.length > 0 && (
        <button
          onClick={onComplete}
          className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Complete Registration
        </button>
      )}
    </div>
  );
}