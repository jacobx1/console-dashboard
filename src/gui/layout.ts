import * as blessed from 'blessed';

export const createLayout = (screen: blessed.Widgets.Screen) => {
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

  return boxes;
};
