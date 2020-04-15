// Source: https://gist.github.com/plugn/514a63143a7bdf77276bf47352ebc593
var leet = {

  /**
   * @var object
   */
  characterMap: {
    'a': '4',
    'b': '8',
    'c': '(',
    'e': '3',
    'g': ['6', '9'],
    'i': ['1', '|'],
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

    var characterMap = leet.getCharacterMap();

    for (var letter in string) {
      if (leet.characterMap.hasOwnProperty(letter)) {
        string = string.replace(new RegExp(letter, 'ig'), characterMap[letter]);
      }
    }

    return string.toUpperCase();
  },

  getCharacterMap: function() {
    var map = leet.characterMap;

    for (var prop in map) {
      var values = Array.from(map[prop]);
      map[prop] = values[Math.floor(Math.random() * values.length)];
    }

    return map;
  },

  convertsingle: function (string) {
    string = string || '';
    string = string.replace(/cks/g, 'x');

    var characterMap = leet.getCharacterMap();
    var keys = Object.keys(characterMap);
    var search = keys[keys.length * Math.random() << 0];

    return string.replace(new RegExp(search, 'ig'), characterMap[search]);
  },
};

document.querySelectorAll('[data-leet=""]').forEach((element) => {
  element.innerHTML = leet.convertsingle(element.innerHTML);
});
