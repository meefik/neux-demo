import { createState } from 'neux';
import css from '../styles/terminal.module.css';

const COMMANDS = {
  help: [
    'How to use:',
    ' ',
    ' * help - display this help',
    ' * time - display current time',
    ' * date - display current date',
    ' * clear - clear terminal',
    ' '
  ]
};

export default function () {
  const state = createState({
    lines: [
      'Command Line Interface',
      ' '
    ].concat(COMMANDS.help)
  });
  const execCmd = (text) => {
    state.lines.push(text);
    text = text.replace(/^>\s*/, '');
    switch (text) {
    case 'help':
      state.lines.push(...COMMANDS.help);
      break;
    case 'time':
      state.lines.push(new Date().toLocaleTimeString());
      break;
    case 'date':
      state.lines.push(new Date().toLocaleDateString());
      break;
    case 'clear':
      state.lines.splice(0, state.lines.length);
      break;
    default:
      state.lines.push('Command not found');
    }
  };
  return {
    className: css.terminal,
    tabindex: 0,
    on: {
      scroll_down () {
        this.scrollTo(0, this.scrollHeight);
      }
    },
    children: [{
      children: () => {
        return state.$lines.$$each(line => {
          return {
            on: {
              mounted () {
                const timeout = 10;
                let index = 0;
                let timer;
                const print = () => {
                  this.textContent = line.slice(0, index++);
                  if (index > line.length) {
                    clearTimeout(timer);
                  } else {
                    timer = setTimeout(print, timeout);
                  }
                  this.dispatchEvent(new Event('scroll_down', { bubbles: true }));
                };
                timer = setTimeout(print, timeout);
              }
            }
          };
        });
      }
    }, {
      attributes: {
        contenteditable: true
      },
      textContent: '> ',
      on: {
        mounted () {
          this.focus();
          setCaret(this);
        },
        keydown: (e) => {
          if (!e.shiftKey && e.keyCode === 13) {
            e.preventDefault();
            execCmd(e.target.textContent);
            e.target.textContent = '> ';
            setCaret(e.target);
          }
        }
      }
    }]
  };
}

function setCaret (el, pos) {
  const range = document.createRange();
  const sel = window.getSelection();

  range.setStart(el, pos || el.textContent.length - 1);
  range.collapse(true);

  sel.removeAllRanges();
  sel.addRange(range);
}
