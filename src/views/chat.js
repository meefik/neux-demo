import { createState } from '#neux';
import css from '../styles/chat.module.css';
import l10n from '../l10n';

export default function () {
  const state = createState({
    message: '',
    list: [{
      author: 'John',
      time: new Date('2023-07-01T15:00:00.000Z'),
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/132.png',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }, {
      author: 'Ann',
      time: new Date('2023-07-01T15:01:00.000Z'),
      message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }, {
      author: 'John',
      time: new Date('2023-07-01T15:02:00.000Z'),
      message: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    }, {
      author: 'Ann',
      time: new Date('2023-07-01T15:03:00.000Z'),
      message: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }],
    addMessage: (obj) => {
      return () => {
        obj.list.push({
          time: new Date(),
          author: 'Me',
          message: obj.message
        });
        obj.message = '';
      };
    }
  });
  const isMe = (author) => author === 'Me';
  return {
    children: [{
      className: css.list,
      on: {
        mounted() {
          this.dispatchEvent(new Event('scroll_down'));
        },
        scroll_down() {
          this.scrollTo(0, this.scrollHeight);
        }
      },
      children: () => {
        return state.list.$$each(item => {
          return {
            className: isMe(item.author) ? `${css.item} ${css.me}` : css.item,
            on: {
              mounted() {
                this.dispatchEvent(new Event('scroll_down', { bubbles: true }));
              }
            },
            children: [{
              className: css.avatar,
              tagName: item.image ? 'img' : 'div',
              src: item.image
            }, {
              className: css.message,
              children: [{
                className: css.header,
                children: [{
                  className: css.author,
                  textContent: item.author
                }, {
                  className: css.time,
                  textContent: item.time.toLocaleTimeString()
                }]
              }, {
                className: css.text,
                textContent: item.message
              }]
            }]
          };
        });
      }
    }, {
      className: css.toolbar,
      children: [{
        className: css.input,
        tagName: 'input',
        placeholder: () => l10n.t('chat.message'),
        autofocus: true,
        value: () => state.$message,
        on: {
          change: (e) => {
            state.message = e.target.value;
          },
          keyup: (e) => {
            if (e.keyCode === 13) {
              e.preventDefault();
              state.addMessage();
            }
          }
        }
      }, {
        tagName: 'button',
        textContent: () => l10n.t('chat.send'),
        on: {
          click: () => {
            state.addMessage();
          }
        }
      }]
    }]
  };
};