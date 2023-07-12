import { createView } from '#neux';
import css from './styles/app.module.css';
import l10n from './l10n';
import router from './router';
import Todo from './views/todo';
import TicTacToe from './views/tictactoe';
import Puzzle from './views/puzzle';
import Clock from './views/clock';
import Sketch from './views/sketch';
import Form from './views/form';
import Table from './views/table';
import Chat from './views/chat';
import DnD from './views/dnd';
import Terminal from './views/terminal';
import Tree from './views/tree';

const views = {
  todo: Todo,
  tictactoe: TicTacToe,
  puzzle: Puzzle,
  clock: Clock,
  sketch: Sketch,
  form: Form,
  table: Table,
  chat: Chat,
  dnd: DnD,
  terminal: Terminal,
  tree: Tree
};

createView({
  className: css.app,
  children: [{
    className: css.sidebar,
    children: [{
      tagName: 'h1',
      textContent: () => l10n.t('title')
    }, {
      className: css.menu,
      children: Object.keys(views).map(view => {
        return {
          tagName: 'a',
          href: `#${view}`,
          style: {
            color: () => router.$path === view ? 'red' : ''
          },
          textContent: () => l10n.t(`menu.${view}`)
        };
      })
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
      })
    }]
  }, {
    className: css.content,
    children: () => {
      const View = views[router.$path];
      return [{
        tagName: 'h2',
        textContent: () => l10n.t(`menu.${router.$path}`)
      }, View ? {
        view: View
      }: {
        tagName: 'p',
        textContent: () => l10n.t('error.notfound')
      }];
    }
  }]
}, document.body);