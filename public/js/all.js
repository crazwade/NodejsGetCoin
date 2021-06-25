$('#new_asset_btn').hide();

var firebaseConfig = {
apiKey: "AIzaSyDkJewxvaXNz5778P9pusOzsO_EOTr3g_M",
authDomain: "coin-use2.firebaseapp.com",
databaseURL: "https://coin-use2-default-rtdb.firebaseio.com",
projectId: "coin-use2",
storageBucket: "coin-use2.appspot.com",
messagingSenderId: "716853522471",
appId: "1:716853522471:web:fd4e712fade56429a75e02",
measurementId: "G-XNHJT86XYJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

//user list
const user_list = [];
const user_asset = [];
var user = "";

//user login
function check_login(){

    var user_checkpoint = 0;
    var check_user = database.ref('account');
    var person = prompt("Please enter your name:");

    //check user if in the user list
    check_user.once('value',gotUser,errUser);

    function gotUser(data){
        var dataval = data.val();
        var keys = Object.keys(dataval);
        for(var i = 0; i<keys.length; i++){
            var k = keys[i];
            user_list[i] = dataval[k].user;
        }
        for(var j = 0 ; j < user_list.length ; j++){
            if(user_list[j]==person){
                user_checkpoint = 1;
            }else{

            }
        }
        login_goORfail(user_checkpoint,person);
    }
    function errUser(err){
        console.log(err);
    }

}

//check user 
function login_goORfail(checkpoint,name){
    if(checkpoint == 1){
        console.log(name+" login ok");
        $('#login_account').hide();
        $('#user_name').html("Hi, "+name);
        user = name;
        $('#new_asset_btn').show();
        updateCoin();
    }else if(checkpoint == 0){
        console.log(name+" No Found");
        alert("抱歉, 找不到使用者 "+name);
    }
}

var twd2usd;
var BTC = [];
var ETH = [];
var DOGE = [];
var USDT = [];
function open_add_page(){
    $('.jumbotron').show();
}

function close_add_page(){
    $('.jumbotron').hide();
    document.getElementById('coin_name').value = "";
    document.getElementById('cost_twd').value = "";
}

//從API拿美金匯率
function getUSD(){
    var request = new XMLHttpRequest()
    
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', 'http://127.0.0.1:3000/api/twd2usd')

    request.onload = function () {
        var data = JSON.parse(this.response)
        twd2usd = data.result[0];
        twd2usd = parseFloat(twd2usd);
        // console.log(twd2usd)
    }
    // Send request
    request.send()
}

//從API拿虛擬幣匯率
function getCoin(){
    var request = new XMLHttpRequest()

    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', 'http://127.0.0.1:3000/api/price-coin')

    request.onload = function () {
        var data = JSON.parse(this.response)
        var coin = data.result
        var cryptoCoins = "";
        //.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") 千字逗號
        //.replace(/,/g, "") 消除千字逗號
        for(var i = 0; i < coin.length; i++){
            if(coin[i].name == 'Bitcoin'){
                cryptoCoins += "<tr>";
                cryptoCoins += `<td> BTC </td>`;
                cryptoCoins += `<td>  ${coin[i].price} </td>`;
                var tmp = (coin[i].price).split("$");
                BTC[0] = parseFloat((tmp[1].replace(/,/g, "")));
                BTC[1] = (BTC[0]*twd2usd).toFixed(3);
                tmp = BTC[1].toString();
                tmp = tmp.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                cryptoCoins += `<td>NT$  ${tmp} </td>`;
                cryptoCoins += "</tr>";
                BTC[1] = parseFloat(BTC[1]);

            }else if(coin[i].name == 'Ethereum'){
                cryptoCoins += "<tr>";
                cryptoCoins += `<td> ETH </td>`;
                cryptoCoins += `<td>  ${coin[i].price} </td>`;
                var tmp = (coin[i].price).split("$");
                ETH[0] = parseFloat((tmp[1].replace(/,/g, "")));
                ETH[1] = (ETH[0]*twd2usd).toFixed(3);
                tmp = ETH[1].toString();
                tmp = tmp.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                cryptoCoins += `<td>NT$  ${tmp} </td>`;
                cryptoCoins += "</tr>";
                ETH[1] = parseFloat(ETH[1]);

            }else if(coin[i].name == 'Dogecoin'){
                cryptoCoins += "<tr>";
                cryptoCoins += `<td> DOGE </td>`;
                cryptoCoins += `<td>  ${coin[i].price} </td>`;
                var tmp = (coin[i].price).split("$");
                DOGE[0] = parseFloat((tmp[1].replace(/,/g, "")));
                DOGE[1] = (DOGE[0]*twd2usd).toFixed(3);
                tmp = DOGE[1].toString();
                tmp = tmp.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                cryptoCoins += `<td>NT$  ${tmp} </td>`;
                cryptoCoins += "</tr>";
                DOGE[1] = parseFloat(DOGE[1]);

            }else if(coin[i].name == 'Tether'){
                cryptoCoins += "<tr>";
                cryptoCoins += `<td> USDT </td>`;
                cryptoCoins += `<td>  ${coin[i].price} </td>`;
                var tmp = (coin[i].price).split("$");
                USDT[0] = parseFloat((tmp[1].replace(/,/g, "")));
                USDT[1] = (USDT[0]*twd2usd).toFixed(3);
                tmp = USDT[1].toString();
                tmp = tmp.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                cryptoCoins += `<td>NT$  ${tmp} </td>`;
                cryptoCoins += "</tr>";
                USDT[1] = parseFloat(USDT[1]);
                
            }
        }
        document.getElementById("coin_data").innerHTML = cryptoCoins;

    }
    // Send request
    request.send()
}

var myCoin_name = [];
var myCoin_twd = [];
var myCoin_date = [];
var myCoin_key = [];
var myCoin_many = [];


//更新資產狀態
function updateCoin(){
    //check if user has asset
    var check_userifasset = database.ref('cost');
    var owner_asset_checkpoint = 0;
    check_userifasset.once('value',check_asset,check_asset_err);

    function check_asset(data){
        var asset_owner = data.val();
        asset_owner = Object.keys(asset_owner);
        for(var i = 0; i < asset_owner.length ; i ++){
            if(asset_owner[i]== user){
                owner_asset_checkpoint = 1;
            }else{
                
            }
        }
        show_asset(owner_asset_checkpoint)
    }
    function check_asset_err(err){
        console.log(err);
    }
    
}

//顯示資產狀況
function show_asset(checkpoint){
    var cryptoMyCoins = "";
    if(checkpoint == 1){
        var myCoinVal = database.ref('cost/'+user);
        //get user's asset
        myCoinVal.once('value',gotUserCoin,errUserCoin);
        var cryptoMyCoins = "";
        function gotUserCoin(data){
            
            var dataval = data.val();
            var keys = Object.keys(dataval);

            for(var i = 0; i<keys.length; i++){
                var k = keys[i];
                myCoin_key[i] = k;
                myCoin_name[i] = dataval[k].coin_name;
                myCoin_twd[i] = dataval[k].cost_twd;
                myCoin_date[i] = dataval[k].time;
                myCoin_many[i] = dataval[k].coin_many;
        
                var coin_hold = myCoin_twd[i]*myCoin_many[i];
        
                if(myCoin_name[i]=='BTC'){
                    var now_coin = myCoin_many[i]*BTC[1];
                }else if(myCoin_name[i]=='ETH'){
                    var now_coin = myCoin_many[i]*ETH[1];
                }else if(myCoin_name[i]=='DOGE'){
                    var now_coin = myCoin_many[i]*DOGE[1];
                }else if(myCoin_name[i]=='USDT'){
                    var now_coin = myCoin_many[i]*LTC[1];
                }
        
                var coin_winORlose = now_coin - coin_hold;
        
                cryptoMyCoins += "<tr>";
                cryptoMyCoins += `<td> ${myCoin_name[i]} </td>`;
                cryptoMyCoins += `<td>  ${myCoin_many[i]} </td>`;
                cryptoMyCoins += `<td>  ${coin_hold.toFixed(3)} </td>`;

                if(coin_winORlose>0){
                    cryptoMyCoins += `<td style='background-color: #83F675;font-size: x-large;'> NT$ ${coin_winORlose.toFixed(3)} </td>`;
                }else{
                    cryptoMyCoins += `<td style='background-color: #F8694B;font-size: x-large;'> NT$ ${coin_winORlose.toFixed(3)} </td>`;
                }
                
                cryptoMyCoins += `<td> <button type="button" class="btn btn-outline-danger" onclick="RemoveCoin('${myCoin_key[i]}')">移除</button> </td>`;
                cryptoMyCoins += `<td>  ${myCoin_date[i]} </td>`;
                cryptoMyCoins += "</tr>";
            }
            document.getElementById("mycoin_data").innerHTML = cryptoMyCoins;
        }
        function errUserCoin(err){
            console.log(err);
        }
    }else{
        cryptoMyCoins= "<tr>您還沒有任何資產喔</tr>"
        document.getElementById("mycoin_data").innerHTML = cryptoMyCoins;
    }
}

//新增資產
function new_asset(){
    var coin_name = document.getElementById('coin_name').value;
    var cost_twd = document.getElementById('cost_twd').value;
    var coin_many = document.getElementById('cost_coin_many').value;

    
    document.getElementById('coin_name').value = "";
    document.getElementById('cost_twd').value = "";
    document.getElementById('cost_coin_many').value = "";

    var tmp = Date();
    var now = tmp.split(' GMT');
    var now_time = now[0];
    
    //新增到資料庫'cost/使用者'的目錄
    var ref = database.ref('cost/'+user);

    var input = {
        coin_name: `${coin_name}`,
        cost_twd:`${cost_twd}`,
        coin_many:`${coin_many}`,
        time:`${now_time}`
    }

    //新增到資料庫
    ref.push(input);
    var check = 1;
    show_asset(check);  
    
}

//del asset
function RemoveCoin(x){
    var removeRef = database.ref('cost/'+user+'/'+x);
    removeRef.remove();
    var check = 1;
    show_asset(check);
}

//每30秒刷新一次
setInterval("Refresh_data()","120000");

function Refresh_data(){
    console.log("重新整理");
    //虛擬幣價格
    getCoin();
    //有登入就刷新
    if(user){
        var check = 1;
        show_asset(check)
    }else{

    }
    
}

