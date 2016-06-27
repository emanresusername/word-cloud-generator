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
  console.debug({regex});
  return words.filter(word => word.length >= minWordSize && !regex.test(word));
}

// http://stackoverflow.com/a/23589931
function openSvgInTab(svg) {
  let serializer = new XMLSerializer();
  let svg_blob = new Blob([serializer.serializeToString(svg)],
                          {'type': "image/svg+xml"});
  let url = URL.createObjectURL(svg_blob);

  let svg_win = window.open(url, "svg_win");
}

function generateWordCloud(request, sender, sendResposne) {
  try {
    let {selector, options:{wordOptions, generatorOptions}} = request;
    let words = getWords(selector);
    let filteredWords = filterWords(words, wordOptions, wordOptions);
    let phrases = getPhrases(filteredWords, wordOptions);
    console.debug({filteredWords, words, phrases, wordOptions, generatorOptions});
    let container = new WordCloudContainer(generatorOptions.svgWidth, generatorOptions.svgHeight);
    new WordCloudGenerator(container, generatorOptions).generateWordCloud(
      phrases,
      () => {
        openSvgInTab(container.svg);
        container.cleanup();
      }
    );
  } catch(err) {
    console.error(err);
  } finally {
    chrome.runtime.onMessage.removeListener(generateWordCloud);
  }
}

chrome.runtime.onMessage.addListener(generateWordCloud);
