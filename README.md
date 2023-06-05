<h1 align="center">esbnb<h1>

<p align="center">
  The ESLint with Airbnb configuration installer.
<p>

# Table of Contents

- [Installation](#installation)
- [Technical information](#technical-information)
  - [Node.js](#nodejs)
  - [Tests](#tests)
- [Usage](#usage)
- [Code of Conduct](#code-of-conduct)
- [Contributing](#contributing)
- [Support](#support)
- [Security](#security)
- [License](#license)

# Installation

It is recommended to install *esbnb* globally.

`npm i -g esbnb`

# Technical information

## Node.js

- Language: JavaScript ES6/ES7
- VM: Node.js >=8.17.0

## Tests

### Linting

ESLint with Airbnb base rules. See [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

`npm run lint`

### Unit

Mocha and Chai. Prefer using at least Node.js 12.x.x to run tests.

`npm test`

# Usage

ESLint can be installed with 3 configurations from Airbnb: `airbnb`, `airbnb-base` and `airbnb-base/legacy`.

For more details on which packages are installed with ESlint see :

- [ESLint with Airbnb config](https://www.npmjs.com/package/eslint-config-airbnb);
- [ESLint with Airbnb base and legacy config](https://www.npmjs.com/package/eslint-config-airbnb-base).

## Install ESLint with the Airbnb ESLint rules, including ECMAScript 6+ and React (default)

At the root of your project, run:

`esbnb`

## Install ESLint with the Airbnb ESLint rules, including ECMAScript 6+ (base)

At the root of your project, run:

`esbnb base`

## Install ESLint with the Airbnb ESLint rules, including ECMAScript 5 and below (legacy)

At the root of your project, run:

`esbnb legacy`

## Need basic help ?

At the root of your project, run:

`esbnb -h||-help`

## Configuration

No configuration are required from your own.

*esbnb* installs and automatically configures your `.eslintrc` file. It only adds the configuration name in the `extends` property. If some values were present that are not an Airbnb config name, the `extends` property will be an array with all these values plus the Airbnb one. If another Airbnb config is found, it will be replaced by the one being installed.

Before any process, a copy of your `.eslintrc` is made in the case of something would go wrong. You'll find it in the *esbnb* package installed globally in the *configs* directory.

If no `.eslintrc` file were found, a new one will be created with proper configuration.

Example of a new *.eslintrc* file created when installing ESLint with Airbnb base configuration :

```javascript
{
  "extends": "airbnb-base"
}
```

Examples of an existing *.eslintrc* file already configured when installing ESLint with Airbnb base configuration :

Before:

```javascript
{
  "extends": "my-config"
}
```

After:

```javascript
{
  "extends": [
    "my-config",
    "airbnb-base"
  ]
}
```

Before:

```javascript
{
  "extends": "airbnb-base/legacy"
}
```

After:

```javascript
{
  "extends": "airbnb-base"
}
```

# Code of Conduct

This project has a [Code of Conduct](.github/CODE_OF_CONDUCT.md). By interacting with this repository, organization, or community you agree to abide by its terms.

# Contributing

Please have a look at our [TODO](TODO.md) for any work in progress.

Please take also a moment to read our [Contributing Guidelines](.github/CONTRIBUTING.md) if you haven't yet done so.

# Support

Please see our [Support](.github/SUPPORT.md) page if you have any questions or for any help needed.

# Security

For any security concerns or issues, please visit our [Security Policy](.github/SECURITY.md) page.

# License

[MIT](LICENSE.md).
