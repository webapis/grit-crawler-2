const addaxData = require('./addax.json')
const {searchObject} = require('./utils/searchObject')
const categories = require('./utils/categories.json')



debugger

const mapAddax = addaxData.map(m=>{
    
    
    return {...m,
    
    
    category:categories.find((f)=>searchObject(m,f.searchterm))? categories.find((f)=>searchObject(m,f.searchterm)).searchterm.join(' '):'unknown'


}})

debugger