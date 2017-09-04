using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac.Models
{
    public class TutorialSummaryModel
    {
        public string SessionName { get; set; }
        public int TotalTalks { get; set; }
        public int TotalPendingTalks { get; set; }
        public int TotalCompletedTalks { get; set; }
    }
}