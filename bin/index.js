#! /usr/bin/env node
// sudo npm link
/* eslint-disable no-console */

/**
 *  TODO: make it possible to change config, after installing airbnb base config
 *  with 'esbnb base' command, 'esbnb' command will first remove associated
 *  eslint packages in node_modules and in package.json
 */
const fs = require('fs');
const path = require('path');
const colors = require('colors/safe');
const help = require('./help');
const execSync = require('child_process').execSync;

const packageJson = './package.json';
const eslintrc = './.eslintrc';
const anonymousProject = 'anonymous';

const eslintConfig = 'eslint-config';

const eslintExtends = [
  'airbnb',
  'airbnb-base',
  'airbnb-base/legacy',
];

const is = Object.prototype.isPrototypeOf;

const [,, config] = [...process.argv];
const helpIsNeeded = (config === '-help' || config === '-h');

let pkg;
let eslintExtend;
let projectName;
let hasBadConfigName = false;
let hasPackageJson = true;

// check package.json file and get project name (consider no package if bad JSON)
try {
  hasPackageJson = fs.statSync(packageJson).isFile();
  projectName = JSON.parse(fs.readFileSync(packageJson)).name;
} catch (e) {
  hasPackageJson = false;
}

// if there is no package.json, if not a file or bad JSON format, exit
if (!hasPackageJson) {
  console.error(colors.red(`"${packageJson}" is required to install eslint with airbnb config`));
  console.error(colors.red(`Please make sure your "${packageJson}" exists and has a valid JSON format`));
  process.exit(1);
}

// make sure project name is correctly set
if (is.call(String.prototype, Object(projectName))) {
  projectName = projectName.trim() || anonymousProject;
} else {
  projectName = anonymousProject;
}

// set proper value for config
if (!helpIsNeeded) {
  switch (config) {
    case undefined:
      pkg = `${eslintConfig}-airbnb@latest`;
      ([eslintExtend] = eslintExtends);
      break;
    case 'base':
      pkg = `${eslintConfig}-airbnb-base@latest`;
      ([, eslintExtend] = eslintExtends);
      break;
    case 'legacy':
      pkg = `${eslintConfig}-airbnb-base`;
      ([,, eslintExtend] = eslintExtends);
      break;
    default:
      hasBadConfigName = true;
  }
}

// show help or install eslint airbnb config
if (helpIsNeeded || hasBadConfigName) {
  console.log(help);
} else {
  console.info(`${colors.yellow('esbnb')} is installing "${eslintExtend}" config...`);

  const stdout = execSync(`npm info "${pkg}" peerDependencies --json | command sed 's/[{},]//g ; s/: /@/g' | xargs npm install --save-dev "${pkg}"`);
  // 's/[\{\},]//g ;

  const stdoutString = stdout.toString('utf8');

  console.info(stdoutString.replace(/(\w+[\w-.]*@\d\d?.\d\d?.\d\d?)/g, colors.bgBlack.yellow('$1')));

  console.info(`${colors.yellow('esbnb')} is configuring "${eslintrc}" file...`);

  // check if a .eslintrc exists at the root of the app
  let hasEslintrc;

  try {
    hasEslintrc = fs.statSync(eslintrc).isFile();
  } catch (e) {
    hasEslintrc = false;
  }

  // insert conf at "extends" in .eslintrc if exists or create conf file
  if (hasEslintrc) {
    let eslintrcConfig;
    let hasValidJsonConfig = true;

    // make a copy of .eslintrc file to prevent wrong manipulation
    const now = new Date();

    /* eslint-disable max-len */
    const nowFormat = `${now.getMonth()}.${now.getDate()}.${now.getFullYear()}.${now.getHours()}.${now.getMinutes()}.${now.getSeconds()}`;
    /* eslint-enable max-len */

    const eslintrcCopyName = `${projectName}.${nowFormat}.eslintrc`;
    const pathToConfigsDirectory = path.join(__dirname, '../configs/');

    let hasDirectoryProject = true;

    try {
      hasDirectoryProject = fs.statSync(path.join(pathToConfigsDirectory, projectName))
                              .isDirectory();
    } catch (e) {
      hasDirectoryProject = false;
    }

    if (!hasDirectoryProject) {
      fs.mkdirSync(path.join(pathToConfigsDirectory, projectName));
    }

    fs.linkSync(eslintrc, path.join(pathToConfigsDirectory, projectName, eslintrcCopyName));


    // get eslint config in JSON format
    try {
      eslintrcConfig = JSON.parse(fs.readFileSync(eslintrc));
    } catch (e) {
      hasValidJsonConfig = false;
    }

    /**
     *  if config is in a valid JSON format and is not an array
     *  (configuration file is an object literral)
     */
    if (hasValidJsonConfig && !Array.isArray(eslintrcConfig)) {
      const { extends: extendsProp } = eslintrcConfig;
      let isConfigInserted = true;
      let hasAlreadyConfig = false;

      /**
       * if 'extends' property
       *    does not exist, create it
       *    is an array,
       *      if config to install is not in it, remove all airbnb config and add current
       *    is a string and contains a airbnb config,
       *      replace it if not already the same, or concat these two values in an array
       */
      if (extendsProp === undefined) {
        eslintrcConfig.extends = eslintExtend;
      } else if (Array.isArray(extendsProp)) {
        if (extendsProp.indexOf(eslintExtend) !== -1) {
          hasAlreadyConfig = true;
        }
        const extendsWithNoAirbnbConfig = extendsProp
          .filter(extend => eslintExtends.indexOf(extend) === -1);

        extendsWithNoAirbnbConfig.push(eslintExtend);
        eslintrcConfig.extends = extendsWithNoAirbnbConfig;
      } else if (is.call(String.prototype, Object(extendsProp))) {
        if (extendsProp === eslintExtend) {
          hasAlreadyConfig = true;
        } else if (eslintExtends.indexOf(extendsProp) !== -1) {
          eslintrcConfig.extends = eslintExtend;
        } else {
          eslintrcConfig.extends = [];
          eslintrcConfig.extends.push(extendsProp, eslintExtend);
        }
      } else {
        isConfigInserted = false;

        console.error(colors.red(`esbnb can not insert correct config in "${eslintrc}":`));
        console.error(colors.red('"extends" property is not an array nor a string.'));
      }

      if (hasAlreadyConfig) {
        console.info(`"${eslintrc}" already has proper configuration`);
      } else if (isConfigInserted) {
        console.info(`"${eslintrc}" has been updated and configured`);
      }

      try {
        fs.writeFileSync(eslintrc, JSON.stringify(eslintrcConfig, null, 2));
        console.info(colors.green(`eslint with "${eslintExtend}" config is ready to use.`));
      } catch (e) {
        console.error(colors.red(e));
      }
    } else {
      console.error(colors.red(`esbnb can not read "${eslintrc}": bad JSON format, literral object needed.`));
    }
  } else {
    // no .eslintrc file, create it
    try {
      fs.writeFileSync(eslintrc, JSON.stringify({ extends: eslintExtend }, null, 2));
      console.info(`"${eslintrc}" has been created and configured.`);
      console.info(colors.green(`eslint with "${eslintExtend}" config is ready to use.`));
    } catch (e) {
      console.error(colors.red(e));
    }
  }
}
