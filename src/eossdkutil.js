var Promise = require('promise');
var tp = require('tp-js-sdk');
var Eos = require('eosjs');
var axios = require('axios');
var timeout = require('timeout');


const scatterMainNetwork = {
    blockchain: 'eos',
    host: 'nodes.get-scatter.com',
    port: 443,
    protocol: 'https',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
};
const scatterTestNetwork = {
    blockchain: 'eos',
    host: 'api-kylin.meet.one',
    port: 443,
    protocol: 'https',
    chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
};

var eossdkutil = {
    scatterSdk: null,
    tpSdk: null,
    scatterNetwork: scatterMainNetwork,
    requiredFields: null,
    eosJsOption: null,
    scatterEosJs: null,
    init: function () {
        var canResolve = true;
        var that = this;
        return new Promise(function (resolve, reject) {
            timeout.timeout(1000, function () {
                if (canResolve) {
                    canResolve = false;
                    that.tpSdk = tp;
                    var scatter = window.scatter;
                    if (scatter) {
                        that.scatterSdk = scatter;
                        that.refreshScatterConfig();
                    }
                    resolve();
                }
            });
            document.addEventListener('scatterLoaded', scatterExtension => {
                if (canResolve) {
                    canResolve = false;
                    var scatter = window.scatter;
                    if (scatter) {
                        that.scatterSdk = scatter;
                        that.refreshScatterConfig();
                    }
                    resolve();
                }
            });
        });


    },
    getEnv: function () {
        if (this.tpSdk) {
            if (this.tpSdk.isConnected()) {
                return "tp";
            }
        }
        if (this.scatterSdk) {
            return "scatter";
        }
        return "none";
    },
    isConnected: function () {
        return this.tpSdk.isConnected();
    },
    refreshScatterConfig: function () {
        this.eosJsOption = {
            broadcast: true,
            sign: true,
            chainId: this.scatterNetwork.chainId
        };
        this.requiredFields = {
            accounts: [this.scatterNetwork]
        };
        this.scatterEosJs = this.scatterSdk.eos(
            this.scatterNetwork, Eos, this.eosJsOption, this.scatterNetwork.protocol
        );
    },
    setScatterNetworkCustom: function (network) {
        this.scatterNetwork = network;
    },
    setScatterNetworkMain: function () {
        this.scatterNetwork = scatterMainNetwork;
    },
    setScatterNetworkTest: function () {
        this.scatterNetwork = scatterTestNetwork;
    },
    login: function () {
        var that = this;
        if (that.scatterSdk) {
            return new Promise(function (resolve, reject) {
                that.scatterSdk.getIdentity(that.requiredFields).then(identity => {
                    resolve(identity);
                }).catch(error => {
                    //
                    reject(error);
                });
            });
        }
    },
    logout: function () {
        if (this.scatterSdk) {
            this.scatterSdk.forgetIdentity();
        }
    },
    getScatterIdentity: function () {
        if(this.scatterSdk){
            return this.scatterSdk.identity;
        }
        return null;
    },
    getAuthStr: function (account) {
        return {authorization: [`${account.name}@${account.authority}`]};
    },
    pushEosAction: function (params) {
        var that = this;
        var env=this.getEnv();
        if (env=="scatter") {
            return new Promise(function (resolve, reject) {
                that.refreshScatterConfig();
                var actor = params.actions[0].authorization[0].actor;
                var permitLevel = params.actions[0].authorization[0].permission;
                var code = params.actions[0].account;
                var action = params.actions[0].name;
                var data = params.actions[0].data;
                var requiredFields = that.requiredFields;
                var account = that.scatterSdk.identity.accounts.find(account => account.blockchain === 'eos');
                var accountStr = that.getAuthStr(account);
                var scatterEosJs = that.scatterSdk.eos(
                    that.scatterNetwork, Eos, that.eosJsOption, that.scatterNetwork.protocol);
                scatterEosJs.contract(code, {requiredFields}).then(contract => {
                    contract[action](data, accountStr).then(trx => {
                        resolve(trx);
                    }).catch(e => {
                        reject(e);
                    })
                });
            });
        } else if (env=="tp") {
            return new Promise(function (resolve, reject) {
                that.tpSdk.pushEosAction(params).then(result => {
                    resolve(result);
                }).catch(error => {
                    reject(error);
                });
            });
        }
    },
    getWallets: function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.tpSdk.getWalletList('eos').then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    },
    getEosTableRows: function (params) {
        var that = this;
        var env=this.getEnv();
        if (env=="tp") {
            return new Promise(function (resolve, reject) {
                tp.getTableRows(params).then(result => {
                    resolve(result);
                }).catch(error => {
                    reject(error);
                });
            });
        } else {
            return new Promise(function (resolve, reject) {
                let postdata = JSON.stringify(params);
                let nodeUrl=that.scatterNetwork.protocol+"://"+that.scatterNetwork.host;
                nodeUrl+="/v1/chain/get_table_rows";
                axios.post(nodeUrl, postdata)
                    .then(function (response) {
                        var result = new Object();
                        result.result = true;
                        result.msg = "success";
                        result.data = response.data;
                        resolve(result);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            });
        }
    }

}


module.exports = eossdkutil;