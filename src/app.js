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

createView({
  children: [{
    className: css.header,
    children: [{
      tagName: 'span',
      textContent: () => l10n.t('title')
    }, {
      tagName: 'a',
      href: '#todo',
      textContent: () => l10n.t('menu.todo')
    }, {
      tagName: 'a',
      href: '#tictactoe',
      textContent: () => l10n.t('menu.tictactoe')
    }, {
      tagName: 'a',
      href: '#puzzle',
      textContent: () => l10n.t('menu.puzzle')
    }, {
      tagName: 'a',
      href: '#clock',
      textContent: () => l10n.t('menu.clock')
    }, {
      tagName: 'a',
      href: '#sketch',
      textContent: () => l10n.t('menu.sketch')
    }, {
      tagName: 'a',
      href: '#form',
      textContent: () => l10n.t('menu.form')
    }]
  }, {
    tagName: 'h1',
    textContent: () => l10n.t(`menu.${router.path.slice(1)}`)
  }, {
    className: css.content,
    children: () => {
      switch (router.path) {
        case '#todo':
          return {
            view: Todo
          };
        case '#tictactoe':
          return {
            view: TicTacToe
          };
        case '#puzzle':
          return {
            view: Puzzle
          };
        case '#clock':
          return {
            view: Clock
          };
        case '#sketch':
          return {
            view: Sketch
          };
        case '#form':
          return {
            view: Form
          };
        default:
          return [{
            tagName: 'p',
            textContent: () => l10n.t('error.notfound')
          }];
      }
    }
  }, {
    className: css.footer,
    children: Object.keys(l10n.t('languages', 'en')).map(lang => {
      return {
        tagName: 'button',
        className: () => l10n.lang === lang ? css.active : '',
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
      textContent: () => router.path
    })
  }]
}, document.body);