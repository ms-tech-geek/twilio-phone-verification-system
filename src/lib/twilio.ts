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
  // Return the current message store
  return messageStore;
}

export function pollForMessages(phoneNumber: string, callback: (messages: any[]) => void) {
  // For demo purposes, simulate receiving an OTP after 10 seconds
  const timeoutId = setTimeout(() => {
    const newMessage = {
      id: Date.now().toString(),
      number: phoneNumber,
      message: "FB-SECURITY: 123456 is your Facebook code. Don't share it with anyone.",
      timestamp: new Date(),
      platform: 'Facebook'
    };
    messageStore = [...messageStore, newMessage];
    callback([newMessage]);
  }, 10000);

  return () => {
    clearTimeout(timeoutId);
    messageStore = []; // Clear message store on cleanup
  };
}