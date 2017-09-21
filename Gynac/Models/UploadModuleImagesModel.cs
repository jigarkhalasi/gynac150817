using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac.Models
{
    public class UploadModuleImagesModel
    {
        public int UserModuleImageId { get; set; }
        public string ImagePath { get; set; }
        public int IsStatus { get; set; }
        public int ModuleId { get; set; }
        public int ModuleImageId { get; set; }
        public int UserId { get; set; }
        public int FacultyId { get; set; }
        public string Comment { get; set; }
        public string ModuleName { get; set; }
        public string UserEmail { get; set; }
        public string SpeakerEmail { get; set; }
    }
}