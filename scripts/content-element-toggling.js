const CONSIDERING_CLASS = "under-consideration";
const TOGGLED_CLASS = "toggled-content";

function toggleElement(event) {
  let classes = event.target.classList;
  if(classes.contains(TOGGLED_CLASS)) {
    classes.remove(TOGGLED_CLASS);
  } else {
    classes.add(TOGGLED_CLASS);
  }
  event.preventDefault();
  event.stopPropagation();
  return false;
}

function considerElement(event) {
  event.target.classList.add(CONSIDERING_CLASS);
}

function leaveElement(event) {
  event.target.classList.remove(CONSIDERING_CLASS);
}

function startElementSelection() {
  document.addEventListener('click', toggleElement);
  document.addEventListener('mouseover', considerElement);
  document.addEventListener('mouseout', leaveElement);
}

function stopElementSelection() {
  document.removeEventListener('click', toggleElement);
  document.removeEventListener('mouseover', considerElement);
  document.removeEventListener('mouseout', leaveElement);
}

function clearSelection() {
  // NOTE: htmlcollections are live and this one changes as you remove the classes
  let liveToggled = document.getElementsByClassName(TOGGLED_CLASS);
  // AMO didn't like es6 for-comprehensions :(
  let toggled = [];
  for (let i = 0; i < liveToggled.length; ++i) {
    toggled.push(liveToggled.item(i));
  }
  toggled.forEach(elem => {
    elem.classList.remove(TOGGLED_CLASS);
  });
}

function cleanTextContent(elem) {
  return elem.textContent.trim()
    .replace(/,/g, ' ')
    .replace(/[^a-zA-Z0-9\s\-]/g, '')
    .toUpperCase();
}

function getPhrases(words, options) {
  let {phraseSize} = options;
  switch (phraseSize) {
  case 1:
    return words;
  default:
    let stopIndex = words.length - phraseSize;
    let phrases = [];
    for (let i = 0; i <= stopIndex; ++i) {
      phrases.push(words.slice(i, i + phraseSize).join(' '));
    }
    return phrases;
  }
}

function getWordsBySelector(selector) {
  let words = [];
  let selection = document.querySelectorAll(selector);
  for(let i = 0; i < selection.length; ++i) {
    words = words.concat(cleanTextContent(selection.item(i)).split(/\s+/));
  }
  return words;
}

function filterWords(words, options) {
  let {ignoreWords, minWordSize} = options;
  let regex = RegExp(`^(?:${ignoreWords.join('|')})$`, 'i');
  return words.filter(word => word.length >= minWordSize && !regex.test(word));
}

function getSelectedPhrases(selector, wordOptions) {
  let combinedSelector = '.' + TOGGLED_CLASS;
  if(selector && selector.trim().length > 0) {
    combinedSelector += ',' + selector;
  }
  let words = getWordsBySelector(combinedSelector);
  let filteredWords = filterWords(words, wordOptions);
  let phrases = getPhrases(filteredWords, wordOptions);
  return phrases;
}

// Handle messages from the add-on background page (only in top level iframes)
if (window.parent == window) {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    switch(msg) {
    case 'start-element-selection':
      startElementSelection();
      break;
    case 'stop-element-selection':
      stopElementSelection();
      break;
    case 'clear-selection':
      clearSelection();
      break;
    default:
      let {selector, wordOptions} = msg;
      if(wordOptions) {
        let phrases = getSelectedPhrases(selector, wordOptions);
        sendResponse({words: phrases});
      }
    }
  });
}
