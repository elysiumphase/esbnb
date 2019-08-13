/**
 * NOTE: 'npm test' command should be run at the root esbnb directory
 */

const expect = require('chai').expect;
const fs = require ('fs');
const path = require('path');
const process = require('child_process');

/**
 * Configurations
 */
const is = Object.prototype.isPrototypeOf;

// esbnb bin file
const esbnbin = path.join(__dirname, '../bin/index.js');

// configs directory where .eslintrc copy files are saved
const configsDirectory = path.join(__dirname, '../configs/');

// package.json configurations
const packageJson = path.join(__dirname, 'package.json');

const packageConfig = {
  withProjectName: {
    name: "my-project",
    description: 'my project',
    repository: {},
    devDependencies: {},
    license: 'UNLICENSED',
  },
  withNoProjectName: {
    description: 'my project',
    repository: {},
    devDependencies: {},
    license: 'UNLICENSED',
  },
};

// installed modules that esbnb should effectively installed
const installedModules = {
  airbnb: [
    'eslint',
    'eslint-plugin-import',
    'eslint-plugin-react',
    'eslint-plugin-jsx-a11y',
    'eslint-config-airbnb',
  ],
  base: [
    'eslint',
    'eslint-plugin-import',
    'eslint-config-airbnb-base',
  ],
  legacy: [
    'eslint',
    'eslint-plugin-import',
    'eslint-config-airbnb-base',
  ],
};

// node_modules path
const nodeModules = path.join(__dirname, 'node_modules');

// .eslintrc configurations
const eslintrc = path.join(__dirname, '.eslintrc');

const eslintConfig = {
  noExtends: {},
  extendsArray: {
    extends: []
  },
  extendsStrAirbnb: {
    extends: 'airbnb',
  },
  extendsStrAirbnbBase: {
    extends: 'airbnb-base',
  },
  extendsStrAirbnbLegacy: {
    extends: 'airbnb-base/legacy',
  },
  extendsStrNoAirbnb: {
    extends: 'my-extend',
  },
  extendsArrAirbnb: {
    extends: ['airbnb'],
  },
  extendsArrAirbnbBase: {
    extends: ['airbnb-base'],
  },
  extendsArrAirbnbLegacy: {
    extends: ['airbnb-base/legacy'],
  },
  extendsArrMultipleAirbnb: {
    extends: ['airbnb', 'airbnb-base', 'airbnb-base/legacy', 'my-extend', 'my-other-extend'],
  },
  extendsArrNoAirbnb: {
    extends: ['my-extend'],
  },
};

/**
 * Functions for creating or removing .eslintrc, package.json files,
 * node_modules directory, clear configs directory and run esbnb process
 */
const cleanDirSync = function cleanDirSync(dir, thenRemove) {
  const thenRemoveDir = is.call(Boolean.prototype, Object(thenRemove)) ? thenRemove : false;
  let cleaned;

  try {
    const files = fs.readdirSync(path.normalize(dir));

    if (files.length > 0) {
      files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          const deleted = cleanDirSync(filePath, true);

          if (!deleted) {
          console.error(`WARN ${filePath} has not been deleted`);
          }
        } else {
          fs.unlinkSync(filePath);
        }
      });
    }

    if (thenRemoveDir) {
      fs.rmdirSync(dir);
    }

    cleaned = true;
  } catch (e) {
    cleaned = false;
  }

  return cleaned;
};

const getJSON = function getJSON(file) {
  let json;

  try {
    json = JSON.parse(fs.readFileSync(path.normalize(file)));
  } catch (e) {
    json = {};
  }

  return json;
};

const getEslintrc = function getEslintrc() {
  return getJSON(eslintrc);
};

const createEslintrc = function createEslintrc(config) {
  fs.writeFileSync(eslintrc, JSON.stringify(config, null, 2));
};

const removeEslintrc = function removeEslintrc() {
  try {
    fs.unlinkSync(eslintrc);
  } catch (e) {}
};

const cleanConfigsDir = function cleanConfigsDir() {
  cleanDirSync(configsDirectory);
};

const getPackageJson = function getPackageJson() {
  return getJSON(packageJson);
};

const createPackageJson = function createPackageJson(config) {
  fs.writeFileSync(packageJson, JSON.stringify(config, null, 2));
};

const removePackageJson = function removePackageJson() {
  try {
    fs.unlinkSync(packageJson);
  } catch (e) {}
};

const removeNodeModules = function removeNodeModules() {
  return cleanDirSync(nodeModules, true);
};

const esbnb = function esbnb(...args) {
  // return process.spawnSync('node', [esbnbin, ...args]);
  return process.execSync(`cd test && node ${esbnbin} ${args.join(' ')}`);
};

/**
 * Spec
 */
describe('esbnb', function() {
  // test when no package.json
  context('when there is no package.json at the root of the project', function() {
    before(function() {
      removePackageJson();
      removeEslintrc();
      removeNodeModules();
    });

    it('should exit process', function() {
      expect(() => {
        esbnb();
      }).to.throw(Error).and.to.have.property('status').and.to.equal(1);
    });
  });

  // test help
  context('when help is wanted or installing eslint with an unknown configuration', function() {
    before(function() {
      createPackageJson(packageConfig.withProjectName);
    });

    it('should output help with -h option', function() {
      const stdout = esbnb('-h');
      expect(stdout.toString('utf8')).to.include('HELP');
    });

    it('should output help with -help option', function() {
      const stdout = esbnb('-help');
      expect(stdout.toString('utf8')).to.include('HELP');
    });

    it('should output help with bad argument', function() {
      const stdout = esbnb('xsjhdhdsjlq');
      expect(stdout.toString('utf8')).to.include('HELP');
    });
  });

  context('when the .eslintrc exists whatever the airbnb config to install', function() {
    context('when the project has a name', function() {
      before(function() {
        createPackageJson(packageConfig.withProjectName);
        createEslintrc(eslintConfig.extendsStrAirbnb);
        esbnb();
      });

      it('should copy the current .eslintrc to the esbnb "configs" directory and in a subdirectory in the name of the project', function() {
        const savedConfigsDirectory = fs.readdirSync(configsDirectory);

        expect(savedConfigsDirectory).to.contain(packageConfig.withProjectName.name);
      });
    });

    context('when the project has no name', function() {
      before(function() {
        createPackageJson(packageConfig.withNoProjectName);
        createEslintrc(eslintConfig.extendsStrAirbnb);
        esbnb();
      });

      it('should copy the current .eslintrc to the esbnb "configs" directory and in a subdirectory named "anonymous"', function() {
        const savedConfigsDirectory = fs.readdirSync(configsDirectory);

        expect(savedConfigsDirectory).to.contain('anonymous');
      });
    });
  });

  // test airbnb configuration
  context('when installing eslint with airbnb configuration (with no CLI argument)', function() {
    context('when installed', function() {
      before(function() {
        createPackageJson(packageConfig.withProjectName);
        removeNodeModules();
        cleanConfigsDir();
        esbnb();
      });

      it('should have corresponding modules in "node_modules" directory', function() {
        const modules = fs.readdirSync(nodeModules);

        installedModules.airbnb.forEach(module => expect(modules).to.contain(module));
      });

      it('should have modules saved in package.json devDependencies', function() {
        const { devDependencies } = getPackageJson();

        installedModules.airbnb.forEach(module => expect(devDependencies).to.have.property(module));
      });

      after(function() {
        removeNodeModules();
        cleanConfigsDir();
        removeEslintrc();
      });
    });

    context('when the .eslintrc file does not exist', function() {
      before(function() {
        createPackageJson(packageConfig.withProjectName);
        removeEslintrc();
        cleanConfigsDir();
        removeNodeModules();
        esbnb();
      });

      it('should create a new one with the extended option and the proper airbnb configuration', function() {
        const { extends: ext } = getEslintrc();
        expect(ext).to.exist.and.to.equal(eslintConfig.extendsStrAirbnb.extends);
      });

      after(function() {
        cleanConfigsDir();
        removeEslintrc();
        removeNodeModules();
      });
    });

    context('when a .eslintrc file exists', function() {
      context('when the same airbnb config is already extended and is a string', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsStrAirbnb);
          esbnb();
        });

        it('should keep it in the .eslintrc as a string in the extends property', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.equal(eslintConfig.extendsStrAirbnb.extends);
        });
      });

      context('when another airbnb config is already extended and is a string', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsStrAirbnbBase);
          esbnb();
        });

        it('should replace it in the .eslintrc with the proper one installed in the extends property', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.equal(eslintConfig.extendsStrAirbnb.extends);
        });
      });

      context('when a config other than Airbnb ones is extended and is a string', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsStrNoAirbnb);
          esbnb();
        });

        it('should keep it and add both the airbnb one and the existing one into an array in the extends property of the .eslintrc', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array');
          expect(ext).to.contain(eslintConfig.extendsStrNoAirbnb.extends);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnb.extends);
        });
      });

      context('when the same airbnb config is already extended in an array', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsArrAirbnb);
          esbnb();
        });

        it('should keep it in the extends property of the .eslintrc as an array', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array').and.to.have.length(1);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnb.extends);
        });
      });

      context('when another airbnb config is already extended in an array', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsArrAirbnbBase);
          esbnb();
        });

        it('should replace it in the extends property of the .eslintrc with the proper one installed as an array', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array').and.to.have.length(1);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnb.extends);
        });
      });

      context('when other airbnb configs are already extended in an array', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsArrMultipleAirbnb);
          esbnb();
        });

        it('should replace them with the proper one installed in the extends property of the .eslintrc and keep all no Airbnb configs extended if exist as an array', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array').and.to.have.length(3);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnb.extends);
          expect(ext).to.contain('my-extend');
          expect(ext).to.contain('my-other-extend');
        });
      });

      context('when a config other than Airbnb ones is extended in an array', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsArrNoAirbnb);
          esbnb();
        });

        it('should keep it and add the airbnb config into the array in the extends property of the .eslintrc', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array').and.to.have.length(2);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnb.extends);
          expect(ext).to.contain('my-extend');
        });
      });

      context('when there is no extends property', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.noExtends);
          esbnb();
        });

        it('should create the extends property with the proper airbnb configuration in the .eslintrc as a string', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.exist.and.to.equal(eslintConfig.extendsStrAirbnb.extends);
        });
      });
    });

    after(function() {
      cleanConfigsDir();
      removeEslintrc();
      removeNodeModules();
    });
  });

  // test airbnb-base configuration
  context('when installing eslint with airbnb base configuration (with "base" argument)', function() {
    context('when installed', function() {
      before(function() {
        createPackageJson(packageConfig.withProjectName);
        removeNodeModules();
        cleanConfigsDir();
        esbnb('base');
      });

      it('should have corresponding modules in "node_modules" directory', function() {
        const modules = fs.readdirSync(nodeModules);

        installedModules.base.forEach(module => expect(modules).to.contain(module));
      });

      it('should have modules saved in package.json devDependencies', function() {
        const { devDependencies } = getPackageJson();

        installedModules.base.forEach(module => expect(devDependencies).to.have.property(module));
      });

      after(function() {
        removeNodeModules();
        cleanConfigsDir();
        removeEslintrc();
      });
    });

    context('when the .eslintrc file does not exist', function() {
      before(function() {
        createPackageJson(packageConfig.withProjectName);
        removeEslintrc();
        cleanConfigsDir();
        removeNodeModules();
        esbnb('base');
      });

      it('should create a new one with the extended option and the proper airbnb configuration', function() {
        const { extends: ext } = getEslintrc();
        expect(ext).to.exist.and.to.equal(eslintConfig.extendsStrAirbnbBase.extends);
      });

      after(function() {
        cleanConfigsDir();
        removeEslintrc();
        removeNodeModules();
      });
    });

    context('when a .eslintrc file exists', function() {
      context('when the same airbnb config is already extended and is a string', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsStrAirbnbBase);
          esbnb('base');
        });

        it('should keep it in the .eslintrc as a string in the extends property', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.equal(eslintConfig.extendsStrAirbnbBase.extends);
        });
      });

      context('when another airbnb config is already extended and is a string', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsStrAirbnb);
          esbnb('base');
        });

        it('should replace it in the .eslintrc with the proper one installed in the extends property', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.equal(eslintConfig.extendsStrAirbnbBase.extends);
        });
      });

      context('when a config other than Airbnb ones is extended and is a string', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsStrNoAirbnb);
          esbnb('base');
        });

        it('should keep it and add both the airbnb-base one and the existing one into an array in the extends property of the .eslintrc', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array');
          expect(ext).to.contain(eslintConfig.extendsStrNoAirbnb.extends);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnbBase.extends);
        });
      });

      context('when the same airbnb config is already extended in an array', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsArrAirbnbBase);
          esbnb('base');
        });

        it('should keep it in the extends property of the .eslintrc as an array', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array').and.to.have.length(1);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnbBase.extends);
        });
      });

      context('when another airbnb config is already extended in an array', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsArrAirbnb);
          esbnb('base');
        });

        it('should replace it in the extends property of the .eslintrc with the proper one installed as an array', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array').and.to.have.length(1);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnbBase.extends);
        });
      });

      context('when other airbnb configs are already extended in an array', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsArrMultipleAirbnb);
          esbnb('base');
        });

        it('should replace them with the proper one installed in the extends property of the .eslintrc and keep all no Airbnb configs extended if exist as an array', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array').and.to.have.length(3);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnbBase.extends);
          expect(ext).to.contain('my-extend');
          expect(ext).to.contain('my-other-extend');
        });
      });

      context('when a config other than Airbnb ones is extended in an array', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsArrNoAirbnb);
          esbnb('base');
        });

        it('should keep it and add the airbnb config into the array in the extends property of the .eslintrc', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array').and.to.have.length(2);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnbBase.extends);
          expect(ext).to.contain('my-extend');
        });
      });

      context('when there is no extends property', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.noExtends);
          esbnb('base');
        });

        it('should create the extends property with the proper airbnb configuration in the .eslintrc as a string', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.exist.and.to.equal(eslintConfig.extendsStrAirbnbBase.extends);
        });
      });
    });

    after(function() {
      cleanConfigsDir();
      removeEslintrc();
      removeNodeModules();
    });
  });

  // test airbnb-base/legacy configuration
  context('when installing eslint with airbnb legacy configuration (with "legacy" argument)', function() {
    context('when installed', function() {
      before(function() {
        createPackageJson(packageConfig.withProjectName);
        removeNodeModules();
        cleanConfigsDir();
        esbnb('legacy');
      });

      it('should have corresponding modules in "node_modules" directory', function() {
        const modules = fs.readdirSync(nodeModules);

        installedModules.legacy.forEach(module => expect(modules).to.contain(module));
      });

      it('should have modules saved in package.json devDependencies', function() {
        const { devDependencies } = getPackageJson();

        installedModules.legacy.forEach(module => expect(devDependencies).to.have.property(module));
      });

      after(function() {
        removeNodeModules();
        cleanConfigsDir();
        removeEslintrc();
      });
    });

    context('when the .eslintrc file does not exist', function() {
      before(function() {
        createPackageJson(packageConfig.withProjectName);
        removeEslintrc();
        cleanConfigsDir();
        removeNodeModules();
        esbnb('legacy');
      });

      it('should create a new one with the extended option and the proper airbnb configuration', function() {
        const { extends: ext } = getEslintrc();
        expect(ext).to.exist.and.to.equal(eslintConfig.extendsStrAirbnbLegacy.extends);
      });

      after(function() {
        cleanConfigsDir();
        removeEslintrc();
        removeNodeModules();
      });
    });

    context('when a .eslintrc file exists', function() {
      context('when the same airbnb config is already extended and is a string', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsStrAirbnbLegacy);
          esbnb('legacy');
        });

        it('should keep it in the .eslintrc as a string in the extends property', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.equal(eslintConfig.extendsStrAirbnbLegacy.extends);
        });
      });

      context('when another airbnb config is already extended and is a string', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsStrAirbnb);
          esbnb('legacy');
        });

        it('should replace it in the .eslintrc with the proper one installed in the extends property', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.equal(eslintConfig.extendsStrAirbnbLegacy.extends);
        });
      });

      context('when a config other than Airbnb ones is extended and is a string', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsStrNoAirbnb);
          esbnb('legacy');
        });

        it('should keep it and add both the airbnb-base/legacy one and the existing one into an array in the extends property of the .eslintrc', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array');
          expect(ext).to.contain(eslintConfig.extendsStrNoAirbnb.extends);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnbLegacy.extends);
        });
      });

      context('when the same airbnb config is already extended in an array', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsArrAirbnbLegacy);
          esbnb('legacy');
        });

        it('should keep it in the extends property of the .eslintrc as an array', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array').and.to.have.length(1);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnbLegacy.extends);
        });
      });

      context('when another airbnb config is already extended in an array', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsArrAirbnb);
          esbnb('legacy');
        });

        it('should replace it in the extends property of the .eslintrc with the proper one installed as an array', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array').and.to.have.length(1);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnbLegacy.extends);
        });
      });

      context('when other airbnb configs are already extended in an array', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsArrMultipleAirbnb);
          esbnb('legacy');
        });

        it('should replace them with the proper one installed in the extends property of the .eslintrc and keep all no Airbnb configs extended if exist as an array', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array').and.to.have.length(3);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnbLegacy.extends);
          expect(ext).to.contain('my-extend');
          expect(ext).to.contain('my-other-extend');
        });
      });

      context('when a config other than Airbnb ones is extended in an array', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.extendsArrNoAirbnb);
          esbnb('legacy');
        });

        it('should keep it and add the airbnb config into the array in the extends property of the .eslintrc', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.be.a('array').and.to.have.length(2);
          expect(ext).to.contain(eslintConfig.extendsStrAirbnbLegacy.extends);
          expect(ext).to.contain('my-extend');
        });
      });

      context('when there is no extends property', function() {
        before(function() {
          createPackageJson(packageConfig.withProjectName);
          createEslintrc(eslintConfig.noExtends);
          esbnb('legacy');
        });

        it('should create the extends property with the proper airbnb configuration in the .eslintrc as a string', function() {
          const { extends: ext } = getEslintrc();
          expect(ext).to.exist.and.to.equal(eslintConfig.extendsStrAirbnbLegacy.extends);
        });
      });
    });

    after(function() {
      cleanConfigsDir();
      removeEslintrc();
      removeNodeModules();
    });
  });
});
