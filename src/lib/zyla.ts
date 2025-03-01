import axios from 'axios';

const ZYLA_API_URL = 'https://api.zyla.com/v1';
const API_KEY = import.meta.env.VITE_ZYLA_API_KEY;

interface ZylaNumber {
  id: string;
  phoneNumber: string;
  countryCode: string;
  status: 'active' | 'inactive';
}

interface ZylaMessage {
  id: string;
  numberId: string;
  type: 'inbound' | 'outbound';
  text: string;
  createdAt: string;
}

const zylaApi = axios.create({
  baseURL: ZYLA_API_URL,
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  }
});

export async function getAvailableNumbers(country = 'US') {
  try {
    const response = await zylaApi.get('/numbers', {
      params: { country }
    });

    return response.data.numbers.map((number: ZylaNumber) => ({
      id: number.id,
      number: number.phoneNumber,
      country: number.countryCode,
      available: number.status === 'active'
    }));
  } catch (error) {
    console.error('Error fetching Zyla numbers:', error);
    throw new Error('Failed to load available numbers');
  }
}

export async function getMessages(numberId: string) {
  try {
    const response = await zylaApi.get(`/numbers/${numberId}/messages`);
    
    return response.data.messages
      .filter((msg: ZylaMessage) => msg.type === 'inbound')
      .map((msg: ZylaMessage) => ({
        id: msg.id,
        number: numberId,
        message: msg.text,
        timestamp: new Date(msg.createdAt),
        platform: detectPlatform(msg.text)
      }));
  } catch (error) {
    console.error('Error fetching Zyla messages:', error);
    throw new Error('Failed to fetch messages');
  }
}

function detectPlatform(message: string): string {
  if (message.toLowerCase().includes('facebook')) return 'Facebook';
  if (message.toLowerCase().includes('ig') || message.toLowerCase().includes('instagram')) return 'Instagram';
  if (message.toLowerCase().includes('whatsapp')) return 'WhatsApp';
  return 'SMS';
}

export function pollForMessages(numberId: string, callback: (messages: any[]) => void) {
  let lastMessageId: string | null = null;

  const intervalId = setInterval(async () => {
    try {
      const messages = await getMessages(numberId);
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