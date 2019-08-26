import * as blessed from 'blessed';
export const createConfiguredScreen = () => {
  const screen = blessed.screen({
    smartCSR: true,
    sendFocus: true,
  });

  // Quit on Escape, q, or Control-C.
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });
  screen.key(['tab'], function(ch, key) {
    return screen.focusNext();
  });
  screen.key(['S-tab'], () => {
    screen.focusPrevious();
  });

  return screen;
};
