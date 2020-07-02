using System;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Lab.MongoDBArchival.Core
{
    class Program
    {
        static async Task Main(string[] args)
        {
            await ExecuteMongoScripts();
        }

        private static async Task ExecuteMongoScripts()
        {
            var client = new MongoClient("mongodb://localhost:27117,localhost:27127, localhost:27137/?replicaSet=rs0");
            var database = client.GetDatabase("foo");
            var collection = database.GetCollection<BsonDocument>("bar");

            var newUser = $"test_{ DateTime.Now.ToString()}";
            //await collection.InsertOneAsync(new BsonDocument("Name", newUser));

           var list = await collection.WithReadPreference(ReadPreference.Secondary).Find(new BsonDocument("Name", "test_07/03/2020 00:09:47"))
                .ToListAsync();

            foreach (var document in list)
            {
                Console.WriteLine(document["Name"]);
            }

            Console.ReadLine();
        }
    }
}