using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac.Models
{
    public class TalkVideoModel
    {
        public int TalkId { get; set; }
        public string Name { get; set; }
        public string VideoLink { get; set; }
        public string PreViewVideoLink { get; set; }
        public int FacultyId { get; set; }        
        public string FacultyName { get; set; }
        public string ProfilePic { get; set; }
        public string Email { get; set; }
        public int ExpTime { get; set; }
        public string Signature { get; set; }
    }
}