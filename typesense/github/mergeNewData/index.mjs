


export default function mergeNewData(newData, prevData) {
    try {
        const prichChanged = newData.priceNew !== prevData.priceNew
        debugger
        if (prichChanged) {
            debugger
            if (prevData.price_change) {
                const nextState = { ...newData, price_change: [...prevData.price_change, { timestamp: newData.timestamp, priceNew: newData.priceNew }] }
                debugger
                return nextState
            } else {
                const nextState = { ...newData, price_change: [{ timestamp: newData.timestamp, priceNew: newData.priceNew }] }
                debugger
                return nextState
            }
        } else {
            const nextState = prevData
            debugger
            if (!prevData.price_change) {
                return { ...nextState, price_change: [{ timestamp: prevData.timestamp, priceNew: prevData.priceNew }] }
            } else {
                return { ...nextState }
            }

        }
    } catch (error) {
        debugger
    }




}


function mapNewData(newArrayData, prevArrayData) {

    return newArrayData.map(newData => {
        const imageUrl = m.imageUrl
        const prevData = prevArrayData.find(f => f.imageUrl === imageUrl) ? prevArrayData.find(f => f.imageUrl === imageUrl) : newData
        const nextState = mergeNewData(newData, prevData)

        return nextState
    })

}

export {
    mapNewData
}
// export default function mergePrevAndNewData({ gender, marka, data, prevData }) {

//     debugger
//     // const prevDataRaw = fs.readFileSync(`single-content/${gender}/${marka}.json`, { encoding: 'utf8' })
//     // const prevData = JSON.parse(prevDataRaw)
//     const filterDataToBeDeleted = (prevData, data) => {
//         let res = [];
//         res = prevData.filter((f) => {
//             const date1 = new Date();
//             const date2 = new Date(f.deletedDate);
//             const diffTime = Math.abs(date2 - date1);
//             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//             if (!f.delete || (f.delete && diffDays <= 3)) {
//                 debugger
//                 return true
//             } else {
//                 debugger
//                 return false
//             }
//         }).filter(el => {
//             return !data.find(element => {
//                 return element.imageUrl === el.imageUrl;
//             });
//         });
//         return res;
//     }
//     const filterDataToBeUpdated = (prevData, data) => {
//         let res = [];
//         res = prevData.filter(el => {
//             return data.find(element => {
//                 return element.imageUrl === el.imageUrl;
//             });
//         });
//         return res;
//     }
//     const dataToBeDeleted = filterDataToBeDeleted(prevData, data).map((m) => { return { ...m, delete: true, deletedDate: new Date() } })
//     const dataToBeUpdated = filterDataToBeUpdated(prevData, data)
//     debugger
//     let mergedData = []
//     mergedData = dataToBeUpdated.map((p) => {
//         const matchC = data.find(c => c.imageUrl === p.imageUrl)
//         delete matchC.timestamp
//         const prevData = p
//         delete prevData.timestamp
//         if (matchC) {
//             debugger
//             if (deepEqual(matchC, prevData)) {
//                 debugger
//                 return {
//                     ...prevData, update: false
//                 }
//                 // uptodate data
//             } else {
//                 debugger
//                 //slate data
//                 return { ...matchC, update: true }
//             }
//         } else {
//             //new data
//             return {...p,update: true}
//         }
//     })
//     debugger
//     return [...mergedData, ...dataToBeDeleted]



// }