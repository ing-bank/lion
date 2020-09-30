// We don't have access to our main index html, so let's add Roboto font like this
const linkNode = document.createElement('link');
linkNode.href = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500';
linkNode.rel = 'stylesheet';
linkNode.type = 'text/css';
document.head.appendChild(linkNode);
