import { createState } from '#veux';
import css from '../styles/puzzle.module.css';
import l10n from '../l10n';

const SIZE = 4;

export default function () {
  const state = createState({
    matrix: createMatrix(SIZE),
    movies: 0,
    selected: null,
    win: false
  });
  return {
    children: [{
      className: css.matrix,
      style: {
        gridTemplateColumns: Array(SIZE).fill('64px').join(' ')
      },
      dataset: {
        win: () => state.win
      },
      children: () => {
        return state.matrix.$each((v, i) => {
          return {
            className: css.point,
            textContent: v,
            on: {
              click: () => {
                const sel = state.selected;
                if (sel !== null && i !== sel &&
                  ((sel === i - 1 && i % SIZE > 0) ||
                  (sel === i + 1 && (i+1) % SIZE > 0) || sel === i + SIZE || sel === i - SIZE)) {
                  const oldv = state.matrix[sel];
                  const newv = state.matrix[i];
                  state.matrix[i] = oldv;
                  state.matrix[sel] = newv;
                  state.selected = null;
                  state.movies++;
                  state.win = checkWin(state.matrix);
                } else {
                  state.selected = i;
                }
              }
            }
          };
        });
      }
    }, {
      textContent: () => l10n.t('puzzle.movies', { count: state.movies })
    }]
  };
}

function checkWin(arr) {
  for (let i = 0; i < arr.length - 2; i++) {
    if (!arr[i] || !arr[i + 1] || arr[i] >= arr[i + 1]) return false;
  }
  return true;
}

function createMatrix(size) {
  const matrix = Array(size * size - 1).fill(0).map((v, i) => (i + 1));
  matrix.sort(() => Math.random() < 0.5 ? -1 : 1);
  matrix.push('');
  return matrix;
}