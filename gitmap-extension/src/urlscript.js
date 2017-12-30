const gh = require('parse-github-url');

var script = function() {
  window.chrome.tabs.query({'active': true, 'currentWindow': true, 'lastFocusedWindow': true, 'url': 'https://github.com/*/*'}, function (tabs) {
    var url = gh(tabs[0].url).href;
    var owner = gh(tabs[0].url).owner;
    var repoName = gh(tabs[0].url).name;
    localStorage.setItem('owner', owner);
    localStorage.setItem('url', url);
    localStorage.setItem('repoName', repoName);
});
  window.chrome.cookies.get({ url: 'https://github.com', name: 'dotcom_user' },
  function (cookie) {
    if (cookie) {
      localStorage.setItem('gmghUsername', cookie.value);
    }
    else {
      console.log('Can\'t get cookie! Check the name!');
    }
});
};


module.exports = {
  method: script()
};
