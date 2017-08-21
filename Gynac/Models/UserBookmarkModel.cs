using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac.Models
{
    public class UserBookmarkModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string BookMarkName { get; set; }
        public string BookMarkTime { get; set; }        
    }
}