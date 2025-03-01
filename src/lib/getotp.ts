import axios from 'axios';

const GETOTP_API_URL = 'https://api.getotp.dev/v1';
const API_KEY = import.meta.env.VITE_GETOTP_API_KEY;

interface GetOTPNumber {
  id: string;
  phone_number: string;
  country: string;
  status: string;
}

interface GetOTPMessage {
  id: string;
  phone_number: string;
  message: string;
  created_at: string;
  service: string;
}

const getotpApi = axios.create({
  baseURL: GETOTP_API_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export async function getAvailableNumbers(country = 'US') {
  try {
    const response = await getotpApi.get('/numbers/available', {
      params: { country }
    });

    return response.data.numbers.map((number: GetOTPNumber) => ({
      id: number.id,
      number: number.phone_number,
      country: number.country,
      available: number.status === 'active'
    }));
  } catch (error) {
    console.error('Error fetching GetOTP numbers:', error);
    throw new Error('Failed to load available numbers');
  }
}

export async function getMessages(phoneNumber: string) {
  try {
    const response = await getotpApi.get(`/messages`, {
      params: { phone_number: phoneNumber }
    });
    
    return response.data.messages.map((msg: GetOTPMessage) => ({
      id: msg.id,
      number: msg.phone_number,
      message: msg.message,
      timestamp: new Date(msg.created_at),
      platform: msg.service || detectPlatform(msg.message)
    }));
  } catch (error) {
    console.error('Error fetching GetOTP messages:', error);
    throw new Error('Failed to fetch messages');
  }
}

function detectPlatform(message: string): string {
  if (message.toLowerCase().includes('facebook')) return 'Facebook';
  if (message.toLowerCase().includes('ig') || message.toLowerCase().includes('instagram')) return 'Instagram';
  if (message.toLowerCase().includes('whatsapp')) return 'WhatsApp';
  return 'SMS';
}

export function pollForMessages(phoneNumber: string, callback: (messages: any[]) => void) {
  let lastMessageId: string | null = null;

  const intervalId = setInterval(async () => {
    try {
      const messages = await getMessages(phoneNumber);
      const newMessages = lastMessageId
        ? messages.filter(msg => msg.id > lastMessageId)
        : messages;

      if (newMessages.length > 0) {
        lastMessageId = newMessages[newMessages.length - 1].id;
        callback(newMessages);
      }
    } catch (error) {
      console.error('Error polling messages:', error);
    }
  }, 5000);

  return () => clearInterval(intervalId);
}