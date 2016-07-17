function withActiveTab(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    callback(tabs[0]);
  });
}

function messageTab(tab, msg, callback) {
  chrome.tabs.sendMessage(tab.id, msg, callback);
}

function messageActiveTab(msg, callback) {
  withActiveTab(tab => messageTab(tab, msg, (response) => {
    callback(response, tab);
  }));
}

function togglePanel() {
  messageActiveTab("toggle-in-page-panel");
}

function generateWordCloud(request) {
  let {selector, wordOptions, generatorOptions} = request;
  messageActiveTab({selector, wordOptions}, ({words}) => {
    messageActiveTab({words, generatorOptions});
  });
}

function storeOption(key, value) {
  chrome.storage.local.set({[key]: value});
}

function storeOptions(options) {
  let optionKeys = Object.keys(options);
  for(var i = 0; i < optionKeys.length; ++i) {
    let key = optionKeys[i];
    let value = options[key];
    storeOption(key, value);
  }
}

function withStoredOptions(callback) {
  chrome.storage.local.get(null, function(options) {
    if(chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      callback(options);
    }
  });
}

function openSvgBlobInTab(svgString) {
  withActiveTab((tab) => {
    let svgBlob = new Blob(
      [svgString],
      {type: "image/svg+xml"}
    );
    let url = URL.createObjectURL(svgBlob);
    chrome.tabs.create({url, index: tab.index});
  });
}

const DEFAULT_OPTIONS = {
  minWordSize: 4,
  ignoreWords: '',
  phraseSize: 1,
  minFontSize: 10,
  maxFontSize: 40,
  svgWidth: 500,
  svgHeight: 500,
  selector: ''
};

storeOptions(DEFAULT_OPTIONS);

// Handle the browser action button.
chrome.browserAction.onClicked.addListener(togglePanel);

// Handle connections received from the add-on panel ui iframes.
chrome.runtime.onConnect.addListener(function (port) {
  if (port.sender.url == chrome.runtime.getURL("popup/word-cloud-config.html")) {
    switch(port.name) {
    case 'elementSelection':
      port.onMessage.addListener(messageActiveTab);
      break;
    case 'generateWordCloud':
      port.onMessage.addListener(generateWordCloud);
      return true;
    }
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  let {type} = msg;
  switch (type) {
  case 'getOptions':
    withStoredOptions(sendResponse);
    return true;
  case 'storeOptions':
    storeOptions(msg.options);
    break;
  case 'svgBlob':
    openSvgBlobInTab(msg.svgBlob);
    break;
  default:
    return true;
  }
});
