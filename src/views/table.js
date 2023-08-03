import { createState } from 'neux';
import css from '../styles/table.module.css';
import l10n from '../l10n';

export default function () {
  const pageSize = 10;
  const state = createState({
    page: 0,
    search: '',
    sort: {},
    list: () => {
      return Array(100).fill(0).map((v, i) => {
        return {
          text: `Item ${i + 1}`,
          checked: Math.random() > 0.5,
          timestamp: randomDate(new Date(2020, 0, 1), new Date()).toISOString().slice(0, 10)
        };
      });
    },
    filtered: (obj) => {
      return obj.$list.filter(item => {
        return `${item.text}`.includes(obj.$search);
      }).sort((a, b) => {
        return obj.sort.$order === 1
          ? a[obj.sort.$key] > b[obj.sort.$key] ? -1 : 1
          : a[obj.sort.$key] < b[obj.sort.$key] ? -1 : 1;
      });
    },
    splitted: (obj) => {
      const index = obj.$page * pageSize;
      return obj.$filtered.slice(index, index + pageSize);
    }
  });
  return {
    children: [{
      tagName: 'input',
      className: css.search,
      placeholder: () => l10n.t('table.search'),
      autofocus: true,
      value: () => state.$search,
      on: {
        keyup: (e) => {
          if (e.keyCode === 13) {
            e.preventDefault();
            state.search = e.target.value;
          }
        }
      }
    }, {
      className: css.table,
      tagName: 'table',
      children: () => {
        return [{
          tagName: 'thead',
          children: [{
            tagName: 'tr',
            children: () => {
              return ['text', 'checked', 'timestamp'].map(field => {
                return {
                  tagName: 'th',
                  textContent: () => {
                    if (state.sort.$order && state.sort.$key === field) {
                      return `${l10n.t('table.' + field)} ${state.sort.order === 1 ? '↑' : '↓'}`;
                    } else {
                      return `${l10n.t('table.' + field)}`;
                    }
                  },
                  on: {
                    click: () => {
                      state.sort.key = field;
                      if (!state.sort.order) state.sort.order = 1;
                      else if (state.sort.order === 1) state.sort.order = -1;
                      else if (state.sort.order === -1) state.sort.order = 0;
                    }
                  }
                };
              });
            }
          }]
        }, {
          tagName: 'tbody',
          children: () => {
            return state.$splitted.$$each((item) => {
              return {
                tagName: 'tr',
                children: [{
                  tagName: 'td',
                  textContent: () => item.$text
                }, {
                  tagName: 'td',
                  textContent: () => item.$checked ? 'Yes' : 'No'
                }, {
                  tagName: 'td',
                  textContent: () => item.$timestamp
                }]
              };
            });
          }
        }];
      }
    }, {
      children: () => {
        const numberOfPages = Math.ceil(state.$filtered.length / pageSize);
        return [{
          tagName: 'a',
          href: '#',
          textContent: '<<',
          on: {
            click: (e) => {
              e.preventDefault();
              state.page = 0;
            }
          }
        },
        ...Array(numberOfPages).fill(0).map((v, i) => {
          return {
            tagName: 'a',
            href: '#',
            textContent: `[${i + 1}]`,
            style: {
              color: () => state.$page === i ? 'red' : ''
            },
            on: {
              click: (e) => {
                e.preventDefault();
                state.page = i;
              }
            }
          };
        }),
        {
          tagName: 'a',
          href: '#',
          textContent: '>>',
          on: {
            click: (e) => {
              e.preventDefault();
              state.page = numberOfPages - 1;
            }
          }
        }];
      }
    }]
  };
}

function randomDate (start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
