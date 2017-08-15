using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac.Models
{
    public class NotificationModel
    {
        public int NotificationId { get; set; }
        public string Comment { get; set; }
        public bool IsRead { get; set; }
    }
}