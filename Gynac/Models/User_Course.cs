using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac
{
    public class User_Course
    {
        public int User_Id  { get; set; }
        public int Course_Id { get; set; }
        public DateTime Registered_Date { get; set; }
        public DateTime Registered_Till { get; set; }
        public string Payment_Mode { get; set; }
        public decimal Payment_Amount { get; set; }
        public string Payment_Currency { get; set; }
        public bool Payment_Pending { get; set; }
        public int Validity_Days { get; set; }
    }
}