const fs = require('node:fs');

fs.writeFile("./text/message2.txt", "Hi, it's me!", (err) =>{
    if (err) throw err;
    console.log("File has been saved");
});

const fs = require('node:fs');
fs.readFile('./text/message2.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});