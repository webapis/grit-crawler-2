
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PuppeteerCrawler, Dataset,RequestQueue } =require('crawlee');
import { uploadCollection } from'./utils/uploadCollection.mjs'

const {uniquefyData}=require('./utils/mapAsCollection.js')
const fetch =require('node-fetch')
require('dotenv').config()

    const requestQueue = await RequestQueue.open();
    const marka = process.env.marka// process.env.START_URL.match(/(?<=www.).*(?=.com)/g)[0]

    console.log('main running')
    console.log('main', process.env.GENDER)
    const { urls } = require(`./urls/biraradamoda/all/${marka}`)

    for (let obj of urls) {

        const { url, category, opts, node } = obj
        debugger
    
            await requestQueue.addRequest({ url, userData: { start: true, category, opts, node } })
        
       
    }

    const productsDataset = await Dataset.open(`products`);

    process.env.dataLength = 0
    const handlePageFunction = async (context) => {


        const { page, request: { userData: { start, opts } } } = context


        const {  getUrls,productPageSelector,linkSelector,linksToRemove,hostname,productItemsSelector,exclude,postFix } = require(`./handlers/biraradamoda/${process.env.marka}`);
        const {commonHandler}=require(`./handlers/biraradamoda/commonHandler.js`)
        const { pageUrls, productCount } = await getUrls(page)
        process.env.productCount = productCount

        if (start) {
            let order = 1
            let pageCounter =0
            let pagesToCollect = calculatePagePercentage(pageUrls.length,5)
            for (let url of pageUrls) {
                    
                    pageCounter= pageCounter+1
                    if(pageCounter<= pagesToCollect){
                        if (pageUrls.length === order) {
                            requestQueue.addRequest({ url, userData: { start: false, opts, } })
                        } else {
                            requestQueue.addRequest({ url, userData: { start: false, opts, } })
                        }
                    }
               
                ++order;
            }
        }

        const dataCollected = await commonHandler({page, context,productPageSelector,linkSelector,linksToRemove,hostname,productItemsSelector,exclude,postFix})
   
        if (dataCollected.length > 0) {
            await productsDataset.pushData(dataCollected)

            process.env.dataLength = parseInt(process.env.dataLength) + dataCollected.length


        } else {

            console.log('unsuccessfull page data collection',dataCollected)

            // throw 'unsuccessfull data collection'
        }



    }

const longertimeconsumers =['koton','addax','bershka','baqa','bsl']
const protocolTimeout =longertimeconsumers.find(f=>f===marka)? 2000000:120000
console.log('protocolTimeout',protocolTimeout)
    const crawler = new PuppeteerCrawler({
        // requestList,
        requestQueue,
        maxConcurrency: 1,
      requestHandlerTimeoutSecs: 3600,
    //  maxRequestRetries:4,
       navigationTimeoutSecs: 240,
        launchContext: {
            // Chrome with stealth should work for most websites.
            // If it doesn't, feel free to remove this.
            useChrome: process.env.LOCAL==='TRUE'?true:false,
            launchOptions: {
                geolocationEnabled: false,
                // defaultViewport: {
                //     width: 1920, // Desired width of the viewport
                //     height: 1080, // Desired height of the viewport
                //   },
              //  timeout: 0, // Set timeout to 0 to disable it
                // increase protocolTimeout value to a higher timeout
                // depending on your requirements
                // For example, set it to 30000 (30 seconds)
               protocolTimeout,
                headless: process.env.HEADLESS==='true'? true:false, args: ['--no-sandbox', '--disable-setuid-sandbox', "--disable-web-security",
                   // `--window-size=1200,1250`,
                    "--allow-insecure-localhost",
                    //  "--user-data-dir=/tmp/foo",
                    "--ignore-certificate-errors",
                    "--unsafely-treat-insecure-origin-as-secure=https://localhost:8888",
                    '--disable-gpu-rasterization',
                    '--disable-low-res-tiling',
                    '--disable-skia-runtime-opts',
                    '--disable-yuv420-biplanar',
                    '--disable-site-isolation-trials',
                    '--disable-dev-shm-usage',
                    '--deviceScaleFactor=0.50',
                    '--ignore-ssl-errors',
                    '--lang=tr-TR,tr',
                    //'--lang=en-US,en'
                    // '--shm-size=3gb'
                    '--window-size=1920,1080', '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36"'
                ],
              //  env: { LANGUAGE: "en_US" }
            }

        },
        requestHandler:handlePageFunction,
        //  navigationTimeoutSecs:120,
        preNavigationHooks:['adsdsdax'].findIndex(f=>f===marka)!==-1? []: [
            async (crawlingContext, gotoOptions) => {

                const base64Data = 'UklGRrQCAABXRUJQVlA4WAoAAAAgAAAAMQAAMQAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggxgAAADAFAJ0BKjIAMgA+KRSIQqGhIRQEABgChLSAAfEUsMdoQDxm7V7DY8pOCS0L/ZyItlBAAP78SglvPhcQmHd7faO6y1Vj5rGK48w1Px+0DDzmSmSYzbIU4V+7Fe49Jdh1s8ufvov/DhqMdLRQIsmNpwliL2KKjX3y+AjM9IY6ZBHFt/K3ZB9a92c7eC4FhJPj8CGJNQiCXYBrv/s2nqpZap2xm8BBq/aPjDKYsaw5MG8/sgZVfdCc1IZY+bxPEQplrVSOwAAAAA=='
                const buffer = Buffer.from(base64Data, 'base64');
                const { page } = crawlingContext;

                await page.setDefaultNavigationTimeout(0);
                await page.setRequestInterception(true);
                await page.evaluate(() => {
                    navigator.geolocation.getCurrentPosition = () => {
                      return {
                        coords: {
                          latitude: 41.015137,
                          longitude: 28.979530,
                        },
                      };
                    };
                  });
   
       
                page.on('request', req => {
                    const resourceType = req.resourceType();
                    const url = req.url();

                    
                    if (resourceType === 'image'  ||url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.gif')|| url.endsWith('.webp')||url.endsWith("imformat=chrome")) {
                        req.respond({
                            status: 200,
                            contentType: 'image/jpeg',
                            body: buffer
                        });


                    } else {
                        req.continue();
                    }
                });
                page.on('response', async response => {
                    const request = response.request();



                    const status = response.status()
                    if (status === 200) {
                        try {
                            const text = await response.text()
                            if (isJsonString(text)) {


                                const json = JSON.parse(text);
                                if (Array.isArray(json)) {

                                    await Dataset.pushData({ arr: json });
                                       //response.continue();

                                } else {

                                    await Dataset.pushData(json);
                                       //response.continue();
                                }



                            }
                        } catch (error) {

                        }

                    }

                })
        
          
        
                function isJsonString(str) {
                    try {
                        JSON.parse(str);
                    } catch (e) {
                        return false;
                    }
                    return true;
                }
            },
        ],
        handleFailedRequestFunction: async ({ request: { errorMessages, url, userData: { gender, start } } }) => {
  
        },
    });


    await crawler.run();
    debugger
 
debugger
    const { items: productItems } = await productsDataset.getData();
    debugger
if(productItems.length===0){

    throw 'Error when scraping 0 productItems.length'
}
    const withError =productItems.filter(f=>f.error)
    debugger

    let errorPercentate =0
    if(withError.length>0){
        const errorDataset = await Dataset.open(`withError`);
        await errorDataset.pushData(withError)
        console.log('withError:length', withError.length)
        console.log('withError:error', withError[0].error)
        console.log('withError:url', withError[0].url)
        console.log('withError:content', withError[0].content)
         errorPercentate = Math.round( calculateErrorPercentage(productItems.length,withError.length))
        if(errorPercentate >=5 )
        {

            throw `Total error exceeds ${errorPercentate} %`

        }else
        {


            console.log('Error %',errorPercentate)
        }
    
      
    }

    if(errorPercentate <5){
    
        const productItemsWithoutError =productItems.filter(f=>!f.error)

        console.log('productItemsWithoutError----',productItemsWithoutError.length)
      //  const uniqueData =uniquefyData({data:productItemsWithoutError})
   
       
            await uploadCollection({ fileName: `${marka}`, data:productItemsWithoutError, gender: 'all', marka })
       
        

        console.log('uploading git state')
    }
     
        

    console.log('Crawl finished.');

    function calculateErrorPercentage(firstValue, secondValue) {
        return (secondValue / firstValue) * 100;
      }
      function calculatePagePercentage(totalPages, percent) {
        return (percent / 100) * totalPages;
      }


