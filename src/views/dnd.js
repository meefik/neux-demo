import { createState } from 'neux';
import css from '../styles/dnd.module.css';

const state = createState({
  list1: ['A', 'B', 'C'],
  list2: ['1', '2', '3']
});

export default function () {
  let dragged;
  return {
    className: css.box,
    on: {
      dragstart () {
        return (e) => {
          dragged = e.target;
        };
      },
      dragenter () {
        return (e) => {
          e.target.classList.add(css.active);
        };
      },
      dragleave () {
        return (e) => {
          e.target.classList.remove(css.active);
        };
      },
      dragover () {
        return (e) => {
          e.preventDefault();
        };
      },
      drop () {
        return (e) => {
          e.preventDefault();
          const el = e.target;
          el.classList.remove(css.active);
          if (el.classList.contains(css.row)) {
            const index = Array.from(dragged.parentNode.children).indexOf(dragged);
            if (el.dataset.list === '1') {
              const item = state.list2.splice(index, 1);
              state.list1.push(item[0]);
            }
            if (el.dataset.list === '2') {
              const item = state.list1.splice(index, 1);
              state.list2.push(item[0]);
            }
            el.appendChild(dragged);
          } else if (el.classList.contains(css.cell)) {
            const index1 = Array.from(dragged.parentNode.children).indexOf(dragged);
            const index2 = Array.from(el.parentNode.children).indexOf(el);
            if (el.parentNode.dataset.list === '1') {
              const item = state.list2.splice(index1, 1);
              state.list1.splice(index2, 0, item[0]);
            }
            if (el.parentNode.dataset.list === '2') {
              const item = state.list1.splice(index1, 1);
              state.list2.splice(index2, 0, item[0]);
            }
            el.parentNode.insertBefore(dragged, el);
          }
        };
      }
    },
    children: [{
      className: css.row,
      dataset: { list: '1' },
      children: () => {
        return state.list1.map((item) => {
          return {
            className: css.cell,
            textContent: item,
            draggable: true
          };
        });
      }
    }, {
      className: css.row,
      dataset: { list: '2' },
      children: () => {
        return state.list2.map((item) => {
          return {
            className: css.cell,
            textContent: item,
            draggable: true
          };
        });
      }
    }]
  };
}
