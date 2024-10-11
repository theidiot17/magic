const languageKey = {
    'A': '🍎', 'a': '★',
    'B': '🍌', 'b': '☂',
    'C': '🌶️', 'c': '☕',
    'D': '🍩', 'd': '⚓',
    'E': '🥚', 'e': '✿',
    'F': '🍟', 'f': '⚖',
    'G': '🍇', 'g': '⌛',
    'H': '🏠', 'h': '♔',
    'I': '★', 'i': '✈', // Note: 'I' was missing in the original; adding as per the key
    'J': '🕹️', 'j': '♬',
    'K': '🔪', 'k': '☾',
    'L': '🍋', 'l': '✉',
    'M': '🍈', 'm': '✒',
    'N': '🥜', 'n': '☄',
    'O': '🍊', 'o': '☽',
    'P': '🍕', 'p': '☼',
    'Q': '❓', 'q': '☁',
    'R': '🌈', 'r': '☢',
    'S': '🐍', 's': '☮',
    'T': '🌮', 't': '✎',
    'U': '☂️', 'u': '♞',
    'V': '🎻', 'v': '⚙',
    'W': '🍉', 'w': '✆',
    'X': '❌', 'x': '☹',
    'Y': '🍋', 'y': '♚',
    'Z': '⚡', 'z': '⚐',
    '1': '1️⃣',
    '2': '2️⃣',
    '3': '3️⃣',
    '4': '4️⃣',
    '5': '5️⃣',
    '6': '6️⃣',
    '7': '7️⃣',
    '8': '8️⃣',
    '9': '9️⃣',
    '0': '0️⃣',
    '.': '🔟',
    ',': '💬',
    '!': '❗',
    '?': '❓',
    "'": '’',
    '"': '“',
    '-': '➖',
    '_': '⬜',
};

const reverseLanguageKey = {};

// Populate reverseLanguageKey
for (let key in languageKey) {
    reverseLanguageKey[languageKey[key]] = key;
}

function translate(text, keyMap) {
    return text.split('').map(char => keyMap[char] || char).join('');
}

function translateToSecret() {
    const englishInput = document.getElementById('englishInput').value;
    const secretOutput = translate(englishInput, languageKey);
    document.getElementById('secretInput').value = secretOutput;
}

function translateToEnglish() {
    const secretInput = document.getElementById('secretInput').value;
    const englishOutput = translate(secretInput, reverseLanguageKey);
    document.getElementById('englishInput').value = englishOutput;
}
