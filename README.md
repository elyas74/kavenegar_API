## kavenegar_API
nodejs kavanegar.com rest API.

sample usage :

```javascript
    var sms = require('./sms');    
    sms.send({ message : String , sender : String , to : String } ,function(send ,status){
        console.log(send);
        console.log(status);
    });
    
    sms.status({ messageid : Number } ,function(status){
        console.log(status);
    });
    
    sms.latest_out_box({ pagesize : Number },function(result){
        console.open(result);
    });
    
    sms.select({ messageid : Number },function(result){
        console.open(result);
    });
    
    sms.account_info(function(result){
        console.open(result);
    });
```
