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

let elementSelectionPort = chrome.runtime.connect({name: "elementSelection"});

let generateWordCloudPort = chrome.runtime.connect({name: "generateWordCloud"});

clearSelectionButton.addEventListener("click", clearSelectionInActiveTab);

generateButton.addEventListener("click", function(e) {
  let options = getInputOptions();
  storeOptions(options);
  generateWordCloudPort.postMessage({
    wordOptions: {
      minWordSize: options.minWordSize,
      ignoreWords: options.ignoreWords.trim().split(/\s+|,/),
      phraseSize: options.phraseSize
    },
    generatorOptions: {
      minFontSize: options.minFontSize,
      maxFontSize: options.maxFontSize,
      svgWidth: options.svgWidth,
      svgHeight: options.svgHeight
    },
    selector: options.selector
  });
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

function storeOptions(options) {
  chrome.runtime.sendMessage({
    type: 'storeOptions',
    options
  });
}

function clearSelectionInActiveTab() {
  elementSelectionPort.postMessage('clear-selection');
}

function startElementSelectionInActiveTab() {
  elementSelectionPort.postMessage('start-element-selection');
}

function stopElementSelectionInActiveTab() {
  elementSelectionPort.postMessage('stop-element-selection');
}

function withStoredOptions(callback) {
  chrome.runtime.sendMessage({
    type: 'getOptions'
  }, callback);
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

withStoredOptions(popuplateInputs);
