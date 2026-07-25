export const defaultSettings = {
  speed: 3,
  fontSize: 32,
  isDarkMode: true,
  isMirrorMode: false,
  lineHeight: 1.8,
};

export const SPEED_MIN = 1;
export const SPEED_MAX = 10;
export const FONT_MIN = 16;
export const FONT_MAX = 72;

export const KEYBOARD_SHORTCUTS = [
  { key: 'Space', label: 'Play / Pause', category: 'Playback' },
  { key: 'ArrowUp', label: 'Speed +', category: 'Playback' },
  { key: 'ArrowDown', label: 'Speed -', category: 'Playback' },
  { key: '+' / '=', label: 'Font Size +', category: 'Display' },
  { key: '-', label: 'Font Size -', category: 'Display' },
  { key: 'F', label: 'Fullscreen', category: 'Display' },
  { key: 'M', label: 'Mirror Mode', category: 'Display' },
  { key: 'D', label: 'Dark / Light', category: 'Display' },
  { key: 'R', label: 'Reset Scroll', category: 'Playback' },
  { key: 'Escape', label: 'Exit Fullscreen', category: 'Display' },
];

export const SAMPLE_TEXT = `Welcome to the Web Teleprompter!

This is a professional teleprompter tool designed for presentations, speeches, recordings, and live broadcasts.

You can paste your own script, import a TXT file, or load a DOCX document. The text will scroll automatically at your chosen speed.

Use the controls on the left to adjust font size, scrolling speed, and display options. Enable mirror mode for professional teleprompter setups.

Keyboard shortcuts are available for hands-free control. You can also use voice commands when speech recognition is enabled.

Try saying "Start" to begin scrolling, "Pause" to stop, "Faster" or "Slower" to adjust speed.

Tip: Press F for fullscreen mode to eliminate distractions and focus on your delivery.`;
