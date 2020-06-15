using System;
using IdGen;
using Powells.CouponCode;

namespace Lab.MongoDBArchival.Core
{
    class Program
    {
        static void Main(string[] args)
        {
            var ccb = new CouponCodeBuilder();
            var code = ccb.Generate(new Options {Plaintext = GetCouponCodeByMember("test001"), Parts = 2, PartLength = 4});

            Console.WriteLine($"CouponCode:{code}");
            Console.ReadLine();
        }

        public static string GetCouponCodeByMember(string memberCode)
        {
            var idGenerator = new IdGenerator( DateTime.Now.Second);
            var id = idGenerator.CreateId().ToString();
            return $"{memberCode}:{id}";
        }
    }
}