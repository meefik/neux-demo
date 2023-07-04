import { createView } from '#veux';
import css from './styles/app.module.css';
import l10n from './l10n';
import router from './router';
import Todo from './views/todo';
import TicTacToe from './views/tictactoe';
import Puzzle from './views/puzzle';
import Clock from './views/clock';
import Sketch from './views/sketch';
import Form from './views/form';
import Scoreboard from './views/scoreboard';

const views = {
  todo: Todo,
  tictactoe: TicTacToe,
  puzzle: Puzzle,
  clock: Clock,
  sketch: Sketch,
  form: Form,
  scoreboard: Scoreboard
};

createView({
  children: [{
    className: css.header,
    children: [{
      tagName: 'span',
      textContent: () => l10n.t('title')
    }].concat(Object.keys(views).map(view => {
      return {
        tagName: 'a',
        href: `#${view}`,
        textContent: () => l10n.t(`menu.${view}`)
      };
    }))
  }, {
    tagName: 'h1',
    textContent: () => l10n.t(`menu.${router.$path.slice(1)}`)
  }, {
    className: css.content,
    children: () => {
      const View = views[router.$path.slice(1)];
      if (View) {
        return {
          view: View
        };
      } else {
        return {
          tagName: 'p',
          textContent: () => l10n.t('error.notfound')
        };
      }
    }
  }, {
    className: css.footer,
    children: Object.keys(l10n.t('languages', 'en')).map(lang => {
      return {
        tagName: 'button',
        className: () => l10n.$lang === lang ? css.active : '',
        textContent: () => l10n.t(`languages.${lang}`, 'en'),
        on: {
          click: () => {
            l10n.lang = lang;
          }
        }
      };
    }).concat({
      tagName: 'span',
      className: css.path,
      textContent: () => router.$path
    })
  }]
}, document.body);