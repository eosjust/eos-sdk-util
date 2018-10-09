# eos-sdk-util
## 用法：
### 初始化
```
import eossdkutil from 'eos-sdk-util';
var that = this;
if (eossdkutil) {
   window.eossdkutil = eossdkutil;
   //eossdkutil.setScatterNetworkTest();//按需选择测试或正式网络
   eossdkutil.setScatterNetworkMain();
   eossdkutil.init().then(function () {
    var env = eossdkutil.getEnv();
    if (env == "tp") {
       //当前环境是tp
    } else if (env == "scatter") {
       //当前环境是scatter
    } else {
    }
   });
}
```

### scatter 登录
```
eossdkutil.login().then(function (identity) {
   that.initScatterName();
});
```

### scatter 退出
```
eossdkutil.logout();
```

### 获取scatter用户

```
var identity = eossdkutil.getScatterIdentity();
var that = this;
if (identity) {
   var account = identity.accounts.find(account => account.blockchain === 'eos');
} else {

}
```

### 获取tp钱包列表

```
eossdkutil.getWallets().then(function (data) {

});
```

### 发action

```
        var eossdkutil = window.eossdkutil;
        var that = this;
        eossdkutil.pushEosAction({
          actions: [
            {
              account: "contractaccountname",
              name: "transfer",
              authorization: [
                {
                  actor: "eosaccountname",
                  permission: "active"
                }
              ],
              data: {
                from: that.$store.state.eosUserName,
                to:that.farmcontract,
                quantity: Big(that.buyeos).toFixed(4) + " EOS",
                memo:"buytree:"+that.selecttree.pos+";"+"justtest2222",
              }
            }
          ]
        }).then(function (result) {

        }).catch(function (error) {

        });
```

### 获取table
```
        var that = this;
        var eossdkutil = window.eossdkutil;
        eossdkutil.getEosTableRows(
          {
            json: true,
            code: that.farmcontract,
            scope: that.farmcontract,
            table: 'gameinfo',
            limit: 20
          }
        ).then(function (result) {
          var rows = result.data.rows;
          var len = rows.length;
          var inx = len - 1;
          var gameinfo = rows[inx];
          that.gameinfo = gameinfo;
        }).catch(function (error) {

        });
```