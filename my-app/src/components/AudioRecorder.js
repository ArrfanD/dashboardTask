import React, { useState, useRef } from 'react';
import RecordRTC from 'recordrtc';

const AudioRecorder = () => {
  const [recordings, setRecordings] = useState([]);
  const [transcript, setTranscript] = useState('');
  const recorder = useRef(null);
  const timeoutId = useRef(null);
  const mediaStream = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStream.current = stream;

    recorder.current = RecordRTC(stream, {
      type: 'audio',
      mimeType: 'audio/webm',
    });

    recorder.current.startRecording();
    timeoutId.current = setTimeout(stopRecording, 4000);
  };

  function downsampleBuffer(buffer, sampleRate, outSampleRate) {
    if (outSampleRate === sampleRate) {
      return buffer;
    }
    if (outSampleRate > sampleRate) {
      throw new Error('downsampling rate show be smaller than original sample rate');
    }
    const sampleRateRatio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Int16Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result.buffer;
  }
  

  const stopRecording = () => {
    recorder.current.stopRecording(() => {
      const blob = recorder.current.getBlob();
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);

      reader.onloadend = () => {
        const buffer = reader.result;
        const pcm = new Int16Array(buffer);
        const data = downsampleBuffer(pcm, 16000, 44100);
        const audioBlob = new Blob([data], { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setRecordings((prevRecordings) => [...prevRecordings, url]);
      };
      recorder.current.reset();
    });

    mediaStream.current.getTracks().forEach((track) => track.stop());
    clearTimeout(timeoutId.current);
  };

  const handleSpeechDetection = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const interimTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');

      setTranscript(interimTranscript);
    };

    recognition.onend = () => {
      const finalTranscript = transcript.trim();
      if (finalTranscript) {
        clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(stopRecording, 4000);

        if (!recorder.current) {
          startRecording();
        } else {
          recorder.current.resumeRecording();
        }
      }
    };

    recognition.start();
  };

  return (
    <div>
      <button onClick={handleSpeechDetection}>Start Recording</button>
      {transcript && (
        <div>
          <p>Spoken Text: "{transcript}"</p>
        </div>
      )}
      <ul>
        {recordings.map((recording) => (
          <li key={recording}>
            <audio controls src={recording} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AudioRecorder;