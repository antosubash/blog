import fs from "fs";
import { basename } from "path";
const getDirectories = (source: any) => {
  var folders: string[] = [];
  fs.readdirSync(source).forEach((path) => {
    var folderName = basename(path);
    folders.push(folderName);
  });
  return folders;
};
export default getDirectories;
