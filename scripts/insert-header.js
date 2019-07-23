/* eslint-disable consistent-return, no-console */
const fs = require('fs');

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const filePath = `${process.cwd()}/README.md`;
const findPattern = escapeRegExp("[//]: # 'AUTO INSERT HEADER PREPUBLISH'");
const text = `
> ## 🛠 Status: Pilot Phase
> Lion Web Components are still in an early alpha stage; they should not be considered production ready yet.
>
> The goal of our pilot phase is to gather feedback from a private group of users.
> Therefore, during this phase, we kindly ask you to:
> - not publicly promote or link us yet: (no tweets, blog posts or other forms of communication about Lion Web Components)
> - not publicly promote or link products derived from/based on Lion Web Components
>
> As soon as Pilot Phase ends we will let you know (feel free to subscribe to this issue https://github.com/ing-bank/lion/issues/1)
`.trim();

fs.readFile(filePath, 'utf8', (readError, data) => {
  if (readError) {
    return console.log(readError);
  }

  const result = data.replace(new RegExp(findPattern), text);
  fs.writeFile(filePath, result, 'utf8', writeError => {
    if (writeError) {
      return console.log(writeError);
    }
  });
});
