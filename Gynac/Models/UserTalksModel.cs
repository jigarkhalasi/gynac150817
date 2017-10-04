using Gynac.Models.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac.Models
{
    public class UserTalksModel
    {
        public int UserTalkId { get; set; }
        public int SessionId { get; set; }
        public string SessionName { get; set; }
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public int TalkId { get; set; }
        public string TalkName { get; set; }
        public string Talkdesc { get; set; }
        public string Duration { get; set; }
        public string Comment { get; set; }
        public string IsActive { get; set; }
        public string IsExam { get; set; }
        public string IsVideo { get; set; }
        public string IsModuleClear { get; set; }        
    }

    public class UserModuleModel {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
    }
}