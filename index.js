// Configuration
const config_path = '/SecureCRT/Config/Sessions'

const fs = require('fs')


let datas = []

const readConfiguration = (path) => {
    let files = fs.readdirSync( path )
    files.forEach( (a,b) => {
        console.log(a,b)
    
        let full_path = `${path}/${a}`
        //console.log( fs.statSync(full_path) )
        //console.log(fs.statSync(full_path).isDirectory())

        if (fs.statSync(full_path).isDirectory()) {
            return readConfiguration(full_path)
        }

        if (a.endsWith('.ini')) {
            let folder_name = path.replace(config_path + '/','')
            let full_name = '[' + folder_name + '] - ' + a.replace(/\.ini$/, '')
            var data = fs.readFileSync( full_path )

            let lines_regex = /^.*=.*[^=]*$/gm

            let eachline_regex = /([A-Z]):"(.*)"=(.*)/s

            console.log('full_name',full_name)

            let includes_data = ['Username','Hostname','[SSH2] Port','Protocol Name']
            let this_data = {}
            this_data['name'] = full_name

            while (lines = lines_regex.exec(data)) {
                let eachlinematch = eachline_regex.exec(lines[0])
                let field_name = eachlinematch[2]

                if (includes_data.includes(field_name)) {
                    this_data[field_name] = eachlinematch[3]

                    if (field_name == '[SSH2] Port') {
                        this_data[field_name] = parseInt(eachlinematch[3],16)
                    }

                }

            }
            console.log('this_data',this_data)

            datas.push(this_data)

        }
    
    } )
}

readConfiguration(config_path)

console.log('DATA', arrayToCSV(datas));

function arrayToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

    return array.reduce((str, next) => {
        str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';
        return str;
       }, str);
}

function convertArrayOfObjectsToCSV(args) {  
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}