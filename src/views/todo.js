import { createState, createSync } from 'neux';
import css from '../styles/todo.module.css';
import l10n from '../l10n';
import router from '../router';

function syncer (newv, oldv) {
  if (!oldv) {
    return JSON.parse(localStorage.getItem('todos') || '[]');
  } else {
    localStorage.setItem('todos', JSON.stringify(newv));
  }
  return newv;
}

export default function Todo () {
  const state = createState({
    list: []
  });
  const sync = createSync(state.list, syncer, { slippage: 100 });
  sync();
  state.list.$$on('*', () => sync());
  return {
    children: [{
      tagName: 'input',
      placeholder: () => l10n.t('todo.input'),
      autofocus: true,
      on: {
        keyup () {
          return (e) => {
            if (e.keyCode === 13) {
              e.preventDefault();
              state.list.push({
                id: `${Date.now()}`,
                text: e.target.value
              });
              e.target.value = '';
            }
          };
        }
      }
    }, {
      tagName: 'div',
      children: [{
        tagName: 'input',
        type: 'checkbox',
        on: {
          change () {
            return (e) => {
              const checked = e.target.checked;
              state.list.forEach((item) => {
                item.checked = checked;
              });
            };
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
            href: `#${router.path}?filter=${item}`,
            style: {
              padding: '0 2px',
              color: () => {
                const filter = router.query.$filter;
                return (!filter && item === 'all') || filter === item ? 'red' : '';
              }
            },
            textContent: () => l10n.t(`todo.filter.${item}`)
          };
        });
      }
    }, {
      tagName: 'ul',
      className: css.list,
      children: () => {
        const filter = router.query.$filter;
        return state.list.$$each((item) => {
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
                change () {
                  return (e) => {
                    item.checked = e.target.checked;
                  };
                }
              }
            }, {
              tagName: 'span',
              children: () => {
                const view = item.$editable
                  ? {
                    tagName: 'input',
                    type: 'text',
                    value: item.text,
                    on: {
                      mounted () {
                        return (e) => {
                          e.target.focus();
                        };
                      },
                      input () {
                        return (e) => {
                          item.text = e.target.value;
                        };
                      },
                      blur () {
                        return () => {
                          item.editable = false;
                        };
                      },
                      keydown () {
                        return (e) => {
                          if (e.keyCode === 13) {
                            e.preventDefault();
                            item.editable = false;
                          }
                        };
                      }
                    }
                  }
                  : {
                    tagName: 'label',
                    style: {
                      textDecoration: () => (item.$checked ? 'line-through' : 'none')
                    },
                    textContent: () => item.text,
                    on: {
                      dblclick () {
                        return () => {
                          item.editable = true;
                        };
                      }
                    }
                  };
                return [view];
              }
            }, {
              tagName: 'a',
              href: '#',
              textContent: '[x]',
              on: {
                click () {
                  return (e) => {
                    e.preventDefault();
                    const index = state.list.indexOf(item);
                    state.list.splice(index, 1);
                  };
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
