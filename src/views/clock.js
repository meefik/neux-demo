import { createState } from 'neux';
import css from '../styles/clock.module.css';

const rotate = (rotate, fixed = 1) => `rotate(${(rotate * 360).toFixed(fixed)})`;
const getSecondsSinceMidnight = () => (Date.now() - new Date().setHours(0, 0, 0, 0)) / 1000;

const state = createState({
  time: getSecondsSinceMidnight(),
  subsecond: (obj) => rotate(obj.$time % 1),
  second: (obj) => rotate((obj.$time % 60) / 60),
  minute: (obj) => rotate(((obj.$time / 60) % 60) / 60),
  hour: (obj) => rotate(((obj.$time / 60 / 60) % 12) / 12)
});

export default function () {
  let timer;
  return {
    on: {
      mounted () {
        return () => {
          timer = setInterval(() => {
            state.time = getSecondsSinceMidnight();
          }, 50);
        };
      },
      removed () {
        return () => {
          clearInterval(timer);
        };
      }
    },
    className: css.clock,
    children: [{
      tagName: 'svg',
      attributes: {
        viewBox: '0 0 200 200'
      },
      children: [{
        tagName: 'g',
        attributes: {
          transform: 'translate(100, 100)'
        },
        children: [{
          tagName: 'circle',
          attributes: {
            class: 'text-neutral-900',
            r: '99',
            fill: 'white',
            stroke: 'currentColor'
          }
        }].concat(Line({
          numberOfLines: 60,
          className: css.subsecond,
          size: 2,
          width: 1,
          fixed: true
        })).concat(Line({
          numberOfLines: 12,
          className: css.second,
          size: 5,
          width: 2,
          fixed: true
        }))
          .concat([
            Hand({ className: css.subsecond, size: 85, width: 1, rotate: () => state.$subsecond }),
            Hand({ className: css.second, size: 80, width: 2, rotate: () => state.$second }),
            Hand({ className: css.minute, size: 70, width: 3, rotate: () => state.$minute }),
            Hand({ className: css.hour, size: 50, width: 4, rotate: () => state.$hour })
          ])
      }]
    }]
  };
}

function Line ({ numberOfLines, className, fixed, size, width }) {
  return new Array(numberOfLines).fill(0)
    .map((v, i) => {
      return Hand({ rotate: rotate(i / numberOfLines), fixed, size, width, className });
    });
}

function Hand ({ fixed, size, width, rotate, className }) {
  return {
    tagName: 'line',
    attributes: {
      class: className || '',
      y1: fixed ? size - 95 : undefined,
      y2: -(fixed ? 95 : size),
      stroke: 'currentColor',
      'stroke-width': width,
      'stroke-linecap': 'round',
      transform: rotate
    }
  };
}
