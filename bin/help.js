const colors = require('./colors');

module.exports = `
                      ${colors.yellow(colors.bold('ESBNB, the ESLint airbnb config installer'))}

Install ESLint with the Airbnb ESLint rules, including ECMAScript 6+ and React (default)
${colors.bold('$ esbnb')}

Install ESLint with the Airbnb ESLint rules, including ECMAScript 6+ (base)
${colors.bold('$ esbnb base')}

Install ESLint with the Airbnb ESLint rules, including ECMAScript 5 and below (legacy)
${colors.bold('$ esbnb legacy')}

${colors.gray('A .eslintrc file will be created if not already and properly configured.')}
`;
