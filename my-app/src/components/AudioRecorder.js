import React, { useState, useEffect } from 'react';
import RecordRTC from 'recordrtc';

const AudioRecorder = () => {
  const [recordRTC, setRecordRTC] = useState(null);
  const [recording, setRecording] = useState(false);
  const [base64Chunks, setBase64Chunks] = useState([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = RecordRTC(stream, {
      type: 'audio',
      mimeType: 'audio/webm',
      sampleRate: 44100,
      numberOfAudioChannels: 1,
    });

    recorder.startRecording();

    const speechRecognition = new window.webkitSpeechRecognition();
    speechRecognition.lang = 'en-US';

    let chunks = [];

    speechRecognition.onstart = () => {
      setRecording(true);
      chunks = [];
    };

    speechRecognition.onresult = (event) => {
      const result = event.results[event.resultIndex];
      const transcript = result[0].transcript;

      chunks.push(transcript);

      if (!recorder) {
        return;
      }

      if (result.isFinal) {
        recorder.stopRecording(() => {
          const blob = recorder.getBlob();
          const reader = new FileReader();

          reader.readAsDataURL(blob);

          reader.onloadend = () => {
            setBase64Chunks((prevChunks) => [...prevChunks, reader.result]);
            startRecording();
          };
        });
      }
    };

    speechRecognition.onspeechend = () => {
      setTimeout(() => {
        speechRecognition.stop();
      }, 7000);
    };

    speechRecognition.start();

    setRecordRTC(recorder);
  };

  const stopRecording = () => {
    recordRTC.stopRecording(() => {
      setRecording(false);
      setRecordRTC(null);
    });
  };

  useEffect(() => {
    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  const handleRecordButtonClick = () => {
    if (!recording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  console.log('base chunks', base64Chunks)

  return (
    <div>
      <button onClick={handleRecordButtonClick}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div>
        {base64Chunks.map((base64Chunk, index) => (
          <div key={index}>{base64Chunk}</div>
        ))}
      </div>
    </div>
  );
};

export default AudioRecorder;
