/*
 * This module exports functions to format text using a wide variety of stylish fonts
 * by replacing standard characters with their Unicode equivalents.
 *
 * It is designed for use in environments that support Unicode text rendering,
 * such as chat applications and web platforms.
 *
 * Each function takes a string and returns the same string formatted with a
 * specific font style.
 *
 * Author: Aryan
 */

const fonts = {};

// Helper function for character mapping using Unicode blocks
const mapUnicode = (str, unicodeMap) => {
    let result = '';
    for (const char of str) {
        if (unicodeMap.lower && char >= 'a' && char <= 'z') {
            result += String.fromCodePoint(unicodeMap.lower + (char.codePointAt(0) - 'a'.codePointAt(0)));
        } else if (unicodeMap.upper && char >= 'A' && char <= 'Z') {
            result += String.fromCodePoint(unicodeMap.upper + (char.codePointAt(0) - 'A'.codePointAt(0)));
        } else if (unicodeMap.digits && char >= '0' && char <= '9') {
            result += String.fromCodePoint(unicodeMap.digits + (char.codePointAt(0) - '0'.codePointAt(0)));
        } else {
            result += char;
        }
    }
    return result;
};

// --- Serif and Sans-serif Fonts ---
fonts.bold = (str) => mapUnicode(str, {
    lower: 0x1d41a,
    upper: 0x1d400,
    digits: 0x1d7e2
});

fonts.italic = (str) => mapUnicode(str, {
    lower: 0x1d44e,
    upper: 0x1d434
});

fonts.boldItalic = (str) => mapUnicode(str, {
    lower: 0x1d482,
    upper: 0x1d468
});

fonts.sansSerif = (str) => mapUnicode(str, {
    lower: 0x1d5ba,
    upper: 0x1d5a0,
    digits: 0x1d7f6
});

fonts.sansSerifBold = (str) => mapUnicode(str, {
    lower: 0x1d5ee,
    upper: 0x1d5d4,
    digits: 0x1d7ec
});

fonts.sansSerifItalic = (str) => mapUnicode(str, {
    lower: 0x1d622,
    upper: 0x1d608
});

fonts.sansSerifBoldItalic = (str) => mapUnicode(str, {
    lower: 0x1d656,
    upper: 0x1d63c
});

// --- Other Unique Styles ---
fonts.monospace = (str) => mapUnicode(str, {
    lower: 0x1d68a,
    upper: 0x1d670,
    digits: 0x1d7f6
});

fonts.script = (str) => mapUnicode(str, {
    lower: 0x1d4d0,
    upper: 0x1d4b6
});

fonts.boldScript = (str) => mapUnicode(str, {
    lower: 0x1d4ea,
    upper: 0x1d4d0
});

fonts.fraktur = (str) => mapUnicode(str, {
    lower: 0x1d586,
    upper: 0x1d56c
});

fonts.boldFraktur = (str) => mapUnicode(str, {
    lower: 0x1d586,
    upper: 0x1d56c
});

fonts.doubleStruck = (str) => mapUnicode(str, {
    lower: 0x1d552,
    upper: 0x1d538,
    digits: 0x1d7d8
});

fonts.smallCaps = (str) => {
    const map = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return str.split('').map(char => map[char.toLowerCase()] || char).join('');
};

module.exports = fonts;
