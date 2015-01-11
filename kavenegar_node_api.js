var http = require('http');
var querystring = require('querystring');

/*
 this is an API and should use in other files like this
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

 for read about what are returned data and more : http://kavenegar.com/rest.html
 Elyas Ghasemi(egh1374@gmail.com)
*/

//-----------------------------------------------------------------------------
// Variables
var myconst = {
    apikey: "your_API_key" ,
    apipath: "/v1/{apikey}/{domain}/{method}.json"
};

var utils = new Object();
var methods = new Object();
//-----------------------------------------------------------------------------
// Utils Section
utils.api = new Object();
utils.api.getApiPath = function (domain, method) {
    var result = myconst.apipath;
    result = result.replace("{apikey}", myconst.apikey);
    result = result.replace("{domain}", domain);
    result = result.replace("{method}", method);
    return result;
};
utils.rest = new Object();
utils.rest.doPost = function (url, params, callback) {
    var post_data = querystring.stringify(params);
    var post_options = {
        host: 'api.kavenegar.com',
        port: '80',
        path: url,
        method: 'POST',
        headers: {
            'Content-Length': post_data.length,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };

    var req = http.request(post_options, function (e) {
        e.setEncoding('utf8');
        e.on('data', function (chunk) {
            if (callback) callback(chunk);
        });
    });

    req.write(post_data, "utf8");
    req.on("error", function (e) {
        if(callback) callback(JSON.stringify({ error : e.message }));
    });
    req.end();
};
//---------------------------------------------------------------------------
//Methods

module.exports = (function () {
    var _return = {};

    _return.send = function (data, callback) {

        var model = {
            message: data.message || data.text ,
            sender: data.sender || "your_defult_sender_number",
            receptor: data.to || data.receptor || data.receiver
        }

        utils.rest.doPost(utils.api.getApiPath("sms", "send"), model, function (result) {
            result = JSON.parse(result);
            if (result.return.status == 200) {

                // check for delivery
                _return.status({ messageid: result.entries[0].messageid }, function (status) {
                    if (callback) callback(result, status);
                });
            } else if (callback) {
                callback(result);
            }
        });
    };

    _return.status = function (massageid, callback) {
        utils.rest.doPost(utils.api.getApiPath("sms", "status"), massageid, function (result) {
            result = JSON.parse(result);
            if (callback) callback(result);
        });
    };


    _return.select = function (massageid, callback) {
        utils.rest.doPost(utils.api.getApiPath("sms", "select"), massageid, function (result) {
            result = JSON.parse(result);
            if (callback) callback(result);
        });
    };

    _return.unread = function (data, callback) {

        var line = {
            linenumber: data.linenumber ,
            isread: data.isread || 0 // defult is unread messages 
        }

        utils.rest.doPost(utils.api.getApiPath("sms", "unreads"), line, function (result) {
            result = JSON.parse(result);
            if (callback) callback(result);
        });
    };


    _return.account_info = function (callback) {
        utils.rest.doPost(utils.api.getApiPath("account", "info"), {}, function (result) {
            result = JSON.parse(result);
            if (callback) callback(result);
        });
    };

    return _return;

})();

