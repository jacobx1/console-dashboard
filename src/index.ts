import { getToday } from './omnifocus';
import { getInbox } from './imap';
import { createConfiguredScreen } from './gui/screen';
import { createLayout } from './gui/layout';

(async () => {
  const screen = createConfiguredScreen();
  const boxes = createLayout(screen);

  boxes[0].setContent(await getToday());
  boxes[1].setContent(await getInbox());

  screen.render();
})().catch(console.error);
