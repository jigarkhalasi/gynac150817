using Gynac.Models.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac.Models
{
    public class UserModuleImageModel
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public int ModuleImageId { get; set; }
        public string ModuleDesc { get; set; }
        public string SampleImage { get; set; }
        public int UserImageId { get; set; }
        public string UserImage { get; set; }
        public string Comment { get; set; }
        public EnumImage IsStatus { get; set; }
    }

    //public class ModuleMasterModel
    //{
    //    public int ModuleId { get; set; }
    //    public string ModuleName { get; set; }
    //    public int ModuleIamgeId { get; set; }
    //    public string ModuleDesc { get; set; }
    //    public string SampleImage { get; set; }        
    //}

    //public class UserImageModel
    //{
    //    public int UserImageId { get; set; }
    //    public int ModuleId { get; set; }
    //    public int ModuleIamgeId { get; set; }
    //    public string UserImage { get; set; }
    //    public string Comment { get; set; }
    //    public int IsStatus { get; set; }
    //}
}