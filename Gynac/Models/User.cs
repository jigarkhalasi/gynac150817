using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac
{
    public class User
    {
        public int User_Id { get; set; }
        public string Title { get; set; }
        public string First_Name { get; set; }
        public string Middle_Name { get; set; }
        public string Last_Name { get; set; }
        public string Email { get; set; }
        public bool Email_Verified { get; set; }
        public string Mobile { get; set; }
        public string Password { get; set; }
        public string Professional_Specialty { get; set; }
        public string Educational_Qualification { get; set; }
        public string Street_Address { get; set; }
        public string City_Town { get; set; }
        public string Country { get; set; }
        public string Institution_Work_Place { get; set; }
        public string Where_Hear { get; set; }
        public string Guid { get; set; }
        public bool? Isparticipate { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }
}