import { createState } from '#veux';
import css from '../styles/todo.module.css';
import l10n from '../l10n';
import router from '../router';

function store(state, changes) {
  if (changes) {
    localStorage.setItem('todos', JSON.stringify(state));
  }
  return JSON.parse(localStorage.getItem('todos') || '[]');
}

export default function Todo() {
  const state = createState({
    list: []
  });
  state.list.$$sync(store);
  return {
    children: [{
      tagName: 'input',
      placeholder: () => l10n.t('todo.input'),
      autofocus: true,
      on: {
        keyup: (e) => {
          if (e.keyCode === 13) {
            e.preventDefault();
            state.list.$push({
              id: `${Date.now()}`,
              text: e.target.value
            });
            e.target.value = '';
            state.list.$$sync();
          }
        },
      }
    }, {
      tagName: 'div',
      children: [{
        tagName: 'input',
        type: 'checkbox',
        on: {
          change: (e) => {
            const checked = e.target.checked;
            state.list.forEach((item) => {
              item.$checked = checked;
            });
            state.list.$$sync();
          }
        }
      }, {
        tagName: 'label',
        textContent: () => l10n.t('todo.mark_all')
      }]
    }, {
      tagName: 'p',
      children: () => {
        return ['all', 'active', 'completed'].map((item) => {
          return {
            tagName: 'a',
            href: `${router.path}?filter=${item}`,
            style: {
              padding: '0 2px',
              color: () => {
                const filter = router.params.$filter;
                return (!filter && item === 'all') || filter === item ? 'red' : '';
              },
            },
            textContent: () => l10n.t(`todo.filter.${item}`),
          };
        });
      },
    }, {
      tagName: 'ul',
      className: css.list,
      children: () => {
        const filter = router.params.$filter;
        return state.list.$$each(item => {
          if (filter && filter !== 'all') {
            if (item.checked && filter !== 'completed') return;
            if (!item.checked && filter !== 'active') return;
          }
          return {
            tagName: 'li',
            children: [{
              tagName: 'input',
              type: 'checkbox',
              checked: () => item.$checked,
              on: {
                change: (e) => {
                  item.$checked = e.target.checked;
                  state.list.$$sync();
                }
              }
            }, {
              tagName: 'span',
              children: () => {
                return item.$editable
                  ? {
                    tagName: 'input',
                    type: 'text',
                    value: item.text,
                    on: {
                      mounted: (e) => {
                        e.target.focus();
                      },
                      input: (e) => {
                        item.$text = e.target.value;
                      },
                      change: () => {
                        state.list.$$sync();
                      },
                      blur: () => {
                        item.$editable = false;
                      },
                      keydown: (e) => {
                        if (e.keyCode === 13) {
                          e.preventDefault();
                          item.$editable = false;
                        }
                      },
                    },
                  }
                  : {
                    tagName: 'label',
                    style: {
                      textDecoration: () =>
                        item.$checked ? 'line-through' : 'none',
                    },
                    // style: () => {
                    //   return item.checked
                    //     ? { textDecoration: "line-through" }
                    //     : { textDecoration: "none" };
                    // },
                    textContent: () => item.text,
                    on: {
                      dblclick: () => {
                        item.$editable = true;
                      },
                    }
                  };
              }
            }, {
              tagName: 'a',
              href: '#',
              textContent: '[x]',
              on: {
                click: (e) => {
                  e.preventDefault();
                  const index = state.list.indexOf(item);
                  state.list.$splice(index, 1);
                  state.list.$$sync();
                }
              }
            }]
          };
        });
      }
    }, {
      textContent: () => l10n.t('todo.total', { count: state.list.$length })
    }]
  };
}