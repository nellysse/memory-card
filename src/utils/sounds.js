// Sound effects utility using Web Audio API

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  playSound(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.value = volume;

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  flip() {
    this.playSound(400, 0.1, 'sine', 0.2);
  }

  match() {
    // Success chord
    this.playSound(523.25, 0.15, 'sine', 0.25); // C5
    setTimeout(() => this.playSound(659.25, 0.15, 'sine', 0.25), 50); // E5
    setTimeout(() => this.playSound(783.99, 0.2, 'sine', 0.25), 100); // G5
  }

  mismatch() {
    this.playSound(200, 0.2, 'sawtooth', 0.15);
  }

  win() {
    // Victory fanfare
    const notes = [523.25, 587.33, 659.25, 783.99, 1046.50]; // C-D-E-G-C
    notes.forEach((note, i) => {
      setTimeout(() => this.playSound(note, 0.3, 'sine', 0.3), i * 100);
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const soundManager = new SoundManager();
