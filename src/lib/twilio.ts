import { Device } from 'twilio-client';

const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const TWILIO_API_KEY = import.meta.env.VITE_TWILIO_API_KEY;
const TWILIO_API_SECRET = import.meta.env.VITE_TWILIO_API_SECRET;

let device: Device | null = null;

export async function initializeTwilio() {
  if (!device) {
    device = new Device();
    
    try {
      // Get capability token from your backend
      const response = await fetch('https://www.twilio.com/console/voice/runtime/testing-tools/capability-token');
      const token = await response.text();
      await device.setup(token);
    } catch (error) {
      console.error('Failed to initialize Twilio:', error);
      throw new Error('Failed to initialize Twilio client');
    }
  }
  return device;
}

export async function getAvailableNumbers(country = 'US') {
  // Since we can't directly call Twilio's REST API from the browser,
  // we'll use sample numbers for demonstration
  const sampleNumbers = [
    {
      id: '1',
      number: '+1 (555) 0123',
      country: 'United States',
      available: true
    },
    {
      id: '2',
      number: '+44 7700 900123',
      country: 'United Kingdom',
      available: true
    },
    {
      id: '3',
      number: '+81 80-1234-5678',
      country: 'Japan',
      available: true
    }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return sampleNumbers;
}

export async function getMessages(phoneNumber: string) {
  // Simulate message retrieval
  const messages = [
    {
      id: Date.now().toString(),
      number: phoneNumber,
      message: 'Your verification code is: 123456',
      timestamp: new Date(),
      platform: 'Instagram'
    }
  ];

  await new Promise(resolve => setTimeout(resolve, 1000));
  return messages;
}

export function pollForMessages(phoneNumber: string, callback: (messages: any[]) => void) {
  // Simulate receiving new messages
  const intervalId = setInterval(() => {
    const newMessage = {
      id: Date.now().toString(),
      number: phoneNumber,
      message: `Your verification code is: ${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date(),
      platform: ['Instagram', 'Facebook', 'Twitter'][Math.floor(Math.random() * 3)]
    };
    callback([newMessage]);
  }, 30000); // Simulate new message every 30 seconds

  return () => clearInterval(intervalId);
}