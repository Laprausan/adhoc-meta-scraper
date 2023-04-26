const ogs = require('open-graph-scraper');
var fs = require('fs'); 
var csv = require('csv');

let runningQueries = []
let finalValues = []

const filepath = 'records.csv'
fs.createReadStream(filepath)
    .pipe(csv.parse({delimiter: ',', from: 2}))
    .on('data', function(csvrow) {
    let record = []
    record.push(csvrow[0])

    const options = { url: csvrow[0] };
    runningQueries.push(ogs(options)
    .then((data) => {
        const { error, result, response } = data
        record.push(result.ogTitle)
        record.push(result.ogDescription)
        finalValues.push(record)
    }))
})
.on('end', () => {
    Promise.all(runningQueries).then(() => {
        let outfile = fs.createWriteStream('output.csv')
        csv.stringify(finalValues).pipe(outfile)
    })
})