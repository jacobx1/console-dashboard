import * as osa2 from 'osa2';

declare var Application;
declare var ObjectSpecifier;

// https://discourse.omnigroup.com/t/export-perspective-on-mac-to-readable-text/44172/2
export const getToday = osa2(() => {
  return (() => {
    'use strict';

    // main :: IO ()
    const main = () => {
      // USER DATA
      const strPerspectiveName = 'Today';
      const appOF = Application('OmniFocus'),
        win = appOF.defaultDocument.documentWindows()[0];

      win.perspectiveName = strPerspectiveName;
      const trees = win.content.trees();

      const treeNodes = fmapPureTreesOF(x => {
        const item = x.value();
        const isTask = ObjectSpecifier.classOf(item) === 'task';
        const taskTags = isTask ? item.tags().map(x => x.name()) : [];
        return {
          text: isTask ? item.name() : x.name(),
          note: isTask ? item.note() : '',
          tags: {
            tags: taskTags.length > 0 ? taskTags : '',
            due: isTask ? isoLocal(item.dueDate()) : '',
            // flag: isTask ? item.flagged() : ''
          },
        };
      }, trees);

      return taskPaperFromTrees(treeNodes);
    };

    // GENERIC -----------------------------------------------------------------
    // https://github.com/RobTrew/prelude-jxa
    // JS - Apps

    // fmapPureTreesOF :: (OFTree -> a) -> [OFTree] -> [Tree OFItem]
    const fmapPureTreesOF = (f, xs) => {
      const go = x => Node(f(x), x.trees.length > 0 ? x.trees().map(go) : []);
      return concatMap(go, xs);
    };

    // isoLocal :: Date -> String
    const isoLocal = dte =>
      dte instanceof Date
        ? (() => {
            const xs = [
              'FullYear',
              'Month',
              'Date',
              'Hours',
              'Minutes', //, 'Seconds', 'Milliseconds'
            ].map((k, i) => {
              const s = (dte['get' + k]() + (i === 1 ? 1 : 0)).toString();
              return (s.length === 1 ? '0' : '') + s;
            });
            return (
              xs.slice(0, 3).join('-') +
              (xs[3] !== '00' || xs[4] !== '00'
                ? ' ' + xs.slice(3).join(':')
                : '')
            );
          })()
        : undefined;

    // taskPaperFromTrees :: [Tree] -> String
    const taskPaperFromTrees = xs => {
      const rgxSpace = /\s+/g,
        go = (strIndent, ts) =>
          foldl(
            (a, x) => {
              const nest = x.nest,
                root = x.root,
                txt = root.text,
                name = root.name,
                tags = root.tags,
                ks = Boolean(tags) ? Object.keys(tags) : [],
                note = root.note,
                blnName = Boolean(name),
                blnNotes = Boolean(note),
                blnTags = ks.length > 0,
                blnNest = nest.length > 0,
                blnData =
                  Boolean(txt) ||
                  ks.length > 0 ||
                  blnNotes ||
                  blnNest ||
                  blnName,
                strNext = '\t' + strIndent;

              return blnData
                ? a +
                    strIndent +
                    '- ' +
                    (root.text || '') +
                    (blnTags
                      ? foldl(
                          (t, k) => {
                            const v = tags[k];
                            return (
                              t +
                              (Boolean(v)
                                ? ' @' +
                                  k.replace(rgxSpace, '_') +
                                  (Boolean(v) && v !== true
                                    ? '(' + v + ')'
                                    : '')
                                : '')
                            );
                          },
                          '',
                          ks
                        )
                      : '') +
                    '\n' +
                    (blnNotes
                      ? unlines(map(s => strNext + s, lines(note))) + '\n'
                      : '') +
                    (blnNest ? go(strNext, nest) : '')
                : a;
            },
            '',
            ts
          );
      return go('', xs);
    };

    // JS - Prelude

    // Node :: a -> [Tree a] -> Tree a
    const Node = (v, xs) => ({
      type: 'Node',
      root: v, // any type of value (but must be consistent across tree)
      nest: xs || [],
    });

    // concatMap :: (a -> [b]) -> [a] -> [b]
    const concatMap = (f, xs) => [].concat.apply([], xs.map(f));

    // foldl :: (a -> b -> a) -> a -> [b] -> a
    const foldl = (f, a, xs) => xs.reduce(f, a);

    // lines :: String -> [String]
    const lines = s => s.split(/[\r\n]/);

    // map :: (a -> b) -> [a] -> [b]
    const map = (f, xs) => xs.map(f);

    // unlines :: [String] -> String
    const unlines = xs => xs.join('\n');

    // JXA MAIN ----------------------------------------------------------------
    return main();
  })();
});
