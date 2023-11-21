
const {autoScroll}=require('../../utils/autoscroll')
async function extractor(page) {

 await  autoScroll(page)
  page.on("console", (message) => {
    console.log("Message from Puppeteer page:", message.text());
  });
    const data = await page.$$eval('.glass-product-card', (productCards) => {
        return productCards.map(productCard => {
            try {
                const imageUrl =  productCard.querySelector('.glass-product-card__assets-link img').srcset.split('w,')[5].replace('\n', '').replace('766w', '').trim()
                const title =  productCard.querySelector('.glass-product-card__assets-link img').alt
                const priceNew = productCard.querySelector('[ data-auto-id="gl-price-item"] div') && productCard.querySelector('[ data-auto-id="gl-price-item"] div').innerHTML.replace('TL', '').trim()
                const link =  productCard.querySelector('[data-auto-id="glass-hockeycard-link"]').href
    
                return {
                    title: 'adidas '+ title.replace(/İ/g,'i').toLowerCase(),
                    priceNew,
                    imageUrl,
                    link,
                    timestamp: Date.now(),
                    marka: 'adidas'
                }
            } catch (error) {
              
                console.log('error body',error.toString(),productCard.baseURL,productCard.innerHTML)
                return {error:error.toString(),content:productCard.innerHTML,baseURL:productCard.baseURL}
            }
          
        }).filter(f => f.priceNew !== null)
    })

return data

}
const productPageSelector='[data-auto-id="product_container"]'
const linkSelector='[data-auto-id="main-menu"] a'
const linksToRemove=[
'https://www.adidas.com.tr/tr//help-topics-privacy_policy.html',
'https://www.adidas.com.tr/tr',
'https://www.adidas.com.tr/tr/erkek?grid=true',
"https://www.adidas.com.tr/tr/kosu_ayakkabisi_ara",
"https://www.adidas.com.tr/tr/erkek-ayakkabi?price_max=1199&price_min=1",
"https://www.adidas.com.tr/tr/erkek-giyim?price_max=849&price_min=1",
"https://www.adidas.com.tr/tr/kadin-ayakkabi?price_max=1080&price_min=1",
"https://www.adidas.com.tr/tr/kadin-giyim?price_max=949&price_min=1",
"https://www.adidas.com.tr/erkek",
"?start=",
'.html',
"price_max"

]
const hostname='https://www.adidas.com.tr/'
const productItemsSelector='.glass-product-card'
const exclude=['.html','?start=','price_max']
const postFix =''

async function getUrls(page) {

  const url = await page.url()
  const nextPage = await page.$('[data-auto-id=pagination-pages-container]')
  const pageUrls = []
  let productCount = 0
  if(false){
   
   //const totalPages = await page.$eval('[data-auto-id=pagination-pages-container]', element => parseInt(element.innerText.replace(/[^\d]/g,'')))


   let pagesLeft = totalPages
   for (let i = 2; i <= totalPages; i++) {

     //  pageUrls.push(`${url}?start=` + i)
       --pagesLeft

   }
  }
 

   return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { extractor, getUrls,productPageSelector,linkSelector,linksToRemove,hostname,productItemsSelector,exclude,postFix }