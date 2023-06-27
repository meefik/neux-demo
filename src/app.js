import { createView } from '#veux';
import css from './styles/app.module.css';
import l10n from './l10n';
import router from './router';
import Todo from './todo';
import XoGame from './xogame';

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
      href: '#xogame',
      textContent: () => l10n.t('menu.xogame')
    }, {
      tagName: 'a',
      href: '#',
      textContent: () => l10n.t('menu.page'),
      on: {
        click: (e) => {
          e.preventDefault();
          router.show('#page', { param1: '1', param2: '2' });
        }
      }
    }]
  }, {
    className: css.content,
    children: () => {
      switch (router.path) {
        case '#todo':
          return {
            view: Todo
          };
        case '#xogame':
          return {
            view: XoGame
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