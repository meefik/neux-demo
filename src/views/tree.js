import { createState } from 'neux';
import css from '../styles/tree.module.css';

export default function () {
  const state = createState({
    tree: [{
      id: '1',
      value: 'Item 1',
      opened: true,
      data: [{
        id: '1.1',
        value: 'Item 1.1'
      }, {
        id: '1.2',
        value: 'Item 1.2',
        opened: true,
        data: [{
          id: '1.2.1',
          value: 'Item 1.2.1',
          checked: true
        }, {
          id: '1.2.2',
          value: 'Item 1.2.2'
        }]
      }, {
        id: '1.3',
        value: 'Item 1.3'
      }]
    }, {
      id: '1',
      value: 'Item 2',
      data: [{
        id: '2.1',
        value: 'Item 2.1'
      }, {
        id: '2.2',
        value: 'Item 2.2',
        data: [{
          id: '2.2.1',
          value: 'Item 2.2.1'
        }, {
          id: '2.2.2',
          value: 'Item 2.2.2'
        }]
      }]
    }]
  });
  return {
    children: () => {
      const createLeaf = (data) => {
        if (!data) return [];
        return [{
          className: css.tree,
          tagName: 'ul',
          children: data.$$each((item) => {
            return {
              tagName: 'li',
              className: () => (item.$opened ? '' : css.hidden),
              children: [{
                tagName: 'span',
                className: () => {
                  if (!item.data) return css.empty;
                  return item.$opened ? css.opened : css.closed;
                },
                on: {
                  click () {
                    return () => {
                      if (item.data) {
                        item.opened = !item.opened;
                      }
                    };
                  }
                }
              }, {
                tagName: 'input',
                type: 'checkbox',
                checked: () => item.$checked,
                on: {
                  change () {
                    return () => {
                      toggleCheckbox(item);
                    };
                  }
                }
              }, {
                tagName: 'span',
                textContent: () => item.value
              }].concat(createLeaf(item.data))
            };
          })
        }];
      };
      return createLeaf(state.tree);
    }
  };
}

function toggleCheckbox (leaf, flag) {
  leaf.checked = typeof flag === 'boolean' ? flag : !leaf.checked;
  if (Array.isArray(leaf.data)) {
    for (const item of leaf.data) {
      toggleCheckbox(item, leaf.checked);
    }
  }
}
