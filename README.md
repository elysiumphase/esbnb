# esbnb, the ESLint with Airbnb configuration installer

## Requirements

- **OS**: macOS or linux
- **engines**: node carbon with npm >=6.13.4

## Installation

It is recommended to install *esbnb* globally.

`npm i -g esbnb`

## Usage

ESLint can be installed with 3 configurations from Airbnb: *airbnb*, *airbnb-base* and *airbnb-base/legacy*.

For more details on which packages are installed with ESlint see :
- [ESLint with Airbnb config](https://www.npmjs.com/package/eslint-config-airbnb)
- [ESLint with Airbnb base and legacy config](https://www.npmjs.com/package/eslint-config-airbnb-base)

#### Install ESLint with the Airbnb ESLint rules, including ECMAScript 6+ and React (default)

At the root of your project, run:

`esbnb`

#### Install ESLint with the Airbnb ESLint rules, including ECMAScript 6+ (base)

At the root of your project, run:

`esbnb base`

#### Install ESLint with the Airbnb ESLint rules, including ECMAScript 5 and below (legacy)

At the root of your project, run:

`esbnb legacy`

#### Need basic help ?

At the root of your project, run:

`esbnb -h||-help`


## Configuration

No configuration are required from your own.

*esbnb* install and automatically configure your `.eslintrc` file. It only adds the configuration name in the `extends` property. If some values were present that are not an Airbnb config name, the `extends` property will be an array with all these values plus the Airbnb one. If another Airbnb config is found, it will be replaced by the one being installed.

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

## Contribution

Please feel free to contribute to this little tool. Here are some work in progress:

- change the first arg to be `install` / `uninstall`
- add a command `esbnb uninstall airbnbConfigName`
- when running an installation and another airbnb config is found, this should first uninstall all the related packages properly and then install the specified packages

## Test

Run `npm test` to
- lint with ESLint (*airbnb-base* config),
- run mocha unit tests with Chai.

## Licence

The MIT License (MIT) Copyright © 2019 Adrien Valcke

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
