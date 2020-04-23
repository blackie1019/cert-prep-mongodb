const inputArgs = {

};

let files = listFiles();
let conn = new Mongo();
let patchFiles = [];

try {
  files.forEach(element => {
    if (element.isDirectory) {
      listFiles(element.baseName).forEach(file => {
        if (!file.isDirectory) {
          patchFiles.push({
            dbName: element.baseName,
            fileName: file.name
          })
        }
      });
    }
  });
  for (let index = 0; index < patchFiles.length; index++) {
    let currentFile = patchFiles[index];
    print(currentFile.fileName);
    let db = conn.getDB(currentFile.dbName);
    load(currentFile.fileName);
  }
  print("load patch files done!");
} catch (error) {
  printjson(error);
}