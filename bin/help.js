const colors = require('colors/safe');

module.exports = `
${colors.bgYellow.gray('--------------------------------------- HELP ---------------------------------------')}

                      ${colors.bold.yellow('ESBNB, the eslint airbnb config installer')}

- INSTALL A CONFIG (airbnb by default, airbnb-base or airbnb-base/legacy)

$ esbnb
${colors.gray('eslint-config-airbnb@latest will be installed')}

$ esbnb base
${colors.gray('eslint-config-airbnb-base@latest will be installed')}

$ esbnb legacy
${colors.gray('eslint-config-airbnb-base will be installed')}

${colors.bgYellow.gray('------------------------------------- END HELP -------------------------------------')}
`;
