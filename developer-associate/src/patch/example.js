//mongo demo --eval 'var env="demo",db_module="accounts";' example.js
const inputArgs = {
  db_module:db_module,
  folderPath : `data-by-env/${env}/${db_module}/mongo/`
};
printjson(inputArgs);
cd(inputArgs.folderPath);
let files = listFiles();
let conn = new Mongo();
let patchFiles = [];

try {
  files.forEach(file => {
        if (!file.isDirectory) {
          patchFiles.push({
            dbName: inputArgs.db_module,
            fileName: file.name
          })
        }
  });
  printjson(patchFiles);
  for (let index = 0; index < patchFiles.length; index++) {
    let currentFile = patchFiles[index];
    db=db.getSiblingDB(inputArgs.db_module);
    print(currentFile.fileName);
    load(currentFile.fileName);
  }
  print(`database : ${db.getName()}, total count : ${db.member.count()}`);
  print("load patch files done!");
} catch (error) {
  printjson(error);
}