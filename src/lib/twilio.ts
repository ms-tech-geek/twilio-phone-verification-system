const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN;

const BASE_URL = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}`;

const headers = new Headers({
  'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
  'Content-Type': 'application/json'
});

export async function getAvailableNumbers(country = 'US', type = 'mobile') {
  const response = await fetch(
    `${BASE_URL}/AvailablePhoneNumbers/${country}/${type}.json`,
    { headers }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch available numbers');
  }

  const data = await response.json();
  return data.available_phone_numbers.map((number: any) => ({
    id: number.phone_number,
    number: number.phone_number,
    country: number.iso_country,
    available: true
  }));
}

export async function getMessages(phoneNumber: string) {
  const response = await fetch(
    `${BASE_URL}/Messages.json?To=${encodeURIComponent(phoneNumber)}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  const data = await response.json();
  return data.messages.map((msg: any) => ({
    id: msg.sid,
    number: msg.to,
    message: msg.body,
    timestamp: new Date(msg.date_sent),
    platform: msg.from
  }));
}

export async function pollForMessages(phoneNumber: string, callback: (messages: any[]) => void) {
  let lastMessageTime = new Date().toISOString();
  
  const poll = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Messages.json?To=${encodeURIComponent(phoneNumber)}&DateSent>=${lastMessageTime}`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.messages.length > 0) {
          const formattedMessages = data.messages.map((msg: any) => ({
            id: msg.sid,
            number: msg.to,
            message: msg.body,
            timestamp: new Date(msg.date_sent),
            platform: msg.from
          }));
          callback(formattedMessages);
          lastMessageTime = new Date().toISOString();
        }
      }
    } catch (error) {
      console.error('Error polling messages:', error);
    }
  };

  const intervalId = setInterval(poll, 5000);
  return () => clearInterval(intervalId);
}