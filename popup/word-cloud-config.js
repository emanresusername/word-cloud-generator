let minWordSizeInput = document.getElementById('minWordSizeInput');

let ignoreWordsInput = document.getElementById('filterWordsTextarea');

let selectorInput = document.getElementById('selectorTextarea');

let phraseSizeInput = document.getElementById('phraseSizeInput');

let minFontSizeInput = document.getElementById('minFontSizeInput');

let maxFontSizeInput = document.getElementById('maxFontSizeInput');

let svgWidthInput = document.getElementById('svgWidth');

let svgHeightInput = document.getElementById('svgHeight');

let generateButton = document.getElementById('generateButton');

let toggleSelectionModeButton = document.getElementById('toggleSelectionModeButton');

let clearSelectionButton = document.getElementById('clearSelectionButton');

clearSelectionButton.addEventListener("click", clearSelectionInActiveTab);

generateButton.addEventListener("click", function(e) {
  let options = getInputOptions();
  storeOptions(options);
  generateWordCloud(options);
});

toggleSelectionModeButton.addEventListener("click", (e) => {
  let button = toggleSelectionModeButton;
  button.toggled = !button.toggled;
  if(button.toggled) {
    startElementSelectionInActiveTab();
    button.classList.remove('btn-success');
    button.classList.add('btn-danger');
    button.textContent = "Exit Selection Mode";
  } else {
    stopElementSelectionInActiveTab();
    button.classList.remove('btn-danger');
    button.classList.add('btn-success');
    button.textContent = "Enter Selection Mode";
  }
});

function withActiveTab(callback) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => callback(tabs[0]));
}

function sendMessage(tab, msg) {
  chrome.tabs.sendMessage(tab.id, msg);
}

function clearSelectionInActiveTab() {
  withActiveTab((tab) => sendMessage(tab, 'clear-selection'));
}

function startElementSelectionInActiveTab() {
  withActiveTab((tab) => sendMessage(tab, 'start-element-selection'));
}

function stopElementSelectionInActiveTab() {
  withActiveTab((tab) => sendMessage(tab, 'stop-element-selection'));
}

function withStoredOptions(callback) {
  let options = {
    minWordSize: 4,
    ignoreWords: '',
    phraseSize: 1,
    minFontSize: 10,
    maxFontSize: 40,
    svgWidth: 500,
    svgHeight: 500,
    selector: ''
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
  selectorInput.value = options.selector;
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
    selector: selectorInput.value,
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
      },
      selector: options.selector
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
withActiveTab(stopElementSelectionInActiveTab);
withStoredOptions(popuplateInputs);
