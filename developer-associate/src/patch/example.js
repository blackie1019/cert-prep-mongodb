//mongo demo --eval 'var env="demo",db_module="accounts";' example.js
//mongo demo --eval 'var env="demo",db_module="gaming";' example.js
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

  patchFiles = patchFiles.sort(function (a, b) {
    return a.fileName > b.fileName ? 1 : -1;
  });

  printjson(patchFiles);
  for (let index = 0; index < patchFiles.length; index++) {
    let currentFile = patchFiles[index];
    db=db.getSiblingDB(inputArgs.db_module);
    print(currentFile.fileName);
    let status = load(currentFile.fileName);
    print(status);
  }
  print(`database : ${db.getName()}, total count : ${db.member.count()}`);
  print(`database : ${db.getName()}, total count : ${db.match.count()}`);
  print("load patch files done!");
} catch (error) {
  printjson(error);
}