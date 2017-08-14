const qs = require('qs');
const parse = require('url').parse;
const isString = require('is-string');
const { buffer, createError } = require('micro');

const query = async (unk, options) => {
  if (isString(unk)) {
    return qs.parse(unk, options);
  } else if (Buffer.isBuffer(unk)) {
    return query(unk.toString(), options);
  } else if (typeof unk === 'function') {
    return async (req, res) => unk(await query(req, options), res);
  } else if (unk.url || unk.headers) {
    unk.query = {}; // we populate query regardless
    if (unk.url && isString(unk.url)) {
      const query_string = parse(unk.url).query || '';
      unk.query = await query(query_string, options);
    }
    const headers = unk.headers;
    const ctype = headers && isString(headers['content-type']) && headers['content-type'];
    const hasUrlEncodedBody = ctype && ctype.includes('form-urlencoded');
    if(hasUrlEncodedBody) {
      unk.body = await query(await buffer(unk), options);
    }
    // we don't try to populate body if it wasn't form-urlencoded
    return unk;
  } else {
    const code = 500;
    const str = 'First argument to micro-urlencoded should be a string, Buffer, function, or IncomingMessage.';
    throw createError(code, str);
  }
};

module.exports = query;



