import React, { useState } from "react";
import "./App.css";

function BinauralBeats() {
  const [startFreq, setStartFreq] = useState("");
  const [endFreq, setEndFreq] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [intervalSeconds, setIntervalSeconds] = useState("");
  const [message, setMessage] = useState("");

  const playContinuousBinauralBeats = (startFreq, endFreq, durationMinutes, intervalSeconds) => {
    const durationSeconds = durationMinutes * 60;
    const beatFrequency = 10; // Fixed beat frequency
    const freqStep = (endFreq - startFreq) / (durationSeconds / intervalSeconds);

    let currentFreq = startFreq;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const leftGain = audioContext.createGain();
    const rightGain = audioContext.createGain();
    leftGain.connect(audioContext.destination);
    rightGain.connect(audioContext.destination);

    // Create oscillators for continuous playback
    const leftOscillator = audioContext.createOscillator();
    const rightOscillator = audioContext.createOscillator();

    // Initialize frequencies
    leftOscillator.frequency.setValueAtTime(currentFreq + beatFrequency / 2, audioContext.currentTime);
    rightOscillator.frequency.setValueAtTime(currentFreq - beatFrequency / 2, audioContext.currentTime);

    leftOscillator.connect(leftGain);
    rightOscillator.connect(rightGain);

    leftOscillator.start();
    rightOscillator.start();

    // Update frequencies dynamically at the specified interval
    const intervalId = setInterval(() => {
      currentFreq += freqStep;

      if (currentFreq >= endFreq) {
        // Stop oscillators and clear interval when the sweep is complete
        leftOscillator.stop();
        rightOscillator.stop();
        clearInterval(intervalId);
        return;
      }

      // Update frequencies
      leftOscillator.frequency.setValueAtTime(currentFreq + beatFrequency / 2, audioContext.currentTime);
      rightOscillator.frequency.setValueAtTime(currentFreq - beatFrequency / 2, audioContext.currentTime);
    }, intervalSeconds * 1000);
  };

  const startSweep = () => {
    const startFrequency = parseFloat(startFreq);
    const endFrequency = parseFloat(endFreq);
    const duration = parseFloat(durationMinutes);
    const interval = parseFloat(intervalSeconds);

    if (isNaN(startFrequency) || isNaN(endFrequency) || isNaN(duration) || isNaN(interval)) {
      setMessage("Invalid input. Please enter numbers.");
      return;
    }

    if (startFrequency < 1 || startFrequency > 50) {
      setMessage("Start frequency must be between 1 Hz and 50 Hz.");
      return;
    }

    if (endFrequency < 20 || endFrequency > 1500) {
      setMessage("End frequency must be between 20 Hz and 1500 Hz.");
      return;
    }

    if (startFrequency >= endFrequency) {
      setMessage("Start frequency must be less than end frequency.");
      return;
    }

    setMessage("Starting frequency sweep...");
    playContinuousBinauralBeats(startFrequency, endFrequency, duration, interval);
    setMessage("Frequency sweep completed.");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Binaural Beats Frequency Sweep</h1>
      </header>
      <main className="app-main">
        <div className="form-group">
          <label htmlFor="startFreq">Start Frequency (Hz):</label>
          <input
            type="number"
            id="startFreq"
            value={startFreq}
            onChange={(e) => setStartFreq(e.target.value)}
            placeholder="Enter start frequency"
            min="1"
            max="50"
          />
        </div>
        <div className="form-group">
          <label htmlFor="endFreq">Tone(Hz):</label>
          <input
            type="number"
            id="endFreq"
            value={endFreq}
            onChange={(e) => setEndFreq(e.target.value)}
            placeholder="Enter end frequency"
            min="20"
            max="1500"
          />
        </div>
        <div className="form-group">
          <label htmlFor="durationMinutes">Duration (minutes):</label>
          <input
            type="number"
            id="durationMinutes"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            placeholder="Enter duration in minutes"
          />
        </div>
        <div className="form-group">
          <label htmlFor="intervalSeconds">Interval (seconds):</label>
          <input
            type="number"
            id="intervalSeconds"
            value={intervalSeconds}
            onChange={(e) => setIntervalSeconds(e.target.value)}
            placeholder="Enter interval in seconds"
          />
        </div>
        <button className="start-btn" onClick={startSweep}>
          Start Sweep
        </button>
        <p>{message}</p>
      </main>
    </div>
  );
}

export default BinauralBeats;