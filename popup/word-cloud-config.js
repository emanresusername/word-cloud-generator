let minWordSizeInput = document.getElementById('minWordSizeInput');

let ignoreWordsInput = document.getElementById('filterWordsTextarea');

let phraseSizeInput = document.getElementById('phraseSizeInput');

let minFontSizeInput = document.getElementById('minFontSizeInput');

let maxFontSizeInput = document.getElementById('maxFontSizeInput');

let svgWidthInput = document.getElementById('svgWidth');

let svgHeightInput = document.getElementById('svgHeight');

let generateButton = document.getElementById('generateButton');

let toggleSelectionCheckbox = document.getElementById('toggleSelectionCheckbox');

generateButton.addEventListener("click", function(e) {
  let options = getInputOptions();
  storeOptions(options);
  generateWordCloud(options);
});

toggleSelectionCheckbox.addEventListener("click", (e) => {
  if(e.target.checked) {
    withActiveTab(startElementSelection);
  } else {
    withActiveTab(stopElementSelection);
  }
});

function withActiveTab(callback) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => callback(tabs[0]));
}

function startElementSelection(tab) {
  chrome.tabs.sendMessage(tab.id, 'start-element-selection');
}

function stopElementSelection(tab) {
  chrome.tabs.sendMessage(tab.id, 'stop-element-selection');
}

function withStoredOptions(callback) {
  let options = {
    minWordSize: 4,
    ignoreWords: '',
    phraseSize: 1,
    minFontSize: 10,
    maxFontSize: 40,
    svgWidth: 500,
    svgHeight: 500
  };

  chrome.storage.local.get(null, function(results) {
    if(chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
    } else {
      let optionKeys = Object.keys(results);
      for(let i = 0; i < optionKeys.length; ++i) {
        let key = optionKeys[i];
        let value = results[key];
        if(!!value) {
          options[key] = value;
        }
      }
      callback(options);
    }
  });
}

function popuplateInputs(options) {
  minWordSizeInput.value = options.minWordSize;
  ignoreWordsInput.value = options.ignoreWords;
  phraseSizeInput.value = options.phraseSize;
  minFontSizeInput.value = options.minFontSize;
  maxFontSizeInput.value = options.maxFontSize;
  svgWidthInput.value = options.svgWidth;
  svgHeightInput.value = options.svgHeight;
}


function getInputOptions() {
  return {
    minWordSize: Number(minWordSizeInput.value),
    ignoreWords: ignoreWordsInput.value,
    phraseSize: Number(phraseSizeInput.value),
    minFontSize: Number(minFontSizeInput.value),
    maxFontSize: Number(maxFontSizeInput.value),
    svgWidth: Number(svgWidthInput.value),
    svgHeight: Number(svgHeightInput.value)
  };
}

function generateWordCloud(options) {
  chrome.tabs.executeScript(null, {
    file: "/word-cloud-helper.js"
  });

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, {
      wordOptions: {
        minWordSize: options.minWordSize,
        ignoreWords: options.ignoreWords.trim().split(/\W+/),
        phraseSize: options.phraseSize
      },
      generatorOptions: {
        minFontSize: options.minFontSize,
        maxFontSize: options.maxFontSize,
        svgWidth: options.svgWidth,
        svgHeight: options.svgHeight
      }
    }, (svgBlob) => {
      let url = URL.createObjectURL(svgBlob);
      chrome.tabs.create({url, index: tab.index});
      window.close();
    });
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

// stop currently running selecting (user can reactivate from the popup now if not done)
withActiveTab(stopElementSelection);
withStoredOptions(popuplateInputs);
