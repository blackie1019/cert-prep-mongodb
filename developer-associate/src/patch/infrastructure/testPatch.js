let infrastructureDB=db.getSiblingDB("infrastructure");
// db.localization.deleteMany([{
//     "displaykey": "backoffice:label:dateMatch",
//     "langcode": "en-gb"
// }, {
//     "displaykey": "backoffice:label:dateMatch",
//     "langcode": "zh-cn"
// }]);

infrastructureDB.localization.dropIndex("mainIndex");
infrastructureDB.localization.dropIndex("secondaryIndex");

infrastructureDB.localization.createIndex({
    "category": 1
}, {
    name: "mainIndex",
    collation: {
        locale: "en",
        strength: 2
    }
});
infrastructureDB.localization.createIndex({
    "displaykey": 1,
    "langcode": 1
}, {
    name: "secondaryIndex",
    unique: true,
    collation: {
        locale: "en",
        strength: 2
    }
});

infrastructureDB.localization.insert({
    "displaykey": "backoffice:label:test",
    "category": "backoffice",
    "langcode": "zh-cn"
});

infrastructureDB.localization.update({
    "displaykey": "backoffice:label:datematch",
    "category": "backoffice",
    "langcode": "en-gb"
}, {
    $set: {
        "displayvalue": "Date Match"
    }
}, true, true);
infrastructureDB.localization.update({
    "displaykey": "backoffice:label:datematch",
    "category": "backoffice",
    "langcode": "zh-cn"
}, {
    $set: {
        "displayvalue": "比赛日期"
    }
}, true, true);