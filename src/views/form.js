import { createState } from '#veux';
import css from '../styles/form.module.css';

export default function () {
  const state = createState();
  return {
    tagName: 'form',
    className: css.form,
    on: {
      submit: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        for (const [key, value] of formData) {
          console.log(`${key}: ${value}`);
        }
      }
    },
    children: [{
      children: [{
        tagName: 'label',
        textContent: 'Text'
      }, {
        tagName: 'input',
        type: 'text',
        name: 'text',
        on: {
          input: (e) => {
            state.$text = e.target.value;
          }
        }
      }]
    }, {
      children: [{
        tagName: 'label',
        textContent: 'Password'
      }, {
        tagName: 'input',
        type: 'password',
        name: 'password',
        on: {
          input: (e) => {
            state.$password = e.target.value;
          }
        }
      }]
    }, {
      children: [{
        tagName: 'label',
        textContent: 'Color'
      }, {
        tagName: 'input',
        type: 'color',
        name: 'color',
        on: {
          input: (e) => {
            state.$color = e.target.value;
          }
        }
      }]
    }, {
      children: [{
        tagName: 'label',
        textContent: 'Date'
      }, {
        tagName: 'input',
        type: 'date',
        name: 'date',
        on: {
          input: (e) => {
            state.$date = e.target.value;
          }
        }
      }]
    }, {
      children: [{
        tagName: 'label',
        textContent: 'Time'
      }, {
        tagName: 'input',
        type: 'time',
        name: 'time',
        on: {
          input: (e) => {
            state.$time = e.target.value;
          }
        }
      }]
    }, {
      children: [{
        tagName: 'label',
        textContent: 'Range'
      }, {
        tagName: 'input',
        type: 'range',
        name: 'range',
        on: {
          input: (e) => {
            state.$range = e.target.value;
          }
        }
      }]
    }, {
      children: [{
        tagName: 'label',
        textContent: 'Number'
      }, {
        tagName: 'input',
        type: 'number',
        name: 'number',
        on: {
          input: (e) => {
            state.$number = e.target.value;
          }
        }
      }]
    }, {
      children: [{
        tagName: 'label',
        textContent: 'Checkbox'
      }, {
        tagName: 'input',
        type: 'checkbox',
        name: 'checkbox',
        on: {
          input: (e) => {
            state.$checkbox = e.target.checked;
          }
        }
      }]
    }, {
      children: [{
        tagName: 'label',
        textContent: 'Radio 1'
      }, {
        tagName: 'input',
        type: 'radio',
        name: 'radio',
        on: {
          input: (e) => {
            if (e.target.checked) {
              state.$radio = 1;
            }
          }
        }
      }]
    }, {
      children: [{
        tagName: 'label',
        textContent: 'Radio 2'
      }, {
        tagName: 'input',
        type: 'radio',
        name: 'radio',
        on: {
          input: (e) => {
            if (e.target.checked) {
              state.$radio = 2;
            }
          }
        }
      }]
    }, {
      children: [{
        tagName: 'input',
        type: 'submit',
        value: 'Submit'
      }, {
        tagName: 'input',
        type: 'reset',
        value: 'Reset'
      }]
    }]
  };
}