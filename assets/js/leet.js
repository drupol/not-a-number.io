// Source: https://gist.github.com/plugn/514a63143a7bdf77276bf47352ebc593
var leet = {

  /**
   * Map of conversions.
   *
   * @var object
   */
  characterMap: {
    'a': '4',
    'b': '8',
    'e': '3',
    'g': '6',
    'l': '1',
    'o': '0',
    's': '5',
    't': '7',
    'æ': '43',
    'ø': '03',
    'å': '44'
  },

  /**
   * Convert a string to 1337 based on the character map.
   *
   * @param string string Regular ol' text to convert
   * @return string
   */
  convert: function (string) {
    var letter;
    string = string || '';
    string = string.replace(/cks/g, 'x');

    for (letter in leet.characterMap) {
      if (leet.characterMap.hasOwnProperty(letter)) {
        string = string.replace(new RegExp(letter, 'g'), leet.characterMap[letter]);
      }
    }

    return string.toUpperCase();
  },

  convertsingle: function (string) {
    var letter;
    string = string || '';
    string = string.replace(/cks/g, 'x');

    letter = string[Math.floor(Math.random() * string.length)];

    if (leet.characterMap.hasOwnProperty(letter)) {
      string = string.replace(new RegExp(letter, 'g'), leet.characterMap[letter]);
    }

    return string;
  },
};

document.querySelectorAll('[data-leet=""]').forEach((element) => {
  element.innerHTML = leet.convertsingle(element.innerHTML);
});
