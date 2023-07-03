import { createState } from '#veux';
import css from '../styles/scoreboard.module.css';

window.state = createState({
  list: [1,2,3]
});

export default function() {
  const state = createState({
    list: [
      { name: 'Mark', score: 1, color: 'red' },
      { name: 'Troy', score: 2, color: 'blue' },
      { name: 'Jenny', score: 3, color: 'yellow' },
      { name: 'David', score: 4, color: 'green' }
    ],
    sorted: (obj) => {
      console.log('sorted')
      const arr = obj.list.$clone();
      arr.sort((a, b) => a.score > b.score ? 1 : -1);
      return arr;
    }
  });
  let timer;
  return {
    tagName: 'ol',
    className: css.list,
    on: {
      mounted: () => {
        timer = setInterval(() => {
          const size = state.list.length;
          const scores = Array.from(Array(size), (_, i) => i + 1);
          scores.sort(() => Math.random() > 0.5 ? -1 : 1);
          scores.forEach((v, i) => {
            state.list[i].score = v;
          });
          console.log('aaa')
          state.$emit('sorted');
        }, 3000);
      },
      removed: () => {
        clearInterval(timer);
      }
    },
    children: () => {
      return state.sorted.$each(item => {
        return {
          tagName: 'li',
          children: [{
            tagName: 'span',
            style: {
              backgroundColor: item.color,
              marginRight: '10px'
            },
            textContent: () => `${item.score}.`
          }, {
            tagName: 'span',
            textContent: () => item.name
          }]
        };
      });
    }
  };
}