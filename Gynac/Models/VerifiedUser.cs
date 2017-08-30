using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac
{
    public class VerifiedUser
    {
        public bool EmailVerificationPending { get; set; }
        public User UserInfo { get; set; }
        public List<User_Course> PendingUserCourse { get; set; }
        public List<User_Course> ActiveUserCourse { get; set; }
        public List<User_Course> ExpiredUserCourse { get; set; }
        public string PaymentGuid { get; set; }
        public bool IsLogin { get; set; }
        public string Otp { get; set; }
        public bool IsTalkExist { get; set; }
        public string IpAddress { get; set; }
        public string UserAgent { get; set; }
        public bool IsAlreadyLoginSameIp { get; set; }
    }
}