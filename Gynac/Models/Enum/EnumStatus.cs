using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac.Models.Enum
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum EnumUserTalk
    {
        IsPending = 0,
        IsActive = 1,
        IsExam = 0,
        IsExamClear = 1,
        IsVideo = 0,
        IsVideoClear = 1,
        IsModule = 0,
        IsModuleClear = 1
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum EnumImage
    {
        IsPending = 0,
        IsAccepted = 1,
        IsRejected = 2
    }
}