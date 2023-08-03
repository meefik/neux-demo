import { createState } from 'neux';
import css from '../styles/tictactoe.module.css';

const SIZE = 5;

export default function () {
  const state = createState({
    current: '',
    matrix: createMatrix(SIZE)
  });
  return {
    children: [{
      className: css.grid,
      style: {
        gridTemplateColumns: `repeat(${SIZE}, 64px)`
      },
      children: () => {
        return state.matrix.$$each(line => {
          return {
            children: () => {
              return line.$$each((cell) => {
                return {
                  tagName: 'button',
                  className: css.cell,
                  style: {
                    color: () => cell.$mark === 'x' ? 'red' : 'blue',
                    backgroundColor: () => cell.$win ? 'yellow' : ''
                  },
                  textContent: () => cell.$mark,
                  on: {
                    click: () => {
                      if (!cell.mark && !state.win) {
                        state.current = state.current === 'x' ? 'o' : 'x';
                        cell.mark = state.current;
                        if (checkMatrix(state.matrix)) state.win = true;
                      }
                    }
                  }
                };
              });
            }
          };
        });
      }
    }]
  };
}

function createMatrix (size) {
  return Array(size).fill(0).map(() =>
    Array(size).fill(0).map(() => ({}))
  );
}

function checkLine (line) {
  let match = true;
  const mark = line[0].mark;
  for (let i = 0; i < line.length; i++) {
    if (!line[i].mark || line[i].mark !== mark) {
      match = false;
      break;
    }
  }
  return match;
}

function markWin (line) {
  for (let i = 0; i < line.length; i++) {
    line[i].win = true;
  }
  return true;
}

function checkMatrix (matrix) {
  const diagonal1 = [];
  const diagonal2 = [];
  const inverted = createMatrix(matrix.length);
  for (let i = 0; i < matrix.length; i++) {
    const column = matrix[i];
    if (checkLine(column)) return markWin(column);
    diagonal1.push(column[i]);
    diagonal2.push(column[column.length - i - 1]);
    for (let j = 0; j < column.length; j++) {
      inverted[j][i] = column[j];
    }
  }
  if (checkLine(diagonal1)) return markWin(diagonal1);
  if (checkLine(diagonal2)) return markWin(diagonal2);
  for (let i = 0; i < inverted.length; i++) {
    const column = inverted[i];
    if (checkLine(column)) return markWin(column);
  }
}
