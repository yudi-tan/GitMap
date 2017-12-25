const gh = require('parse-github-url');

var script = function() {
  window.chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
    var url = gh(tabs[0].url).href;
    var owner = gh(tabs[0].url).owner;
    var repoName = gh(tabs[0].url).name;
    localStorage.setItem('url', url);
    localStorage.setItem('owner', owner);
    localStorage.setItem('repoName', repoName);
});
};


module.exports = {
  method: script(),
  url: localStorage.getItem('url'),
  owner: localStorage.getItem('owner'),
  repoName: localStorage.getItem('repoName')
};
