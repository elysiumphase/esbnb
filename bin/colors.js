const reset = '\x1b[0m';

const colors = {
  bold: (text) => `\x1b[1m${text}${reset}`,
  backgroundDarkGray: (text) => `\x1b[100m${text}${reset}`,
  gray: (text) => `\x1b[37m${text}${reset}`,
  green: (text) => `\x1b[32m${text}${reset}`,
  red: (text) => `\x1b[31m${text}${reset}`,
  yellow: (text) => `\x1b[33m${text}${reset}`,
};

module.exports = Object.freeze(colors);
