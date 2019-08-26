import * as blessed from 'blessed';
import { getToday } from './omnifocus';
import { getInbox } from './imap';

(async () => {
  const screen = blessed.screen({
    smartCSR: true,
    sendFocus: true,
  });

  const coords = [0, '50%'];

  const boxes: blessed.Widgets.BoxElement[] = [];

  for (const top of coords) {
    for (const left of coords) {
      const box = blessed.box({
        top,
        left,
        width: '50%',
        height: '50%',
        content: 'Hello {bold}world!{/bold}!',
        tags: true,
        border: {
          type: 'line',
        },
        style: {
          fg: 'white',
          bg: 'magenta',
          border: {
            fg: '#f0f0f0',
          },
          hover: {
            bg: 'green',
          },
          focus: {
            bg: 'blue',
          },
        },
        vi: true,
        keys: true,
        alwaysScroll: true,
        scrollable: true,
        scrollbar: {
          style: {
            bg: 'yellow',
          },
        },
        focusable: true,
      });
      screen.append(box);
      boxes.push(box);
    }
  }

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
  boxes[0].setContent(await getToday());
  boxes[1].setContent(await getInbox());
  screen.render();
})().catch(console.error);
