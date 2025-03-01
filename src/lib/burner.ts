import axios from 'axios';

const BURNER_API_URL = 'https://api.burnerapp.com/v2';
const API_KEY = import.meta.env.VITE_BURNER_API_KEY;

interface BurnerLine {
  id: string;
  phone_number: string;
  country_code: string;
  active: boolean;
}

interface BurnerMessage {
  id: string;
  line_id: string;
  direction: 'inbound' | 'outbound';
  content: string;
  created_at: string;
}

const burnerApi = axios.create({
  baseURL: BURNER_API_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export async function getAvailableNumbers(country = 'US') {
  try {
    const response = await burnerApi.get('/lines', {
      params: { country_code: country }
    });

    return response.data.lines.map((line: BurnerLine) => ({
      id: line.id,
      number: line.phone_number,
      country: line.country_code,
      available: line.active
    }));
  } catch (error) {
    console.error('Error fetching Burner numbers:', error);
    throw new Error('Failed to load available numbers');
  }
}

export async function getMessages(lineId: string) {
  try {
    const response = await burnerApi.get(`/lines/${lineId}/messages`);
    
    return response.data.messages
      .filter((msg: BurnerMessage) => msg.direction === 'inbound')
      .map((msg: BurnerMessage) => ({
        id: msg.id,
        number: lineId,
        message: msg.content,
        timestamp: new Date(msg.created_at),
        platform: detectPlatform(msg.content)
      }));
  } catch (error) {
    console.error('Error fetching Burner messages:', error);
    throw new Error('Failed to fetch messages');
  }
}

function detectPlatform(message: string): string {
  if (message.toLowerCase().includes('facebook')) return 'Facebook';
  if (message.toLowerCase().includes('ig') || message.toLowerCase().includes('instagram')) return 'Instagram';
  return 'SMS';
}

export function pollForMessages(lineId: string, callback: (messages: any[]) => void) {
  let lastMessageId: string | null = null;

  const intervalId = setInterval(async () => {
    try {
      const messages = await getMessages(lineId);
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