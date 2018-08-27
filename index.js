var eossdkutil = require('./src/eossdkutil');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.eossdkutil === 'undefined') {
    window.eossdkutil = eossdkutil;
}

module.exports = eossdkutil;