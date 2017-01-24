# esbnb, the eslint airbnb config installer

###Installation

It is recommended to install esbnb globally.

`npm i -g esbnb`

###Usage

#####Install Airbnb config (by default)

Run `esbnb` at the root of your project.


#####Install Airbnb base config

Run `esbnb base` at the root of your project.

#####Install Airbnb base/legacy config

Run `esbnb legacy` at the root of your project.


###Configuration

.eslintrc:
```javascript
{
  "extends": "airbnb" // or airbnb-base or airbnb-base/legacy
}
```

esbnb install and automatically configure your `.eslintrc` file. It only adds the configuration name in the `extends` property. If some values were present that are not airbnb config name, the `extends` property will be an array with all configuration name to be extended to.

Before any process, a copy of your `.eslintrc` is made in the case of something would go wrong. You'll find it in the **esbnb** package installed globally in the *configs* directory.

If no `.eslintrc` file were found, a new one will be created with proper configuration.


###Test

Run `npm test` to
- lint with eslint (airbnb config base),
- run mocha unit tests with Chai.

### Licence

The MIT License (MIT) Copyright © 2016 Adrien Valcke

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
