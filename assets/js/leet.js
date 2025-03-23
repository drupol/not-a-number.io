var leet = {
  characterMap: {
    'a': ['4', '∀', '@', 'α', 'д', 'ɐ'],
    'b': ['8', '|3', 'ß'],
    'c': ['(', '⊂', '<', '¢', '©'],
    'd': ['Ð'],
    'e': ['3', '∃', '∈', '€', 'ε'],
    'f': ['ƒ'],
    'g': ['6', '9', '&', 'ǥ'],
    'h': ['#'],
    'i': ['1', '|', '!', '¡', 'ι'],
    'l': ['1', '/'],
    'n': ['∩', 'И'],
    'o': ['0', 'ø'],
    'p': ['ρ'],
    'q': ['ǫ'],
    'r': ['Я'],
    's': ['5', '$', '§'],
    't': ['7', '+', '†'],
    'u': ['∪', 'µ'],
    'v': ['√', '∨'],
    'w': ['ω'],
    'x': ['×', '><'],
    'y': ['¥', 'γ'],
    'z': ['2', '≥', 'ζ']
  },

  getCharacterMap: function() {
    var map = {};
    for (var key in this.characterMap) {
      var values = this.characterMap[key];
      map[key] = values[Math.floor(Math.random() * values.length)];
    }
    return map;
  },

  convert: function(string) {
    string = (string || '').replace(/cks/g, 'x');
    var map = this.getCharacterMap();
    var result = '';

    for (var i = 0; i < string.length; i++) {
      var char = string[i];
      var lower = char.toLowerCase();
      result += map[lower] || char;
    }

    return result.toUpperCase();
  },

  convertsingle: function(string) {
    string = (string || '').replace(/cks/g, 'x');
    var keys = Object.keys(this.characterMap);
    var randomKey = keys[Math.floor(Math.random() * keys.length)];
    var values = this.characterMap[randomKey];
    var replacement = values[Math.floor(Math.random() * values.length)];

    return string.replace(new RegExp(randomKey, 'ig'), replacement);
  }
};

document.querySelectorAll('[data-leet=""]').forEach((element) => {
  element.textContent = leet.convertsingle(element.textContent);
});
