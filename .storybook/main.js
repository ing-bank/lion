module.exports = {
  stories: [
    '../packages/*/stories/*.stories.{js,mdx}',
    '../packages/helpers/*/stories/*.stories.{js,mdx}',
  ],
  esDevServer: {
    nodeResolve: true,
    watch: true,
    open: true,
  },
};
