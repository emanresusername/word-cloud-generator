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

function getWords(selector) {
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

function serializeSvg(svg) {
  let serializer = new XMLSerializer();
  return new Blob([serializer.serializeToString(svg)],
                  {'type': "image/svg+xml"});
}

function generateWordCloud(request, sender, sendResponse) {
  try {
    let {wordOptions, generatorOptions, selector} = request;
    let words = getWords(['.' + TOGGLED_CLASS, selector].join(','));
    let filteredWords = filterWords(words, wordOptions, wordOptions);
    let phrases = getPhrases(filteredWords, wordOptions);
    let container = new WordCloudContainer(generatorOptions.svgWidth, generatorOptions.svgHeight);
    new WordCloudGenerator(container, generatorOptions).generateWordCloud(
      phrases,
      () => {
        let svgBlob = serializeSvg(container.svg);
        container.cleanup();
        sendResponse(svgBlob);
      }
    );
    // need to return true so async send response can happen when word cloud drawn
    return true;
  } catch(err) {
    console.error(err);
  } finally {
    chrome.runtime.onMessage.removeListener(generateWordCloud);
  }
}

chrome.runtime.onMessage.addListener(generateWordCloud);
