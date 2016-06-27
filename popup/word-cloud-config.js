const STORAGE_KEY = 'storedOptions';

function minWordSizeInput() {
  return document.getElementById('minWordSizeInput');
}
function filterWordsTextarea() {
  return document.getElementById('filterWordsTextarea');
}
function phraseSizeInput() {
  return document.getElementById('phraseSizeInput');
}
function minFontSizeInput() {
  return document.getElementById('minFontSizeInput');
}
function maxFontSizeInput() {
  return document.getElementById('maxFontSizeInput');
}
function svgWidth() {
  return document.getElementById('svgWidth');
}
function svgHeight() {
  return document.getElementById('svgHeight');
}

function getPopupOptions() {
  return {
    wordOptions: {
      minWordSize: Number(minWordSizeInput().value),
      ignoreWords: filterWordsTextarea().value.trim().split(/\W+/),
      phraseSize: Number(phraseSizeInput().value)
    },
    generatorOptions: {
      minFontSize: Number(minFontSizeInput().value),
      maxFontSize: Number(maxFontSizeInput().value),
      svgWidth: Number(svgWidth().value),
      svgHeight: Number(svgHeight().value)
    }
  };
}

function getStoredOptions(callback) {
  chrome.storage.local.get(STORAGE_KEY, (res) => {
    callback(res[STORAGE_KEY]);
  });
}

function syncPopupOptions() {
  getStoredOptions((options) => {
    if(!!options) {
      let {
        wordOptions:{minWordSize, ignoreWords, phraseSize},
        generatorOptions:{minFontSize, maxFontSize, svgWidth, svgHeight}
      } = options;
      minFontSizeInput().value = minWordSize;
      filterWordsTextarea().value = ignoreWords.join("\n");
      phraseSizeInput().value = phraseSize;
      minFontSizeInput().value = minFontSize;
      maxFontSizeInput().value = maxFontSize;
      svgWidth().value = svgWidth;
      svgHeight().value = svgHeight;
    }
  });
}

function generateWordCloud(options) {
  chrome.tabs.executeScript(null, {
    file: "/word-cloud-helper.js"
  });

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, {
      options: options,
      selector: 'body>:not(svg)'
    }, (svgBlob) => {
      let url = URL.createObjectURL(svgBlob);
      chrome.tabs.create({url, index: tab.index});
      window.close();
    });
  });
}

document.addEventListener("click", function(e) {
  if (e.target.id == "generateButton") {
    let options = getPopupOptions();
    let storageOptions = {};
    storageOptions[STORAGE_KEY]= options;
    chrome.storage.local.set(storageOptions);
    generateWordCloud(options);
  } else {
    return;
  }
});

document.addEventListener('DOMContentLoaded', (e) => {
  syncPopupOptions();
});
