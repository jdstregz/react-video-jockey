const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const appendFile = util.promisify(fs.appendFile);
const renameFile = util.promisify(fs.rename);

const writeToFile = async (data) => {
    return appendFile('videoLoader.js', data + '\n');
}

fs.writeFileSync("videoLoader.js", '', (err) => {
    if (err) throw err;
    console.log("Created videoLoader.js")
})

const main = async () => {
    let files = await readdir('./src/assets/videos');
    for (const file of files) {
        if (file.indexOf("-") > -1) {
            let splitFile = file.split('-');
            let layer = splitFile[1];
            let name = splitFile[0];
            const videos = await readdir('./src/assets/videos/' + file);
            if (videos.length > 64) {
                console.log("ERROR: TOO MANY VIDEOS IN FOLDER. LIMIT to 64 videos only");
                return;
            }
            let row = 1;
            let col = 1;
            for (const video of videos) {
                console.log(video)
                await renameFile(`./src/assets/videos/${file}/${video}`, `./src/assets/videos/${file}/${layer}9-${row}${col}.mp4`);
                await writeToFile(`import ${name}${row}${col} from '../assets/videos/${file}/${layer}9-${row}${col}.mp4';`)
                if (col === 8) {
                    row += 1;
                    col = 1;
                } else {
                    col = col + 1;
                }
            }
        }
    }
    await writeToFile(`const videos = {`);
    for (const file of files) {
        if (file.indexOf("-") > -1) {
            let splitFile = file.split('-');
            let layer = splitFile[1];
            let name = splitFile[0];
            const videos = await readdir('./src/assets/videos/' + file);
            await writeToFile(`    ${layer}9: {`);
            let row = 1;
            let col = 1;
            for (const video of videos) {
                await writeToFile(`        ${row}${col}: ${name}${row}${col},`)
                if (col === 8) {
                    row += 1;
                    col = 1;
                } else {
                    col = col + 1;
                }
            }
            await writeToFile('    },');
        }
    }
    await writeToFile('}');
    await writeToFile('');
    await writeToFile(`export const getVideo = (selected, layer) => {`);
    await writeToFile(`    return videos[layer][selected];`);
    await writeToFile(`}`);
    console.log("Created videoLoader.js")

};

main();
