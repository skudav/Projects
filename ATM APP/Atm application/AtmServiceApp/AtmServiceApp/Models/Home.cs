using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AtmServiceApp.Models
{
    public class Home
    {
        public string atmID { get; set; }
        public string hubCity { get; set; }
        public string hubState { get; set; }
        public string errorCode { get; set; }
        public string comments { get; set; }

        public static List<Home> getDetails()
        {
            List<Home> list1 = new List<Home>()
            {
                new Home { atmID = "S10A001352001", hubCity = "Marine Lines", hubState = "Maharashtra"},
                new Home { atmID = "S10A01352002", hubCity = "Vashi", hubState = "Maharashtra"},
                new Home { atmID = "S10A001352003", hubCity = "Dadar", hubState = "Maharashtra"},
                new Home { atmID = "S10A001352004", hubCity = "Bandra", hubState = "Maharashtra" },
                new Home { atmID = "S10A001352005", hubCity = "Surat", hubState = "Gujrat" },
                new Home { atmID = "S10A001352006", hubCity = "Ahmedabad", hubState = "Gujrat" }
            };
            return list1;
        }
    }
}