String.prototype.padding = function(n, c)
{
        var val = this.valueOf();
        if ( Math.abs(n) <= val.length ) {
                return val;
        }
        var m = Math.max((Math.abs(n) - this.length) || 0, 0);
        var pad = Array(m + 1).join(String(c || ' ').charAt(0));
        return (n < 0) ? pad + val : val + pad;
};
String.prototype.heading = function(n, c)
{
        var val = this.valueOf();
        if ( Math.abs(n) <= val.length ) {
                return val;
        }
        var m = Math.floor(Math.max((Math.abs(n) - this.length) || 0, 0) / 2);
        var pad = Array(m + 1).join(String(c || '=').charAt(0));
        return pad + ' ' + val + ' ' + pad;
};
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(process.argv[2])
});
const lines = [];
lineReader.on('line', (line) => lines.push(line) );
lineReader.on('close', () => { 
    const api = {
        attributes: [],
        setters: [],
        methods: []
    };
    let componentName = '';
    let addNextLine = false;
    let nextType = '';
    lines.forEach((line) => {
        if (addNextLine && line.trim() != '') {
            let method = line.trim();
            if (method.startsWith('get ') || method.startsWith('set ')) {
                // @api for getter / setter
                method = method.slice(4);
                method = method.split('(')[0];
                method = method.trim();
                api.setters.push({
                    attr: method,
                    type: nextType
                });
            } else {
                // @api for a normal method
                method = method.split('(')[0];
                method = method.trim();
                api.methods.push({
                    attr: method,
                    type: nextType
                });
            }
            //api.push(line);
            nextType = '';
            addNextLine = false;
        }
        if (line.includes('@api')) {
            if (line.trim() == '@api') {
                addNextLine = true;
            } else {
                // @api for attribute;
                let attribute = line;
                attribute = attribute.replace('@api', '');
                attribute = attribute.replace(';', '');
                attribute = attribute.trim();
                api.attributes.push({
                    attr: attribute,
                    type: nextType
                });
                nextType = '';
            }            
        }   
        if (line.includes('LightningElement') && line.includes('extends')) {
            console.log(line);
            componentName = line;
            componentName = componentName.split('class')[1].split('extends')[0].trim();
        }
        if (line.includes('@type {')) {
            nextType = line.split('{')[1].split('}')[0];
        }
    });
    console.warn(`******************************************`);
    console.warn(`API for ${componentName}`);
    console.warn(``);
    Object.keys(api).forEach( (type) => {
        console.warn(`${type.heading(40)}`);
        api[type].forEach( (attr) => console.log(attr.attr.padding(30), attr.type) );
    })
    console.warn(`******************************************`);
        

 });


