const fs = require('fs');
const https = require('https');
const path = require('path');

const bagusHtml = fs.readFileSync('bagus.html', 'utf8');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (!url.startsWith('http')) return resolve();
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const gemsMatch = bagusHtml.match(/const gems = (\[[\s\S]*?\]);/);
  if (gemsMatch) {
    const gems = eval(gemsMatch[1]);
    for (let gem of gems) {
      if (gem.imgSpring) {
        let dest = `assets/images/hidden-gems/${gem.id.replace('gem-', '')}-spring.jpg`;
        console.log('Downloading', gem.imgSpring, 'to', dest);
        await download(gem.imgSpring, dest);
      }
      if (gem.imgWinter) {
        let dest = `assets/images/hidden-gems/${gem.id.replace('gem-', '')}-winter.jpg`;
        console.log('Downloading', gem.imgWinter, 'to', dest);
        await download(gem.imgWinter, dest);
      }
    }
  }

  const halalMatch = bagusHtml.match(/const halalData = (\{[\s\S]*?\});/);
  if (halalMatch) {
    const halalData = eval('(' + halalMatch[1] + ')');
    for (let city of Object.keys(halalData)) {
      for (let i = 0; i < halalData[city].length; i++) {
        let r = halalData[city][i];
        if (r.img && r.img.startsWith('http')) {
          let dest = `assets/images/halal-food/${city}-${i}.jpg`;
          console.log('Downloading', r.img, 'to', dest);
          await download(r.img, dest);
        }
      }
    }
  }
}

run().catch(console.error);
