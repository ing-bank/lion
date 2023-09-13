export default function() {
    return { 
        name: '@astrojs/lion', 
        hooks: {
            "astro:config:setup": ({ updateConfig, injectScript }) => {              
              updateConfig({
                vite: {
                  optimizeDeps: {
                    include: [
                        '@mdjs/mdjs-preview',
                        '@lion/ui/exports/define/lion-button.js',
                        '@mdjs/mdjs-preview/define',
                        '@mdjs/mdjs-story/define'
                    ],
                  },
                }
              });
            }
        }        
    };
}
