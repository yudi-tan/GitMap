const gh = require('parse-github-url');

var script = function() {
  window.chrome.tabs.query({'active': true, 'currentWindow': true, 'lastFocusedWindow': true, 'url': 'https://github.com/*/*'}, function (tabs) {
    var url = gh(tabs[0].url).href;
    var owner = gh(tabs[0].url).owner;
    var repoName = gh(tabs[0].url).name;
    localStorage.setItem('owner', owner);
    localStorage.setItem('url', url);
    localStorage.setItem('repoName', repoName);
    console.log('local storage ready');
});
};


module.exports = {
  method: script()
};
