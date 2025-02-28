export interface VirtualNumber {
  id: string;
  number: string;
  country: string;
  available: boolean;
}

export interface OTPMessage {
  id: string;
  number: string;
  message: string;
  timestamp: Date;
  platform: string;
}

export interface RegistrationState {
  step: 'select-number' | 'wait-otp' | 'complete';
  selectedNumber: VirtualNumber | null;
  otpMessages: OTPMessage[];
}