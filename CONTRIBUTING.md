# Contributing

Check out ways to contribute to Lion Web Components:

## Feature requests

When you have an idea on how we could improve, please check our [discussions](https://github.com/ing-bank/lion/discussions) to see if there are similar ideas or feature requests. If there are none, please [start](https://github.com/ing-bank/lion/discussions/new) your feature request as a new discussion topic. Add the title `[Feature Request] My awesome feature` and a description of what you expect from the improvement and what the use case is.

## Existing components: we love pull requests ♥

Help out the whole lion community by sending your merge requests and issues.
Check out how to set it up:

Setup:

```bash
# Clone the repo:
git clone https://github.com/ing-bank/lion.git
cd lion

# Install dependencies
# We require yarn as we use yarn workspaces
yarn install

# Create a branch for your changes
git checkout -b fix/buttonSize
```

Make sure everything works as expected:

```bash
# Linting
npm run lint

# Tests
npm run test

# Storybook Demo
npm run storybook
```

Create a Pull Request:

- At <https://github.com/ing-bank/lion> click on fork (at the right top)

```bash
# add fork to your remotes
git remote add fork git@github.com:<your-user>/lion.git

# push new branch to your fork
git push -u fork fix/buttonSize
```

- Go to your fork and create a Pull Request :).

Some things that will increase the chance that your merge request is accepted:

- Write tests.
- Write a [good commit message](https://www.conventionalcommits.org/).
