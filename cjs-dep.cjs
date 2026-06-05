// A CommonJS module that internally requires a Node builtin — like node-forge does.
const crypto = require('crypto');
module.exports.hex = () => crypto.randomBytes(4).toString('hex');
