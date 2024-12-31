self.addEventListener('fetch', event => {
  const url = event.request.url;
  console.log('fetch', url);
});
