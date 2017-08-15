using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac.Models
{
    public class UpdateUserTalkModel
    {
        public int UserTalkId { get; set; }
        public bool IsVideoStatus { get; set; }
        public bool IsExamlear { get; set; }
    }
}