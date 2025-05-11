import React, { useState } from 'react';

const VoiceSearch = ({ onSearch }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SY'; // Arabic (Syria)
    recognition.continuous = false; // Set to true if you want it to keep listening
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Voice recognition started');
      setListening(true);
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      console.log('Voice recognized:', voiceText);
      setTranscript(voiceText);
      onSearch(voiceText); // Send result to parent
    };

    recognition.onaudiostart = () => console.log('Audio capturing started');
    recognition.onaudioend = () => console.log('Audio capturing ended');

    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
    };

    recognition.onend = () => {
      console.log('Voice recognition ended');
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div>
      <button onClick={startListening}>
        🎤 {listening ? 'Listening...' : 'Start Voice Search'}
      </button>
      {transcript && <p>You said: {transcript}</p>}
    </div>
  );
};

export default VoiceSearch;
