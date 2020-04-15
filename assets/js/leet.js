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
    'c': '(',
    'e': '3',
    'g': '6',
    'i': '1',
    'l': '1',
    'o': '0',
    's': '5',
    't': '7',
    'z': '2'
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
        string = string.replace(new RegExp(letter, 'ig'), leet.characterMap[letter]);
      }
    }

    return string.toUpperCase();
  },

  convertsingle: function (string) {
    string = string || '';
    string = string.replace(/cks/g, 'x');

    var keys = Object.keys(leet.characterMap);
    var randomIndex = keys.length * Math.random() << 0;

    return string.replace(new RegExp(keys[randomIndex], 'ig'), leet.characterMap[keys[randomIndex]]);
  },
};

document.querySelectorAll('[data-leet=""]').forEach((element) => {
  element.innerHTML = leet.convertsingle(element.innerHTML);
});
