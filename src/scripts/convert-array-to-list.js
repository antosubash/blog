console.log('convert-array-to-list.js');
var path = require('path');
var fs = require('fs');
const postsDirectory = path.join(process.cwd(), "_posts");

const getAllFiles = function (dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file))
        }
    })

    return arrayOfFiles
}
const fileNames = getAllFiles(postsDirectory);

console.log(fileNames);

for (let i = 0; i < fileNames.length; i++) {
    // convert the tags array to a list of tags in the frontmatter
    const file = fileNames[i];
    const fileContents = fs.readFileSync(file, 'utf8');
    const lines = fileContents.split('\n');
    const tagsIndex = lines.findIndex(line => line.startsWith('tags:'));
    if (tagsIndex > -1) {
        // convert the tags array to a list of tags in the frontmatter
        const tagsLine = lines[tagsIndex];
        const tags = tagsLine.split(':')[1].trim();
        // remove tag quotes from the tags
        const tagsList = tags.slice(1, -1).split(',').map(tag => tag.trim());

        // create the new tags list string without quotes

        for (let j = 0; j < tagsList.length; j++) {
            const tag = tagsList[j];
            if (tag.startsWith('"') && tag.endsWith('"'){
                tagsList[j] = tag.slice(1, -1);
            }
        }

        const tagsListString = tagsList.map(tag => `  - ${tag}`).join('\n');
        lines[tagsIndex] = `tags:\n${tagsListString}`;
        const newFileContents = lines.join('\n');
        fs.writeFileSync(file, newFileContents);
    }
}   
