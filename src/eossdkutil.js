var Promise = require('promise');

var eosTpSdk = null;
var eosScatterSdk = null;

const scatterMainNetwork = {
    blockchain: 'eos',
    host: 'nodes.get-scatter.com',
    port: 443,
    protocol: 'https',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
};
const scatterTestNetwork = {
    blockchain: 'eos',
    host: 'kylin.fn.eosbixin.com',
    port: 80,
    protocol: 'http',
    chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
};

var eossdkutil = {
    version: '1.0.0',
    setTpSdk:function (tp) {
        eosTpSdk=tp;
    },
    setScatterSdk:function (scatter) {
        eosScatterSdk=scatter;
    },
    isConnected: function () {

    }

}