const qs = require('qs');
const micro = require('micro');
const listen = require('test-listen');
const request = require('request-promise');
const test = require('ava').test;
const urlEncoded = require('./index');
const success = { test: 'success' };
const simpleQuery = {
  one: 'first',
  two: 'second',
  other: 'more',
  arr: ['arr[first]', 'arr[second]', 'arr.third'],
  obj: {
    three: 'obj.third',
    four: 'obj.fourth',
  },
};
const queryExample = Object.assign({}, simpleQuery);
const bodyExample = Object.assign({}, simpleQuery);

const testRequest = async (handler, options) => {
  const service = micro(await urlEncoded(handler));
  options.uri = await listen(service);
  const body = await request(options);
  service.close();
  return body;
};

queryExample['this'] = 'is a query example';
bodyExample['this'] = 'is a body example';


test('a query string', async t => {
  const result = await urlEncoded(qs.stringify(simpleQuery));
  t.deepEqual(simpleQuery, result);
});

test('a query buffer', async t => {
  const buff = new Buffer(qs.stringify(simpleQuery));
  const result = await urlEncoded(buff);
  t.deepEqual(simpleQuery, result);
});


test('a request with query', async t => {
  const handler = async (req, res) => {
    t.deepEqual(queryExample, req.query);
    return success;
  };
  const options = { method: 'GET', qs: queryExample };
  const body = await testRequest(handler, options);
  t.deepEqual(JSON.parse(body).test, 'success');
});


test('a request with body', async t => {
  const handler = async (req, res) => {
    t.deepEqual(bodyExample, req.body);
    return success;
  };
  const options = { method: 'POST', form: bodyExample };
  const body = await testRequest(handler, options);
  t.deepEqual(JSON.parse(body).test, 'success');
});

test('a request with both', async t => {
  const handler = async (req, res) => {
    t.deepEqual(queryExample, req.query);
    t.deepEqual(bodyExample, req.body);
    return success;
  };
  const options = { method: 'POST', qs: queryExample, form: bodyExample };
  const body = await testRequest(handler, options);
  t.deepEqual(JSON.parse(body).test, 'success');
});
