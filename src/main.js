import { createView } from 'neux';
import css from './styles/app.module.css';
import Logo from './images/logo.svg?raw';
import l10n from './l10n';
import router from './router';
import NotFound from './views/notfound';
import Todo from './views/todo';
import TicTacToe from './views/tictactoe';
import Puzzle from './views/puzzle';
import Clock from './views/clock';
import Sketch from './views/sketch';
import Table from './views/table';
import Chat from './views/chat';
import DnD from './views/dnd';
import Terminal from './views/terminal';
import Tree from './views/tree';

const views = {
  notfound: NotFound,
  todo: Todo,
  tictactoe: TicTacToe,
  puzzle: Puzzle,
  clock: Clock,
  sketch: Sketch,
  table: Table,
  chat: Chat,
  dnd: DnD,
  terminal: Terminal,
  tree: Tree
};

createView({
  className: css.rows,
  children: [{
    className: css.cols,
    children: [{
      className: css.sidebar,
      children: [{
        node: Logo,
        classList: [css.logo]
      }, {
        className: css.rows,
        tagName: 'nav',
        children: Object.keys(views).map((view) => {
          return {
            tagName: 'a',
            href: `#${view}`,
            style: {
              color: () => (router.$path === view ? 'red' : '')
            },
            textContent: () => l10n.t(`menu.${view}`)
          };
        })
      }, {
        className: css.footer,
        children: l10n.locales.map((lang) => {
          return {
            tagName: 'button',
            className: () => (l10n.$lang === lang ? css.active : ''),
            textContent: () => l10n.t('language', lang),
            on: {
              click: () => {
                return () => {
                  l10n.lang = lang;
                };
              }
            }
          };
        })
      }]
    }, {
      className: css.content,
      children: [{
        tagName: 'h2',
        textContent: () => l10n.t(`menu.${router.$path}`) || l10n.t('notfound.title')
      }, {
        children: () => {
          const view = views[router.$path] || NotFound;
          return [view()];
        }
      }]
    }]
  }]
}, { target: document.body });
