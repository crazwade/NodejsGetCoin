//import
const axios = require('axios')
const cheerio = require('cheerio')
const { children } = require('cheerio/lib/api/traversing')
const express = require('express')
const app = express()

//port
const port = 3000

//static files
app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/img',express.static(__dirname + 'public/img'))

//Set views
app.set('views','./views')
app.set('view engine','ejs')

app.get('/about',(req,res) => {
    res.render('about',{text:'aaaabout'})
})

app.get('/',(req,res) => {
    res.render('index',{text:'index'})
})


// Listen to the port
app.listen(port,() => console.log(`Server open on port : ${port}`))




//虛擬幣爬蟲
async function getPriceFeed(){
    try{
        const siteUrl = 'https://coinmarketcap.com'

        const { data } = await axios({
            method : "GET",
            url : siteUrl,
        })

        const $ = cheerio.load(data)
        const elemSelector = '#__next > div > div.main-content > div.sc-57oli2-0.dEqHl.cmc-body-wrapper > div > div > div.tableWrapper___3utdq.cmc-table-homepage-wrapper___22rL4 > table > tbody > tr'                
        
        const keys = [
            'rank',
            'name',
            'price',
            '24h',
            '7d',
            'marketcap',
            'volume',
            'supply'
        ]
        
        const coinArr = []

        $(elemSelector).each((parentIdx, parentElem) => {
            let keyIdx = 0
            const coinObj = {}

            if(parentIdx <= 9){
                $(parentElem).children().each((childIdx, childElem) => {
                    let tdValue = $(childElem).text()

                    if(keyIdx === 1 || keyIdx === 6){
                        tdValue = $('p:first-child', $(childElem).html()).text()
                    }

                    if(tdValue){
                        coinObj[keys[keyIdx]] = tdValue

                        keyIdx ++
                    }
                })
                coinArr.push(coinObj)
            }
        })
        console.log(coinArr[0])
        return coinArr
    }catch(err){
        console.log(err)
    } 
}

app.get('/api/price-coin', async(req,res) => {
    try{
        const priceFeed = await getPriceFeed()

        return res.status(200).json({
            result: priceFeed,
        })
    } catch(err){
        return res.status(500).json({
            err:err.toString(),
        })
    }
})

//匯率爬蟲
async function twd2usd(){
    const cash = [];
    try{
        const siteUrl = 'https://rate.bot.com.tw/xrt'

        const { data } = await axios({
            method : "GET",
            url : siteUrl,
        })

        const $ = cheerio.load(data)
        //const target = $('.rate-content-sight.text-right.print_hide')
        //
        $("td.rate-content-sight").each(function (idx, element) {
            let $element = $(element);
            if ($element.data("table") === "本行即期賣出" && !!+$element.text()) {
                // name of currency
                var currency = $($element.siblings()[0]).text().trim();
                // name is duplicated, we only need one
                var currency = currency.split(" ")[0];
                switch(currency){
                    case "美金": // we are interesting in 
                        console.log(currency + "\t:" + $element.text());
                        cash[0] = (($element.text()).replace(/\n/,"")).replace(/\s+/g, "");
                    default:
                        break;
                }
            }
        });
        return cash; 
    }catch(err){
        console.log(err)
    } 
}

app.get('/api/twd2usd', async(req,res) => {
    try{
        const priceGet = await twd2usd()

        return res.status(200).json({
            result: priceGet,
        })
    } catch(err){
        return res.status(500).json({
            err:err.toString(),
        })
    }
})