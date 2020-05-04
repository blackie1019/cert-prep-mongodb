// db.submitted_202005.insert({"stake":30,"status":1});

db.getCollection('submitted_202004').aggregate([{
    $limit: 1
  }, {
    $project: {
      _id: '$$REMOVE'
    }
  }, {
    $lookup: {
      from: 'submitted_202004',
      pipeline: [{
          $match: {
            status: 0
          }
        },
        {
          $project: {
            _id: 1,
            stake: 1,
            status: 1,
            collectionName: {
              $literal: 'submitted_202004'
            }
          }
        }
      ],
      as: 'submitted_202004'
    }
  }, {
    $lookup: {
      from: 'submitted_202005',
      pipeline: [{
          $match: {
            status: 0
          }
        },
        {
          $project: {
            _id: 1,
            stake: 1,
            status: 1,
            collectionName: {
              $literal: 'submitted_202005'
            }
          }
        }
      ],
      as: 'submitted_202005'
    }
  },

  // 5. Union the collections together with a projection.
  {
    $project: {
      union: {
        $concatArrays: ["$submitted_202004", "$submitted_202005"]
      }
    }
  },

  // 6. Unwind and replace root so you end up with a result set.
  {
    $unwind: '$union'
  },
  {
    $replaceRoot: {
      newRoot: '$union'
    }
  },

  // 7. Sort or limit result set.
  {
    $sort: {
      stake: -1
    }
  },
  {
    $limit: 5
  }
]);