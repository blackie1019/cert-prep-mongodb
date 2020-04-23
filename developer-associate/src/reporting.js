const inputArgs = {
    dbName: "benchmark",
    collectionName: "wager-30d",
    insertBatchShard: 1000,
    insertBatch: 300,
    operators: 1,
    members: 1 * 1000,
    wagerPerSecond: 1000,
    sports: 3,
    matches: 3,
    marketTypes: 20,
    days: 1
}

let conn = new Mongo();
let db = conn.getDB(inputArgs.dbName);

let TestWagerCreator = {
    collection: db.getCollection(inputArgs.collectionName),
    insertBatchShard: inputArgs.insertBatchShard,
    insertBatch: inputArgs.insertBatch,
    args: {
        totalWagers: inputArgs.matches * inputArgs.members * inputArgs.wagerPerSecond,
        startDate: NumberLong(637212960000000000), // 2020-04-01
        days: inputArgs.days,
        fake: {
            operators: inputArgs.operators,
            members: inputArgs.members,
            sports: inputArgs.sports,
            matches: inputArgs.matches,
            marketTypes: inputArgs.marketTypes,
            status: function () {
                let num = (100).random() + 1;
                if (num <= 18) return 0; // Open: 18%
                else if (num <= 80) return 1; // Settled: 62%
                else if (num <= 90) return 4; // Resettled: 10%
                else if (num <= 94) return 3; // Unsettled: 4%
                else if (num <= 98) return 5; // Resulted: 4%
                else if (num <= 99) return 2; // Void: 1%
                else return 6; // Hold: 1%
            }
        }
    },
    getInsertShards: function (length) {
        let data = new Array(length);

        for (var i = 1; i <= length; i++) {
            data[i] = i;
        }
        return data;
    },
    extends: function () {
        Number.prototype.random = function () {
            return parseInt(Math.random() * this);
        };
        NumberLong.prototype.addHours = function (hours) {
            return NumberLong(this + 600000000 * parseInt(hours));
        };
        NumberLong.prototype.addDays = function (days) {
            return NumberLong(this + 864000000000 * parseInt(days));
        };
        NumberLong.prototype.toDate = function () {
            return NumberLong(this - this % 864000000000);
        };
        NumberLong.prototype.toString = function () {
            return JSON.stringify(this).replace(/[^\d]/g, '');
        };
    },
    template: function () {
        let zeroNumber = NumberDecimal("0");
        let dateMatch = NumberLong("637186458000000000");

        return {
            "_id": "o_685121212346552320",
            "AdditionalId": "",
            "DatePlaced": NumberLong("637190128260458123"),
            "DateUpdated": NumberLong("637190128260458138"),
            "DateSettled": NumberLong(0),
            "SettledStatusCode": 0,
            "HoldBetStatusCode": 1,
            "HoldBetRetryTimes": 0,
            "Selections": [{
                "DateMatch": dateMatch,
                "SportTypeCode": 1,
                "MatchId": 14,
                "MarketTypeCode": 1,
                "MatchDisplayKey": "{Home} v {Away}",
                "HomeDisplayKey": "gaming:participant:4",
                "AwayDisplayKey": "gaming:participant:5",
                "Specifier": "",
                "SelectionDisplayKey": "gaming:participant:4",
                "SelectionId": NumberLong(552187),
                "BetOdds": NumberDecimal("1.2500"),
                "Handicap": null,
                "CurrentScore": "",
                "OutcomeCode": 0,
                "OutcomeValue": NumberDecimal("0.0"),
                "IsDisplayScore": false
            }],
            "IsCancelled": false,
            "IsCashOut": false,
            "OpCode": "testopcode",
            "MemberId": 8,
            "MemberCode": "accept001",
            "IpAddress": "10.23.45.121",
            "ChannelCode": 0,
            "CurrencyCode": "CNY",
            "CurrencyRateId": 1,
            "BetTypeCode": 101,
            "BetCount": 1,
            "BetStake": NumberDecimal("10.00000000"),
            "BetStakeForeign": NumberDecimal("10"),
            "TotalStakeForeign": NumberDecimal("10"),
            "TotalStake": NumberDecimal("10.00000000"),
            "TotalReturnAmountForeign": zeroNumber,
            "TotalReturnAmount": zeroNumber,
            "TotalWinLossForeign": zeroNumber,
            "TotalWinLoss": zeroNumber,
            "CashOutReturnAmountForeign": zeroNumber,
            "CashOutReturnAmount": zeroNumber,
            "Memo": "",
            "WagerItems": [{
                "BetOdds": NumberDecimal("1.2500"),
                "ComboPosition": "1",
                "SettledStatusCode": 0,
                "StakeForeign": NumberDecimal("10"),
                "Stake": NumberDecimal("10.00000000"),
                "ReturnAmountForeign": zeroNumber,
                "ReturnAmount": zeroNumber,
                "WinLossForeign": zeroNumber,
                "WinLoss": zeroNumber,
                "OutcomeCode": 0,
                "OutcomeValue": zeroNumber
            }],
            "MaxDateMatch": dateMatch,
            "MinDateMatch": dateMatch,
            "SportTypeCode": 1,
            "MarketTypeCode": 1,
            "MatchId": 14,
            "OpId": 1
        };
    },
    initMatches: function () {
        let that = this;
        let args = that.args;
        that.mockMatches = new Array(args.fake.matches);
        for (let i = 0; i < args.fake.matches; i++) {
            that.mockMatches[i] = {
                SportTypeCode: parseInt(i % args.fake.sports + 1),
                MatchId: i + 1,
                MatchDate: args.startDate
                    .addDays(parseInt(i % args.days))
                    .addHours(parseInt(i % 24))
            };
        }
    },
    genWagers: function (count, prefix) {
        count = count || 1;
        let that = this;
        let args = that.args;
        let isSettled = [false, true, true, false, true, false, false];
        let wagers = new Array(count);

        for (let i = 0; i < count; i++) {
            let match = that.mockMatches[(args.fake.matches).random()];
            let wager = that.template();
            wager.OpId = (args.fake.operators).random() + 1;
            wager.OpCode = `op_${wager.OpId}`;
            wager.MemberId = (args.fake.members).random() + 1;
            wager.MemberCode = `mem_${wager.MemberId}`;
            wager.DatePlaced = wager.DateUpdated = NumberLong(match.MatchDate + NumberLong((-8 * 600000000).random()));
            wager.SettledStatusCode = args.fake.status();
            wager.DateSettled = isSettled[wager.SettledStatusCode] ?
                NumberLong(match.MatchDate + (3 * 600000000).random()) :
                NumberLong(0);
            wager.Selections[0].DateMatch = match.MatchDate;
            wager.MaxDateMatch = wager.MinDateMatch = match.MatchDate;
            wager.SportTypeCode = wager.Selections[0].SportTypeCode = match.SportTypeCode;
            wager.MatchId = wager.Selections[0].MatchId = match.MatchId;
            wager.MarketTypeCode = wager.Selections[0].MarketTypeCode = (args.fake.marketTypes).random() + 1;
            wager._id = "o_" + prefix + new ObjectId();
            wagers[i] = wager;
        }
        return wagers;
    },
    getCurrentCount: function () {
        let that = this;
        return that.collection.find().count();
    },
    start: function (isDoDrop) {
        let that = this;
        let args = that.args;

        if (isDoDrop) {
            that.collection.drop();
        }

        that.extends();
        that.initMatches();
        let start = new Date().getTime();

        let maxShards = Math.min((args.totalWagers - that.getCurrentCount()) / that.insertBatch, that.insertBatchShard);
        that.getInsertShards(maxShards).map((shard) => {
            let bulk = that.collection.initializeUnorderedBulkOp();
            print(`${new Date()}, CurrentCount:${that.getCurrentCount()}, InsertBatchCount:${that.insertBatch}`);
            try {
                that.genWagers(that.insertBatch, shard).map((wager) => {
                    bulk.insert(wager);
                });
                bulk.execute();
            } catch (ex) {
                print(`Error occurred, but nInserted:${ex.nInserted}`);
            }
        });
        print(`Target Total Wagers: ${args.totalWagers}, Created Wagers: ${that.insertBatchShard*that.insertBatch}, CurrentCount:${that.getCurrentCount()}, Duration: ${((new Date().getTime() - start) / 1000).toFixed(2)}s`);
    }
}

TestWagerCreator.start(true);