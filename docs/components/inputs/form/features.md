# Inputs >> Form >> Features ||20

```js script
import { html } from '@lion/core';
import { Required } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import '@lion/input/define';
import '@lion/form/define';
```

## Submit & Reset

To submit a form, use a regular button (or `LionButtonSubmit`) somewhere inside the native `<form>`.

Then, add a `submit` handler on the `lion-form`.

You can use this event to do your own (pre-)submit logic, like getting the serialized form data and sending it to a backend API.

Another example is checking if the form has errors, and focusing the first field with an error.

To fire a submit from JavaScript, select the `lion-form` element and call `.submit()`.

```js preview-story
export const formSubmit = () => {
  loadDefaultFeedbackMessages();

  const submitHandler = ev => {
    if (ev.target.hasFeedbackFor.includes('error')) {
      const firstFormElWithError = ev.target.formElements.find(el =>
        el.hasFeedbackFor.includes('error'),
      );
      firstFormElWithError.focus();
      return;
    }
    const formData = ev.target.serializedValue;
    fetch('/api/foo/', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  };
  const submitViaJS = ev => {
    // Call submit on the lion-form element, in your own code you should use
    // a selector that's not dependent on DOM structure like this one.
    ev.target.previousElementSibling.submit();
  };
  return html`
    <lion-form @submit=${submitHandler}>
      <form @submit=${ev => ev.preventDefault()}>
        <lion-input
          name="first_name"
          label="First Name"
          .validators="${[new Required()]}"
        ></lion-input>
        <lion-input
          name="last_name"
          label="Last Name"
          .validators="${[new Required()]}"
        ></lion-input>
        <div style="display:flex">
          <button>Submit</button>
          <button
            type="button"
            @click=${ev => ev.currentTarget.parentElement.parentElement.parentElement.resetGroup()}
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
    <button @click=${submitViaJS}>Explicit submit via JavaScript</button>
  `;
};
```
