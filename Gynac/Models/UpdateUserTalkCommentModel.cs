using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac.Models
{
    public class UpdateUserTalkCommentModel
    {
        public int UserTalkId { get; set; }
        public int TalkId { get; set; }
        public string TalkName { get; set; }
        public string Comment { get; set; }
        public string Email { get; set; }
        public string UserEmail { get; set; }
    }
}