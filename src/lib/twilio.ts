// Message store for received SMS
let messageStore: {
  id: string;
  number: string;
  message: string;
  timestamp: Date;
  platform: string;
}[] = [];

export async function getAvailableNumbers(country = 'US') {
  const sampleNumbers = [
    {
      id: '1',
      number: '+16187034609',
      country: 'United States',
      available: true
    }
  ];

  return sampleNumbers;
}

export async function getMessages(phoneNumber: string) {
  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${import.meta.env.VITE_TWILIO_ACCOUNT_SID}/Messages.json`, {
      headers: {
        'Authorization': `Basic ${btoa(`${import.meta.env.VITE_TWILIO_ACCOUNT_SID}:${import.meta.env.VITE_TWILIO_AUTH_TOKEN}`)}`,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    const data = await response.json();
    
    // Filter messages sent to our number and format them
    return data.messages
      .filter((msg: any) => msg.to === phoneNumber)
      .map((msg: any) => ({
        id: msg.sid,
        number: msg.to,
        message: msg.body,
        timestamp: new Date(msg.dateCreated),
        platform: 'Facebook' // Assuming messages are from Facebook
      }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return messageStore;
  }
}

export function pollForMessages(phoneNumber: string, callback: (messages: any[]) => void) {
  // Poll for new messages every 5 seconds
  const intervalId = setInterval(async () => {
    const messages = await getMessages(phoneNumber);
    if (messages.length > messageStore.length) {
      const newMessages = messages.slice(0, messages.length - messageStore.length);
      messageStore = messages;
      callback(newMessages);
    }
  }, 5000);

  return () => clearInterval(intervalId);
}