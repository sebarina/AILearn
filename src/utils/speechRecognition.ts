// Add type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

interface SpeechRecognitionResult {
  text: string;
  isFinal: boolean;
}

class SpeechRecognitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SpeechRecognitionError';
  }
}

export const startSpeechRecognition = (
  onResult: (result: SpeechRecognitionResult) => void,
  onError: (error: Error) => void,
  options: SpeechRecognitionOptions = {}
): (() => void) => {
  // Check if browser supports SpeechRecognition
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    throw new SpeechRecognitionError('Speech recognition is not supported in this browser.');
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // Configure recognition options
  recognition.lang = options.language || 'zh-CN';
  recognition.continuous = options.continuous ?? true;
  recognition.interimResults = options.interimResults ?? true;
  recognition.maxAlternatives = options.maxAlternatives ?? 1;

  // Handle results
  recognition.onresult = (event: any) => {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript;
    
    onResult({
      text: transcript,
      isFinal: result.isFinal
    });
  };

  // Handle errors
  recognition.onerror = (event: any) => {
    onError(new Error(`Speech recognition error: ${event.error}`));
  };

  // Start recognition
  recognition.start();

  // Return a function to stop recognition
  return () => {
    recognition.stop();
  };
};

// Example usage:
/*
const stopRecognition = startSpeechRecognition(
  (result) => {
    if (result.isFinal) {
      console.log('Final result:', result.text);
    } else {
      console.log('Interim result:', result.text);
    }
  },
  (error) => {
    console.error('Error:', error);
  },
  {
    language: 'zh-CN',
    continuous: true,
    interimResults: true
  }
);

// To stop recognition:
// stopRecognition();
*/ 