# query and urlencoded parsing for micro

Parse query strings and form-urlencoded bodies for Zeit's Micro.

## Install

```sh
yarn add micro-urlencoded
# or
npm install --save micro-urlencoded
```

## Usage

The first argument to micro-urlencoded may be a string, Node Buffer, an async handler function, or an IncomingMessage object (or similar enough to one for `micro.buffer()`).

```js
const query = require('micro-urlencoded');
```

### string

```js

module.exports = async (req, res) {
  const url = 'https://example.com/whatever?query=starts&here=2';
  const queryString = require('url').parse(url);
  const queryObject = query(queryString);

};

```

### Buffer

```js

module.exports = async (req, res) {
  const buffer = micro.buffer(req);
  // do other things with the request body buffer...

  // if the buffer is url-encoded
  const body = query(buffer);

};

```

### IncomingMessage

```js

module.exports = async (req, res) {
  const {query, body} = query(req);

};

```


### function

```js

const handler = async (req, res) => {
  //  your handler code
};

module.exports = query(handler);

```


## License

The Unlicense, which is to say, public domain unless a license is required in your jurisdiction, in which case please follow the LICENSE file.
