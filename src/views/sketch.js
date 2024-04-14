import { createState } from 'neux';
import css from '../styles/sketch.module.css';

export default function () {
  const state = createState({
    size: 15,
    matrix: (obj) => createMatrix(obj.$size)
  });
  return {
    children: [{
      tagName: 'input',
      type: 'number',
      className: css.input,
      value: () => state.$size,
      attributes: {
        min: 1,
        max: 100
      },
      on: {
        change () {
          return (e) => {
            state.size = parseInt(e.target.value || 0);
          };
        }
      }
    }, {
      className: css.matrix,
      style: {
        gridTemplateColumns: () => Array(state.$size).fill('20px')
          .join(' ')
      },
      children: () => {
        return state.$matrix.map(() => {
          return {
            className: css.cell,
            on: {
              mouseenter () {
                return (e) => {
                  const el = e.target;
                  el.style.backgroundColor = randomHexColorString();
                  setTimeout(() => {
                    el.style.backgroundColor = '';
                  }, 1000);
                };
              }
            }
          };
        });
      }
    }]
  };
}

function createMatrix (size) {
  return Array(size * size).fill(0)
    .map(() => {
      return {};
    });
}

function randomHexColorString () {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
