export default function () {
  return {
    name: '@astrojs/lion',
    hooks: {
      'astro:config:setup': ({ updateConfig, injectScript }) => {
        updateConfig({
          vite: {
            optimizeDeps: {
              // Needed to bring along node deps in build output
              include: [
                '@mdjs/mdjs-preview',
                '@lion/ui/exports/define/lion-button.js',
                '@lion/ui/exports/define/lion-calendar.js',
                '@mdjs/mdjs-preview/define',
                '@mdjs/mdjs-story/define',
                // button from ing-web START
                'ing-web/lit-2.js',
                'ing-web/_lit-1-and-2-component-helpers.js',
                'ing-web/style.js',
                'ing-web/_deprecated.js',
                'ing-web/button.js',
                'ing-web/icon.js',
                'ing-web/tooltip.js',
                // button from ing-web END
                'lit',
              ],
            },
          },
        });
      },
    },
  };
}
