/// <reference types="vite/client" />

interface Window {
  gameAudio?: {
    correct: HTMLAudioElement;
    wrong: HTMLAudioElement;
    coin: HTMLAudioElement;
  };
}