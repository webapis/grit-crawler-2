import { genegateNavigation } from "./genegateNavigation.mjs";
//import {schema} from './createSchema.mjs'
import mapPrice from "./mapPrice.mjs";

import { createRequire } from "module";
import { Dataset  } from 'crawlee';
const productsDataset = await Dataset.open(`products`);
const require = createRequire(import.meta.url);
require('dotenv').config()
const {client} =require('./client.js')
console.log("process.env.marka------", process.env.marka === true);
const uniqify = (array, key) => array.reduce((prev, curr) => prev.find(a => a[key] === curr[key]) ? prev : prev.push(curr) && prev, []);
function findMatchingCategory(title, categories) {
  const titleWords = title.split(' ');

  for (const category of categories) {
    for (const keyword of category.keywords) {
      if (titleWords.some(word => deaccent(word.toLowerCase())==deaccent( keyword.toLowerCase()) )) {
        return category;
      }
    }
  }

  return null;
}
function deaccent(str) {
  var accents = {
    'ı': 'i',
    'á': 'a',
    'â': 'a',
    'ã': 'a',
    'ä': 'a',
    'ç': 'c',
    'è': 'e',
    'é': 'e',
    'ê': 'e',
    'ë': 'e',
    'ì': 'i',
    'í': 'i',
    'î': 'i',
    'ï': 'i',
    'ñ': 'n',
    'ò': 'o',
    'ó': 'o',
    'ô': 'o',
    'õ': 'o',
    'ö': 'o',
    'ß': 's',
    'ù': 'u',
    'ú': 'u',
    'û': 'u',
    'ü': 'u',
    'ÿ': 'y',
  };

  var newStr = '';
  for (var i = 0; i < str.length; i++) {
    var char = str[i];
    if (accents[char]) {
      newStr += accents[char];
    } else {
      newStr += char;
    }
  }

  return newStr;
}
function removeMatchingValues(array, wordsToExclude) {
  return array.filter(item => !wordsToExclude.some(word => item.title.includes(word)));
}
 await client.collections('products').documents().delete({'filter_by': `marka:${process.env.marka}`});
 await client.collections('products').documents().delete({'filter_by': `marka:gon`});
// await client.collections('products').delete()
//const rest =await client.collections().create(schema);
const { items: data } = await productsDataset.getData();
debugger
const anaKategoriler =[{title:'telefonluk',keywords:['telefonluk',"telefon"]},{title:'çanta',keywords:["omuz",'sırt','çanta',"çantası",'çantasi','saplı','baget','bag','çantaasi','backpack']},{title:"cüzdan",keywords:["cüzdan",'cuzdan','cüzdanı','cüzdanı','cüzdani']},{title:"valiz",keywords:["valiz",'bavul']},{title:"kartlık",keywords:["kartlık",'kartlik','kartvizitlik']},{title:"anahtarlık",keywords:["anahtarlık"]},{title:"clutch",keywords:["clutch"]},{title:"portföy",keywords:["portföy",'portföyü']},{title:"kılıf",keywords:["kılıf",'kılıfı']}]
const kategoriler =['göğüs','laptop','okul','bebek','kova','Postacı','baskılı','el','plaj','tote','gece','baget','alışveriş','bez','kot','abiye','gece','kol','telefon','çapraz','bel','sırt','omuz','spor','outdoor']
const renkler =  ['rose','vişne','mor','platin','altın','gümüş','gold','indigo','haki','gri','lacivert','bej','pembe','sarı','beyaz','kırmızı','siyah','fuşya','turuncu','yeşil','mavi','kahve']

const uniqueProductCollection = uniqify(data, 'imageUrl')
console.log('uniqueProductCollection',uniqueProductCollection.length)
const regex = /^(çorap|blink optic shine|sungerı|kemer|şal|fular|şapka|pareo)$/i; 
const filteredPrds = removeMatchingValues(uniqueProductCollection,['kemer','şal','şapka','fular','pareo','cargo fee','havlusu']);
const mappedData=   filteredPrds.map((m => { return { ...m, gender: m.title.substring(m.title.lastIndexOf('_')) } })).map((m) => {
        return {

          marka: m.marka,
          gender: m.gender
            ? m.gender
                .replace("kcocuk", "kız çocuk")
                .replace("ecocuk", "erkek çocuk")
                .replace("kadin", "kadın")
            : "unknown",
          title: m.title
            .substr(m.title.indexOf(" "))
            .replace("_kcocuk", "")
            .replace("_ecocuk", "")
            .replace("_erkek", "")
            .replace("_kadin", "")
            .toLowerCase(),
          link: m.link,
          imageUrl: m.imageUrl,
          price: m.priceNew ? mapPrice(m.priceNew.toString()) : 0,
          anaKategori: findMatchingCategory(m.title,anaKategoriler)?findMatchingCategory(m.title,anaKategoriler).title:'diger',
          kategori: kategoriler.find((f)=>m.title.split(' ').includes(f))?kategoriler.find((f)=>m.title.split(' ').includes(f)):'diger',
          renk:renkler.find((f)=>m.title.split(' ').includes(f))?renkler.find((f)=>m.title.split(' ').includes(f)):'diger',
          altKategori:'depicated'
        };
      })

      await client
      .collections("products")
      .documents()
      .import(mappedData, { action: "create" });
   

 




