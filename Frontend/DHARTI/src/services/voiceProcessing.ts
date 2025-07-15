import axios from 'axios';

const AI4BHARAT_ENDPOINT = 'https://api.ai4bharat.org';
const API_KEY = 'YOUR_AI4BHARAT_API_KEY';

export interface VoiceProcessingResult {
  text: string;
  language: string;
  confidence: number;
  intent?: {
    action: string;
    parameters: Record<string, any>;
  };
}

export const processVoiceCommand = async (audioBlob: Blob): Promise<VoiceProcessingResult> => {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  formData.append('languages', 'hi,ta,te,gu,en');
  formData.append('task', 'asr_and_intent');

  const response = await axios.post(
    `${AI4BHARAT_ENDPOINT}/asr/v1/recognize`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};