import { createState } from 'neux';
import css from '../styles/dnd.module.css';

export default function () {
  const state = createState({
    list1: ['A', 'B', 'C'],
    list2: ['1', '2', '3']
  });
  let dragged;
  return {
    className: css.box,
    on: {
      dragstart (e) {
        dragged = e.target;
      },
      dragenter (e) {
        e.target.classList.add(css.active);
      },
      dragleave (e) {
        e.target.classList.remove(css.active);
      },
      dragover (e) {
        e.preventDefault();
      },
      drop (e) {
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
        console.log(state.list1, state.list2);
      }
    },
    children: [{
      className: css.row,
      dataset: { list: '1' },
      children: () => {
        return state.list1.map((item, index) => {
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
        return state.list2.map((item, index) => {
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
