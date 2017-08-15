using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac
{
    public class Course
    {
        public int Course_Id { get; set; }
        public int Faculty_Id { get; set; }
        public string Course_Image { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Fees { get; set; }
        public string Currency { get; set; }
        public int Validity_Days { get; set; }
    }
}