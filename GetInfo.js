var request = require("request");
var token = '';
//var refToken = '';
var sites = [];
var groups = []; 
var events = []; 
var deviceIp = [];


//Login and get Authentication Token
function login(userName, passWord){
    console.log('Login:')
    return new Promise((resolve, reject) => {
        var options = { 
                        method: 'POST',
                        url: 'http://192.168.127.20/login/',
                        headers: { 
                                    'Content-Type': 'application/json' 
                                 }, 
                        body: {
                                'username': userName,
                                'password': passWord
                              },
                        json:true
                        };
        request(options, function (error, response, body) {
            if (error){
                reject({
                    'Error':error
                });
            } else {
                resolve(token = body.mxviewGateway);
            }
        });
    });
}

//Refresh token
/*function refresh(){
    return new Promise((resolve, reject) => {
        var options = { 
                        method: 'GET',
                        url: 'http://192.168.127.20/login/refresh/',
                        headers:{
                                    'Authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json' 
                                } 
                      };
        
        request(options, function (error, response, body) {
          if (error){
              reject({
                  'error':error
              });
          } else {
              var nodeObj = JSON.parse(body);
              var newToken = nodeObj.mxviewGateway;
              resolve(refToken = newToken);
          }
        });
    });
}
*/

//Get site ID
function getSites(token, socket){
    console.log('\n' + "getSite:");
    return new Promise((resolve, reject) => {
        var options = {
            method: 'GET',
            url: 'http://192.168.127.20/api/sites',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        }
        request(options, function(error, response, body){
            if (error){
                reject({
                    'error':error
                });
            } else {
                var nodeObj = JSON.parse(body);
                nodeObj.forEach((item)=>{
                    console.log(item.site_name + "  " + item.site_id + '\n');
                    sites.push([item.site_name, item.site_id]);
                })
                resolve(socket.emit("trigger_sites", sites));
            }
        });
    });
}

//Get all groups from one site
function getGroups(token, siteArray, socket){
    console.log("getGroups:");
    return new Promise((resolve, reject)=>{
        siteArray.forEach((items)=>{
            var options = {
                method:'GET',
                url:'http://192.168.127.20/api/groups/site/' + items[1],
                headers:{
                            'Authorization': 'Bearer ' + token,
                            'Content-Type':'application/json'
                        }
            }
            request(options, function(error, response, body){
            if(error){
                reject("getGroups: Something went wrong.");
            } else {
                var nodeObj = JSON.parse(body);
                nodeObj.forEach((items)=>{
                    console.log(items.name + "  " + items.id + "    " + items.parent_id);
                    groups.push([items.name, items.id, items.parent_id]);    
                });
                resolve(socket.emit("trigger_groups", groups));
            }
        });
    });
})
}

//Get five events
function getEvents(token, siteArray, socket){
    console.log('\n' + "getEvents: ");
    return new Promise((resolve, reject)=>{
        siteArray.forEach((siteItem)=>{
            var options = {
                method:'GET',
                url:'http://192.168.127.20/api/events/site/' + siteItem[1] + '?count=5&acked=false',
                headers:{
                    'Authorization':'Bearer ' + token,
                    'Content-Type':'application/json'
                }
            }
            request(options, function(error, response, body){
                if(error){
                    reject("getEvents: Something went wrong");
                } else {
                    var nodeObj = JSON.parse(body);
                    nodeObj.forEach((item)=>{
                        console.log(JSON.stringify(item));
                        events.push(JSON.stringify(item));
                    });
                    resolve(socket.emit("trigger_events", events));
                }
            });
        });
    });
}

//Get device ip
function getDeviceIp(token, groupArray, siteArray, socket){
    console.log('\n' + "getDeviceIp: ");
    return new Promise((resolve, reject)=>{
        siteArray.forEach((siteItem)=>{
            groupArray.forEach((groupItem)=>{
                var options = {
                    method:'GET',
                    url:'http://192.168.127.20/api/devices/group/' + groupItem[1] + '/site/' + siteItem[1],
                    headers:{
                        'Authorization':'Bearer ' + token,
                        'Content-Type':'application/json'
                    }
                }
                request(options, function(error, response, body){
                    if(error){
                        reject("getDeviceIp: Something went wrong");
                    } else {
                        var nodeObj = JSON.parse(body);
                        nodeObj.forEach((item)=>{
                            console.log(item.ip);
                            deviceIp.push(item.ip);
                        });
                        resolve(socket.emit("trigger_deviceIp", deviceIp));
                    }
                });
            });
        });
    });
}

//Identify and sort child groups
/*function sortChildGroups(groupArray){
    var hashtable = [];
    groupArray.forEach((outer)=>{
        if(hashtable.length == 0){
            hashtable.push([outer[2], 0]);
        } else {
            var index = arrayContains(hashtable, outer[2]);
            if(index == null){
                hashtable.push([outer[2], 1]);
            } else {
                hashtable[index][1]++;
            }
        }
    });
}*/

/*function sortChildGroups(groupArray){
    var superGroup = [];
    groupArray.forEach((outer)=>{
        var subgroup = [];
        groupArray.forEach((inner)=>{
            if(outer[1] == inner[2]){
                subgroup.push[outer[0]];
            }
        });
        superGroup.push(subgroup);
    });
}
*/

/*function arrayContains(arr, key){
    var keyIndex;
    arr.forEach((items, index)=>{
        if(items[0] == key){
            keyIndex = index;
        } else {
            keyIndex = null;
        }
    });
    return keyIndex;
}*/

//Print current token
function exportToken(){
    console.log('Token: ' + token);
}

/*function getNewtoken(){
    console.log('New token: ' + refToken);
}*/

function exportSites(socket, siteArray){
    socket.emit("trigger_sites", siteArray);
}

function exportGroups(socket, groupArray){
    socket.emit("trigger_groups", groupArray);
}

function exportEvents(socket, eventArray){
    socket.emit("trigger_events", eventArray);
}

function exportDeviceIp(socket, deviceIpArray){
    socket.emit("trigger_deviceIp", deviceIpArray);
}

function process(sockets){
    login('admin', 'moxa')
    .then(exportToken)
    .catch((message)=>console.log(message.error))

    .then(()=>getSites(token, sockets))
    .catch((message)=>console.log(message.error))

    //.then(()=>exportSites(sockets, sites))
    //.catch((message)=>console.log(message.error))

    .then(()=>getGroups(token, sites, sockets))
    .catch((message)=>console.log(message.error))

    //.then(()=>exportGroups(sockets, groups))
    //.catch((message)=>console.log(message.error))

    .then(()=>getEvents(token, sites, sockets))
    .catch((message)=>console.log(message.error))

    //.then(()=>exportEvents(sockets, events))
    //.catch((message)=>console.log(message.error))

    .then(()=>getDeviceIp(token, groups, sites, sockets))
    .catch((message)=>console.log(message.error))

    //.then(()=>exportDeviceIp(sockets, deviceIp))
    //.catch((message)=>console.log(message.error))
}

module.exports = process;