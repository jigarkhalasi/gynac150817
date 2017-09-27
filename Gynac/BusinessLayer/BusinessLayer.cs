using Gynac.Models;
using Gynac.Models.Enum;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Data;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Web;


namespace Gynac
{
    public class BusinessLayer
    {
        public DataAccessLayer _dataAccessLayer = new DataAccessLayer();

        public int SaveUser(User user)
        {
            int result = 0;
            try
            {
                string response = _dataAccessLayer.SaveUser(user);

                if (!String.IsNullOrWhiteSpace(response) && response.Trim().Equals("2"))
                {
                    result = 2;
                }
                else if (!String.IsNullOrWhiteSpace(response) && !response.Trim().Equals("0"))
                {
                    SendMail(user.Email, EmailType.VerifyEmail, response);
                    string support = ConfigurationManager.AppSettings["EmailForRegisterUser"].ToString();
                    string body = (@"<b>New User Register " + user.First_Name + " " + user.Last_Name + "</b><br/></br>"
                                        + "<table>"
                                       + "<tr>"
                                       + "<th>Firstname</th>"
                                       + "<th>Lastname</th>  "
                                       + "<th>Professional Speciality</th>     "
                                       + "<th>Education Qualification</th>"
                                       + "<th>Address</th>"
                                       + "<th>City</th>"
                                       + "<th>Country</th>"
                                       + "<th>Telephone Number:</th>"
                                       + "<th>Work Place</th>"
                                       + "<th>Email</th>"
                                       + "<th>How did you hear about Us?</th>"
                                    + " </tr>"
                                    + " <tr>"
                                    + "   <td>" + user.First_Name + "</td>"
                                    + "   <td>" + user.Last_Name + "</td>"
                                    + "   <td>" + user.Professional_Specialty + "</td>"
                                    + "   <td>" + user.Educational_Qualification + "</td>"
                                    + "   <td>" + user.Street_Address + "</td>"
                                    + "   <td>" + user.City_Town + "</td>"
                                    + "   <td>" + user.Country + "</td>"
                                    + "   <td>" + user.Mobile + "</td>"
                                    + "   <td>" + user.Institution_Work_Place + "</td>"
                                    + "   <td>" + user.Email + "</td>"
                                    + "   <td>" + user.Where_Hear + "</td>"
                                    + " </tr>"
                                    + "</table>");
                    SendMail(support, EmailType.Registration, "", body, "");
                    result = 1;

                }
            }
            catch
            {
                throw;
            }
            return result;
        }

        private void SendMail(string toAddress, EmailType emailType, string guid, string bodyData = "", string subjectData = "")
        {
            MailMessage message = new MailMessage();
            SmtpClient smtpClient = new SmtpClient();

            string smtpHost = ConfigurationManager.AppSettings["SmtpHost"].ToString();
            string smtpUser = ConfigurationManager.AppSettings["SmtpUser"].ToString();
            string smtpPassword = ConfigurationManager.AppSettings["SmtpPassword"].ToString();

            string subject = string.Empty;
            string body = string.Empty;
            string mailUrl = string.Empty;

            //message.Headers = 
            try
            {
                if (emailType.Equals(EmailType.ContactUs))
                {
                    message.From = new MailAddress(toAddress);
                    message.To.Add(ConfigurationManager.AppSettings["ContactUsEmailAddress"].ToString());
                }
                else if (emailType.Equals(EmailType.Comment))
                {
                    message.From = new MailAddress(ConfigurationManager.AppSettings["SmtpUser"].ToString());
                    message.To.Add(toAddress);
                    string copy = ConfigurationManager.AppSettings["EmailFromAddress"].ToString();
                    message.CC.Add(copy);
                }
                else if (emailType.Equals(EmailType.ImageSubmission))
                {
                    message.From = new MailAddress(ConfigurationManager.AppSettings["SmtpUser"].ToString());
                    message.To.Add(toAddress);
                    string copy = ConfigurationManager.AppSettings["EmailFromAddress"].ToString();
                    message.CC.Add(copy);
                }
                else if (emailType.Equals(EmailType.Registration) || emailType.Equals(EmailType.VerifyEmail) || emailType.Equals(EmailType.Otp) || emailType.Equals(EmailType.isParticipate))
                {
                    message.From = new MailAddress(ConfigurationManager.AppSettings["SmtpUser"].ToString());
                    message.To.Add(toAddress);
                }
                else
                {
                    message.From = new MailAddress(ConfigurationManager.AppSettings["EmailFromAddress"].ToString()); ;
                    message.To.Add(toAddress);
                }

                //message.Bcc.Add(ConfigurationManager.AppSettings["EmailBccAddress"].ToString());

                message.IsBodyHtml = true;
                message.Headers.Add("Content-Type", "content=text/html; charset=\"UTF-8\"");
                switch (emailType)
                {
                    case EmailType.VerifyEmail:
                        subject = "Email Verification";
                        mailUrl = ConfigurationManager.AppSettings["VerifyEmailUrl"].ToString();
                        var body1 = new StringBuilder();
                        //body1.AppendLine(@"<b>Click the link below to verify your email address. After successful verification, our support staff will reach out to you for further details on the course and payment.</b> <br/><br/><br/>");
                        //body1.AppendLine("<a target='_blank' href='" + mailUrl + "/" + guid + "/" + toAddress + "'>Verify Email</a>");
                        //body = body1.ToString();
                        if (toAddress.Contains("gmail.com"))
                        {
                            body = @"<b>Click the link below to verify your email address. After successful verification, our support staff will reach out to you for further details on the course and payment.</b> <br/><br/><br/> <a target='_blank' href='" + mailUrl + "/" + guid + "/" + toAddress + "'>Verify Email</a>";
                        }
                        else
                        {
                            body = @"<b>Copy Paste the link below to verify your email address. After successful verification, our support staff will reach out to you for further details on the course and payment.</b> <br/><br/><br/> " + mailUrl + "/" + guid + "/" + toAddress + "";
                        }

                        break;
                    case EmailType.ForgotPassword:
                        subject = "Reset Password";
                        mailUrl = ConfigurationManager.AppSettings["ForgotPasswordUrl"].ToString();
                        body = @"<b>Click the link below to reset your password</b> <br/><br/> <a target='_blank' href='" + mailUrl + "/" + guid + "/" + toAddress + "'>Reset Password</a>";
                        break;
                    case EmailType.ResetPassword:
                        subject = "Password Changed";
                        mailUrl = "dummy";
                        body = "<b>Password changed successfully.</b>";
                        break;
                    case EmailType.ContactUs:
                        subject = String.IsNullOrWhiteSpace(subjectData) ? "Contact Us" : subjectData;
                        mailUrl = "dummy";
                        body = bodyData;
                        break;
                    case EmailType.Otp:
                        subject = "OTP for Login - GynAc";
                        mailUrl = "otp";
                        body = bodyData;
                        break;
                    case EmailType.Registration:
                        subject = "New Register User";
                        mailUrl = "regisetr";
                        body = bodyData;
                        break;
                    case EmailType.Comment:
                        subject = "New Query";
                        mailUrl = "comment";
                        body = bodyData;
                        break;
                    case EmailType.isParticipate:
                        subject = "Participate For Exam";
                        mailUrl = "Exam";
                        body = bodyData;
                        break;
                    case EmailType.ImageSubmission:
                        subject = "New Image Submission";
                        mailUrl = "New Image Submission";
                        body = bodyData;
                        break;
                    default:
                        break;
                }

                message.Subject = subject;
                message.Body = body;

                smtpClient.Host = smtpHost;   // We use gmail as our smtp client
                smtpClient.Port = 2525;
                //smtpClient.EnableSsl = true;
                //smtpClient.UseDefaultCredentials = true;
                smtpClient.Credentials = new System.Net.NetworkCredential(smtpUser, smtpPassword);

                if (!string.IsNullOrWhiteSpace(subject) && !string.IsNullOrWhiteSpace(body) && !string.IsNullOrWhiteSpace(mailUrl))
                {
                    smtpClient.Send(message);
                }
            }
            catch
            {
                throw;
            }
        }

        public VerifiedUser UpdateUser(User user)
        {
            VerifiedUser verifiedUser = null;
            DataSet ds = null;
            try
            {
                ds = _dataAccessLayer.UpdateUser(user);
                verifiedUser = GetVerifiedUser(ds);
            }
            catch
            {
                throw;
            }
            return verifiedUser;
        }

        public VerifiedUser VerifyLogin(Login login)
        {
            VerifiedUser verifiedUser = null;
            DataSet ds = null;
            try
            {
                ds = _dataAccessLayer.VerifyLogin(login);

                verifiedUser = GetVerifiedUser(ds);
            }
            catch
            {
                throw;
            }
            return verifiedUser;
        }

        public VerifiedUser VerifyLoginByGuid(User user)
        {
            VerifiedUser verifiedUser = null;
            DataSet ds = null;
            try
            {
                ds = _dataAccessLayer.VerifyLoginByGuid(user);

                verifiedUser = GetVerifiedUser(ds);
            }
            catch
            {
                throw;
            }
            return verifiedUser;
        }

        private VerifiedUser GetVerifiedUser(DataSet ds)
        {
            VerifiedUser verifiedUser = null;

            try
            {
                if (ds != null && ds.Tables != null && ds.Tables.Count == 1)
                {
                    verifiedUser = new VerifiedUser();
                    verifiedUser.EmailVerificationPending = true;
                }
                else if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0] != null && ds.Tables[0].Rows != null && ds.Tables[0].Rows.Count > 0)
                {
                    DataRow drUser = ds.Tables[0].Rows[0];

                    verifiedUser = new VerifiedUser();
                    verifiedUser.EmailVerificationPending = false;
                    verifiedUser.IsLogin = Boolean.Parse(drUser["IsLogin"].ToString());

                    verifiedUser.UserInfo = new User();
                    verifiedUser.UserInfo.User_Id = Int32.Parse(drUser["User_Id"].ToString());
                    verifiedUser.UserInfo.Title = drUser["Title"].ToString();
                    verifiedUser.UserInfo.First_Name = drUser["First_Name"].ToString();
                    verifiedUser.UserInfo.Middle_Name = drUser["Middle_Name"].ToString();
                    verifiedUser.UserInfo.Last_Name = drUser["Last_Name"].ToString();
                    verifiedUser.UserInfo.Email = drUser["Email"].ToString();
                    verifiedUser.UserInfo.Email_Verified = Boolean.Parse(drUser["Email_Verified"].ToString());
                    verifiedUser.UserInfo.Mobile = drUser["Mobile"].ToString();
                    verifiedUser.UserInfo.Password = drUser["Password"].ToString();
                    verifiedUser.UserInfo.Professional_Specialty = drUser["Professional_Specialty"].ToString();
                    verifiedUser.UserInfo.Educational_Qualification = drUser["Educational_Qualification"].ToString();
                    verifiedUser.UserInfo.Street_Address = drUser["Street_Address"].ToString();
                    verifiedUser.UserInfo.City_Town = drUser["City_Town"].ToString();
                    verifiedUser.UserInfo.Country = drUser["Country"].ToString();
                    verifiedUser.UserInfo.Institution_Work_Place = drUser["Institution_Work_Place"].ToString();
                    verifiedUser.IpAddress = drUser["IpAddress"].ToString();
                    verifiedUser.UserAgent = drUser["UserAgent"].ToString();
                    verifiedUser.UserInfo.TutorialSummaryTitle = drUser["TutorialSummaryTitle"].ToString();
                    
                    if (drUser["Isparticipate"].ToString() != "")
                    {
                        verifiedUser.UserInfo.Isparticipate = (Convert.ToBoolean(drUser["Isparticipate"].ToString()) == true) ? true : false;
                    }

                    verifiedUser.PendingUserCourse = new List<User_Course>();
                    verifiedUser.ActiveUserCourse = new List<User_Course>();
                    verifiedUser.ExpiredUserCourse = new List<User_Course>();

                    User_Course userCourse = null;

                    //// Pending User Course
                    //if (ds.Tables.Count > 1 && ds.Tables[1] != null && ds.Tables[1].Rows != null && ds.Tables[1].Rows.Count > 0)
                    //{
                    //    DataTable dtUserCourse = ds.Tables[1];
                    //    foreach (DataRow dr in dtUserCourse.Rows)
                    //    {
                    //        userCourse = new User_Course();
                    //        userCourse.User_Id = Int32.Parse(dr["User_Id"].ToString());
                    //        userCourse.Course_Id = Int32.Parse(dr["Course_Id"].ToString());
                    //        userCourse.Registered_Date = DateTime.Parse(dr["Registered_Date"].ToString());
                    //        userCourse.Registered_Till = DateTime.Parse(dr["Registered_Till"].ToString());
                    //        userCourse.Payment_Mode = dr["Payment_Mode"].ToString();
                    //        userCourse.Payment_Amount = Decimal.Parse(dr["Payment_Amount"].ToString());
                    //        userCourse.Payment_Currency = dr["Payment_Currency"].ToString();
                    //        userCourse.Payment_Pending = Boolean.Parse(dr["Payment_Pending"].ToString());

                    //        verifiedUser.PendingUserCourse.Add(userCourse);
                    //    }
                    //}

                    // Active User Course
                    if (ds.Tables.Count > 1 && ds.Tables[1] != null && ds.Tables[1].Rows != null && ds.Tables[1].Rows.Count > 0)
                    {
                        DataTable dtUserCourse = ds.Tables[1];
                        foreach (DataRow dr in dtUserCourse.Rows)
                        {
                            userCourse = new User_Course();
                            userCourse.User_Id = Int32.Parse(dr["User_Id"].ToString());
                            userCourse.Course_Id = Int32.Parse(dr["Course_Id"].ToString());
                            userCourse.Registered_Date = DateTime.Parse(dr["Registered_Date"].ToString());
                            userCourse.Registered_Till = DateTime.Parse(dr["Registered_Till"].ToString());
                            userCourse.Payment_Mode = dr["Payment_Mode"].ToString();
                            userCourse.Payment_Amount = Decimal.Parse(dr["Payment_Amount"].ToString());
                            userCourse.Payment_Currency = dr["Payment_Currency"].ToString();

                            verifiedUser.ActiveUserCourse.Add(userCourse);
                        }
                    }

                    // Expired User Course
                    if (ds.Tables.Count > 2 && ds.Tables[2] != null && ds.Tables[2].Rows != null && ds.Tables[2].Rows.Count > 0)
                    {
                        DataTable dtUserCourse = ds.Tables[2];
                        foreach (DataRow dr in dtUserCourse.Rows)
                        {
                            userCourse = new User_Course();
                            userCourse.User_Id = Int32.Parse(dr["User_Id"].ToString());
                            userCourse.Course_Id = Int32.Parse(dr["Course_Id"].ToString());
                            userCourse.Registered_Date = DateTime.Parse(dr["Registered_Date"].ToString());
                            userCourse.Registered_Till = DateTime.Parse(dr["Registered_Till"].ToString());
                            userCourse.Payment_Mode = dr["Payment_Mode"].ToString();
                            userCourse.Payment_Amount = Decimal.Parse(dr["Payment_Amount"].ToString());
                            userCourse.Payment_Currency = dr["Payment_Currency"].ToString();

                            verifiedUser.ExpiredUserCourse.Add(userCourse);
                        }
                    }

                    //usertalk exist or not
                    if (ds.Tables.Count > 3 && ds.Tables[3] != null && ds.Tables[3].Rows != null && ds.Tables[3].Rows.Count > 0)
                    {
                        verifiedUser.IsTalkExist = Convert.ToInt32(ds.Tables[3].Rows[0][0].ToString()) > 0 ? true : false;
                    }

                    // Payment work Guid
                    //if (ds.Tables.Count > 3 && ds.Tables[3] != null && ds.Tables[3].Rows != null && ds.Tables[3].Rows.Count > 0)
                    if (ds.Tables.Count > 4 && ds.Tables[4] != null && ds.Tables[4].Rows != null && ds.Tables[4].Rows.Count > 0)
                    {
                        int index = ds.Tables[3].Rows.Count - 1;

                        verifiedUser.PaymentGuid = Convert.ToString(ds.Tables[3].Rows[index]["GUID"]);
                    }
                }
            }
            catch
            {
                throw;
            }

            return verifiedUser;
        }

        public VerifiedUser SaveUserCourse(List<User_Course> userCourse)
        {
            VerifiedUser verifiedUser;
            DataSet ds = null;
            try
            {
                //List<Course> allCourses = GetCourses();
                //ds = _dataAccessLayer.SaveUserCourse(allCourses, userCourse);
                ds = _dataAccessLayer.SaveUserCourse(userCourse);

                verifiedUser = GetVerifiedUser(ds);

            }
            catch
            {
                throw;
            }
            return verifiedUser;
        }

        public List<Course> GetCourses()
        {
            {
                List<Course> allCourses = null;
                Course course = null;
                try
                {
                    DataTable dt = _dataAccessLayer.GetAllCourse();

                    if (dt != null && dt.Rows != null && dt.Rows.Count > 0)
                    {
                        allCourses = new List<Course>();

                        foreach (DataRow dr in dt.Rows)
                        {
                            course = new Course();
                            course.Course_Id = Int32.Parse(dr["Course_Id"].ToString());
                            course.Faculty_Id = Int32.Parse(dr["Faculty_Id"].ToString());
                            course.Course_Image = dr["Course_Image"].ToString();
                            course.Name = dr["Name"].ToString();
                            course.Description = dr["Description"].ToString();
                            course.Fees = Int32.Parse(dr["Fees"].ToString());
                            course.Currency = dr["Currency"].ToString();
                            course.Validity_Days = Int32.Parse(dr["Validity_Days"].ToString());

                            allCourses.Add(course);
                        }
                    }
                }
                catch
                {
                    throw;
                }
                return allCourses;
            }
        }

        public int EmailVerified(User user)
        {
            int result = 0;
            try
            {
                List<Course> allCourses = GetCourses();
                result = _dataAccessLayer.EmailVerified(user);
            }
            catch
            {
                throw;
            }
            return result;
        }

        public int ForgotPassword(User user)
        {
            int result = 0;
            string response = _dataAccessLayer.ForgotPassword(user);

            if (!String.IsNullOrWhiteSpace(response) && response.Trim().Equals("0"))
            {
                result = 2;
            }
            else if (!String.IsNullOrWhiteSpace(response) && !response.Trim().Equals("0"))
            {
                SendMail(user.Email, EmailType.ForgotPassword, response);
                result = 1;
            }
            return result;
        }

        public int ResetPassword(User user)
        {
            int result = 0;
            try
            {
                string response = _dataAccessLayer.ResetPassword(user);

                if (!String.IsNullOrWhiteSpace(response) && response.Trim().Equals("0"))
                {
                    result = 2;
                }
                else if (!String.IsNullOrWhiteSpace(response) && !response.Trim().Equals("0"))
                {
                    SendMail(user.Email, EmailType.ResetPassword, response);
                    result = 1;
                }
            }
            catch
            {
                throw;
            }
            return result;
        }

        public int GetTotalCourseCost(string guid)
        {
            int result = 0;
            try
            {
                result = _dataAccessLayer.GetTotalCourseCost(guid);
            }
            catch
            {
                throw;
            }
            return result;
        }

        public int ActivateUserCourse(string guid, string transaction_Id, string transaction_Status, string order_Status)
        {
            int noOfActivatedCourse = 0;
            try
            {
                noOfActivatedCourse = _dataAccessLayer.ActivateUserCourse(guid, transaction_Id, transaction_Status, order_Status);
            }
            catch
            {
                throw;
            }
            return noOfActivatedCourse;
        }

        public int SendContactUsEmail(ContactUs contactUs)
        {
            int result = 0;
            try
            {
                SendMail(contactUs.FromAddress, EmailType.ContactUs, String.Empty, contactUs.Body, contactUs.Subject);
                result = 1;
            }
            catch
            {

                throw;
            }
            return result;
        }

        public User GetUser(int userId)
        {
            var res = new User();
            try
            {
                res = _dataAccessLayer.GetUser(userId);
            }
            catch
            {
                throw;
            }
            return res;
        }
        //update the signout login
        public int SignOut(int userId)
        {
            int result = 0;
            try
            {
                result = _dataAccessLayer.SignOut(userId);
            }
            catch
            {
                throw;
            }
            return result;
        }

        //update the signout login
        public int SignIn(int userId)
        {
            int result = 0;
            try
            {
                result = _dataAccessLayer.SignIn(userId);
            }
            catch
            {
                throw;
            }
            return result;
        }

        //get notification
        public IEnumerable<NotificationModel> GetNotificationByUserId(int userId)
        {
            var model = new List<NotificationModel>();
            try
            {
                DataSet ds = _dataAccessLayer.GetNotificationByUserId(userId);
                if (ds != null)
                {
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        var data = new NotificationModel();
                        data.NotificationId = Convert.ToInt32(row["NotificationId"].ToString());
                        data.Comment = row["Comment"].ToString();
                        data.IsRead = Convert.ToBoolean(row["IsRead"]);
                        model.Add(data);
                    }
                }
            }
            catch
            {

                throw;
            }
            return model;
        }

        //update notification
        public int UpdateNotification(int userId)
        {
            int result = 0;
            try
            {
                result = _dataAccessLayer.UpdateNotification(userId);
            }
            catch
            {
                throw;
            }
            return result;
        }

        public IEnumerable<UserTalksModel> GetUserTalk(int userId)
        {
            var model = new List<UserTalksModel>();
            var moduleList = new List<UserModuleModel>();
            try
            {
                DataSet ds = _dataAccessLayer.GetUserTalk(userId);
                if (ds != null)
                {
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        var data = new UserTalksModel();                        

                        int sId = Convert.ToInt32(row["SessionId"].ToString());
                        int mId = Convert.ToInt32(row["ModuleId"].ToString());
                        int tId = Convert.ToInt32(row["TalkId"].ToString());

                        data.SessionId = sId;
                        data.SessionName = row["SessionName"].ToString();

                        data.ModuleId = mId;
                        data.ModuleName = row["ModuleName"].ToString();

                        data.TalkId = tId;
                        data.TalkName = row["TalkName"].ToString();
                        data.Talkdesc = row["Talkdesc"].ToString();
                        data.Duration = row["Duration"].ToString();

                        if (ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
                        {
                            foreach (DataRow usertalk in ds.Tables[1].Rows)
                            {
                                if (sId == Convert.ToInt32(usertalk["SessionId"].ToString()) && mId == Convert.ToInt32(usertalk["ModuleId"].ToString()) && tId == Convert.ToInt32(usertalk["TalkId"].ToString()))
                                {
                                    data.UserTalkId = Convert.ToInt32(usertalk["UserTalkId"].ToString());
                                    data.Comment = usertalk["Comment"].ToString();
                                    data.IsActive = (usertalk["IsActive"].ToString() == "0") ? "IsPending" : "IsActive";
                                    data.IsExam = (usertalk["IsExamlear"].ToString() == "0") ? "IsPending" : "IsActive";
                                    data.IsVideo = (usertalk["IsVideoStatus"].ToString() == "0") ? "IsPending" : "IsActive";
                                    if (usertalk["IsModuleClear"].ToString() == "0")
                                    {
                                        data.IsModuleClear = "IsPending";
                                    }
                                    else if (usertalk["IsModuleClear"].ToString() == "1") { 
                                        data.IsModuleClear ="IsActive";
                                    }
                                    else if (usertalk["IsModuleClear"].ToString() == "2")
                                    {
                                        data.IsModuleClear="IsCompleted";
                                    }                                     
                                }                                
                            }
                        }                                                
                        model.Add(data);                        
                    }
                }
            }
            catch
            {

                throw;
            }
            return model;
        }

        //update userTalk video  status
        public int UpdateUserTalksStatus(UpdateUserTalkModel model)
        {
            int result = 0;
            try
            {
                result = _dataAccessLayer.UpdateUserTalksStatus(model);
            }
            catch
            {
                throw;
            }
            return result;
        }

        //upload image 
        public int UploadModuleImages(UploadModuleImagesModel model, string fileName)
        {
            int result = 0;
            try
            {
                result = _dataAccessLayer.UploadModuleImages(model);

                DataSet facultyRes = _dataAccessLayer.GetFacultyId(model.FacultyId);

                string facultyEmail = string.Empty;
                string toAddress = string.Empty;

                if(facultyRes != null){
                     facultyEmail = facultyRes.Tables[0].Rows[0]["Email"].ToString();
                     toAddress = model.UserEmail + "," + facultyEmail;
                }

                string body = string.Empty;
                string path = HttpContext.Current.Server.MapPath("~/gynacApp/local/emailTemplates/ImageSubmittion.html");

                using (StreamReader reader = new StreamReader(path))
                {
                    body = reader.ReadToEnd();
                }

                body = body.Replace("{modulename}", model.ModuleName);
                //body = body.Replace("{moduleimage}", fileName);                

               SendMail(toAddress, EmailType.ImageSubmission, "", body);
               result = 1;

            }
            catch
            {
                throw;
            }
            return result;
        }

        public TalkVideoModel GetTalkVideo(int talkId, int userTalkId)
        {
            var model = new TalkVideoModel();
            try
            {
                DataSet ds = _dataAccessLayer.GetTalkVideo(talkId, userTalkId);
                if (ds != null)
                {
                    var row = ds.Tables[0].Rows[0];
                    model.TalkId = Convert.ToInt32(row["Id"].ToString());
                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        if (model.TalkId == Convert.ToInt32(ds.Tables[1].Rows[0]["TalkId"].ToString()))
                        {
                            bool backupVideo = Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["BackupVideoLink"]);
                            if (backupVideo)
                            {
                                model.VideoLink = row["BackupVideoLink"].ToString();
                                model.IsBackup = true;
                            }
                            else
                            {
                                model.IsBackup = false;
                                Int32 unixTimestamp = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;

                                Int32 ExpireTime = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["ExpireTime"]);
                                string SecurityKey = System.Configuration.ConfigurationManager.AppSettings["SecurityKey"];
                                string videoUrl = System.Configuration.ConfigurationManager.AppSettings["Jwplayer"];

                                model.ExpTime = unixTimestamp + ExpireTime;
                                string vdeiolink = row["VideoLink"].ToString() + ":" + model.ExpTime + ":" + SecurityKey;

                                model.Signature = Encrypt(vdeiolink, true);
                                model.VideoLink = row["VideoLink"].ToString();

                                // model.VideoLink = videoUrl + row["VideoLink"].ToString() + ".html?sig=" + model.Signature + "&exp=" + model.ExpTime;

                                //string vdeiolink1 = "players/wHEkqM70-RZnnsc9B" + ":" + model.ExpTime + ":" + SecurityKey;
                                //model.Signature = Encrypt(vdeiolink1, true);

                                //model.PreViewVideoLink = videoUrl + "players/wHEkqM70-RZnnsc9B" + ".html?sig=" + model.Signature + "&exp=" + model.ExpTime;

                                // model.VideoLink = row["VideoLink"].ToString();
                            }

                        }
                        model.FacultyId = Convert.ToInt32(row["FacultyId"].ToString());
                        model.FacultyName = row["FacultyName"].ToString();
                        model.ProfilePic = row["ProfilePic"].ToString();
                        model.Email = row["Email"].ToString();
                    }
                    else
                    {
                        model.PreViewVideoLink = row["PreViewVideoLink"].ToString();
                    }
                    model.Name = row["Name"].ToString();

                }
            }
            catch
            {

                throw;
            }
            return model;
        }

        public int UpdateUserTalkComment(UpdateUserTalkCommentModel model)
        {
            int result = 0;
            try
            {
                result = _dataAccessLayer.UpdateUserTalkComment(model);
                string body = string.Empty;
                string path = HttpContext.Current.Server.MapPath("~/gynacApp/local/emailTemplates/QueryEmail.html");
                using (StreamReader reader = new StreamReader(path))
                {
                    body = reader.ReadToEnd();
                }
                body = body.Replace("{userEmailId}", model.UserEmail);
                body = body.Replace("{query}", model.Comment);

                //string bodyData = @"<b> Comment :- " + model.Comment + "Send By</b> <br><br> " + model.UserEmail;
                SendMail(model.Email, EmailType.Comment, "", body);
                result = 1;
            }
            catch
            {
                //remove thow not error handle
            }
            return result;
        }

        //update usertalk exam
        public int UpdateUserTalkExam(int userTalkId, int moduleId, int userId)
        {
            int result = 0;
            try
            {
                result = _dataAccessLayer.UpdateUserTalkExam(userTalkId, moduleId, userId);
                result = 1;
            }
            catch
            {
                throw;
            }
            return result;
        }

        public IEnumerable<UserModuleImageModel> GetModuleImages(int moduleId, int userId)
        {
            var model = new List<UserModuleImageModel>();            
            try
            {
                DataSet ds = _dataAccessLayer.GetModuleImages(moduleId, userId);

                if (ds != null)
                {
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        var data = new UserModuleImageModel();
                        var moduleId1 = row["ModuleId"].ToString();
                        data.ModuleId = Convert.ToInt32(row["ModuleId"].ToString());
                        data.ModuleName = row["ModuleName"].ToString();

                        var moduleImageId = row["ModuleImageId"].ToString();
                        data.ModuleImageId = Convert.ToInt32(row["ModuleImageId"].ToString());

                        data.ModuleDesc = row["ModuleDesc"].ToString();
                        data.ModuleImageDesc = row["ModuleImageDesc"].ToString();
                        var backEndUrl = System.Configuration.ConfigurationManager.AppSettings["BackendUrl"];
                        data.SampleImage = backEndUrl + row["SampleImage"].ToString();
                        data.FacultyId = Convert.ToInt32(row["FacultyId"].ToString());

                        foreach (DataRow row1 in ds.Tables[1].Rows)
                        {
                            if (row1["ModulId"].ToString() == moduleId1 && row1["ModuleImageId"].ToString() == moduleImageId)
                            {
                                data.UserImageId = Convert.ToInt32(row1["UserImageId"].ToString());
                                data.UserImage = row1["UserImage"].ToString();
                                data.Comment = row1["Comment"].ToString();
                                var a = Convert.ToInt16(row1["IsStatus"].ToString());
                                switch (a)
                                {
                                    case 0:
                                        data.IsStatus = EnumImage.IsPending;
                                        break;
                                    case 1:
                                        data.IsStatus = EnumImage.IsAccepted;
                                        break;
                                    case 2:
                                        data.IsStatus = EnumImage.IsRejected;
                                        break;
                                }
                            }
                        }



                        model.Add(data);
                    }

                }
            }
            catch
            {

                throw;
            }
            return model;
        }


        //encypted the videofike
        public static string Encrypt(string toEncrypt, bool useHashing)
        {
            using (MD5 md5Hash = MD5.Create())
            {

                // Convert the input string to a byte array and compute the hash.
                byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(toEncrypt));

                // Create a new Stringbuilder to collect the bytes
                // and create a string.
                StringBuilder sBuilder = new StringBuilder();

                // Loop through each byte of the hashed data 
                // and format each one as a hexadecimal string.
                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString("x2"));
                }

                // Return the hexadecimal string.
                return sBuilder.ToString();

            }

        }

        //decrypted the video file
        public static string Decrypt(string cipherString, bool useHashing)
        {
            byte[] keyArray;
            //get the byte code of the string

            byte[] toEncryptArray = Convert.FromBase64String(cipherString);

            System.Configuration.AppSettingsReader settingsReader =
                                                new AppSettingsReader();
            //Get your key from config file to open the lock!
            string key = (string)settingsReader.GetValue("SecurityKey",
                                                         typeof(String));

            if (useHashing)
            {
                //if hashing was used get the hash code with regards to your key
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
                //release any resource held by the MD5CryptoServiceProvider

                hashmd5.Clear();
            }
            else
            {
                //if hashing was not implemented get the byte code of the key
                keyArray = UTF8Encoding.UTF8.GetBytes(key);
            }

            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
            //set the secret key for the tripleDES algorithm
            tdes.Key = keyArray;
            //mode of operation. there are other 4 modes. 
            //We choose ECB(Electronic code Book)

            tdes.Mode = CipherMode.ECB;
            //padding mode(if any extra byte added)
            tdes.Padding = PaddingMode.PKCS7;

            ICryptoTransform cTransform = tdes.CreateDecryptor();
            byte[] resultArray = cTransform.TransformFinalBlock(
                                 toEncryptArray, 0, toEncryptArray.Length);
            //Release resources held by TripleDes Encryptor                
            tdes.Clear();
            //return the Clear decrypted TEXT
            return UTF8Encoding.UTF8.GetString(resultArray);
        }

        public string sendSMS(string otp, string Mobile, string message)
        {
            var result = "";
            try
            {
                var apiKey = System.Configuration.ConfigurationManager.AppSettings["SmsApiKey"];
                var senderText = System.Configuration.ConfigurationManager.AppSettings["SmsSenderText"];
                // String message1 = HttpUtility.UrlEncode(message);
                //String message = "Dear User, Your OTP for varification is " + otp + ", Please do not share with other. - GynAc";//HttpUtility.UrlEncode(otp);
                using (var wb = new WebClient())
                {
                    byte[] response = wb.UploadValues("https://api.textlocal.in/send/", new NameValueCollection(){
                        {"apikey" , apiKey},
                        {"numbers" , Mobile},
                        {"message" , message},
                        {"sender" , senderText}
                    });

                    result = System.Text.Encoding.UTF8.GetString(response);
                }
            }
            catch (Exception)
            {
            }
            return result;
        }

        public int SendOtpEmail(string Email, string message)
        {
            int result = 0;
            try
            {
                SendMail(Email, EmailType.Otp, String.Empty, message);
                result = 1;
            }
            catch
            {

            }
            return result;
        }

        public IEnumerable<UserRatingsModel> GetUserRatings(int userId)
        {
            var model = new List<UserRatingsModel>();
            try
            {
                DataSet ds = _dataAccessLayer.GetUserRatings(userId);
                if (ds != null)
                {
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        var data = new UserRatingsModel();

                        int ratingId = Convert.ToInt32(row["Id"].ToString());
                        data.RatingId = ratingId;

                        data.RatingName = row["RatingName"].ToString();

                        if (ds.Tables[1] != null)
                        {
                            foreach (DataRow userRate in ds.Tables[1].Rows)
                            {
                                if (ratingId == Convert.ToInt32(userRate["RatId"].ToString()))
                                {
                                    data.UserRatingId = Convert.ToInt32(userRate["UserRatingId"].ToString());
                                    data.UserId = Convert.ToInt32(userRate["UserId"].ToString());
                                    data.RateMark = Convert.ToInt32(userRate["RateMark"].ToString());
                                }
                            }
                        }
                        model.Add(data);
                    }
                }
            }
            catch
            {

                throw;
            }
            return model;
        }

        public int UpdateUserRating(UserRatingsModel model)
        {
            int result = 0;
            try
            {
                result = _dataAccessLayer.UpdateUserRating(model);
                result = 1;
            }
            catch
            {
                throw;
            }
            return result;
        }

        //add user bookmark
        public int AddUserBookmark(UserBookmarkModel model)
        {
            int result = 0;
            try
            {
                result = _dataAccessLayer.AddUserBookmark(model);
                result = 1;
            }
            catch
            {
                throw;
            }
            return result;
        }

        //get all userbook mark
        public IEnumerable<UserBookmarkModel> GetUserBookmark(int userId, int talkId)
        {
            var model = new List<UserBookmarkModel>();
            try
            {
                DataSet ds = _dataAccessLayer.GetUserBookmark(userId, talkId);
                if (ds != null)
                {
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        var data = new UserBookmarkModel();


                        data.Id = Convert.ToInt32(row["Id"].ToString());
                        data.UserId = Convert.ToInt32(row["UserId"].ToString());
                        data.BookMarkName = row["BookMarkName"].ToString();
                        data.BookMarkTime = row["BookMarkTime"].ToString();
                        data.TalkId = Convert.ToInt32(row["TalkId"].ToString());

                        model.Add(data);
                    }
                }
            }
            catch
            {

                throw;
            }
            return model;
        }

        //delet user bookmark
        public int DeleteUserBookmark(int userBookmarkId)
        {
            int result = 0;
            try
            {
                result = _dataAccessLayer.DeleteUserBookmark(userBookmarkId);
                result = 1;
            }
            catch
            {
                throw;
            }
            return result;
        }

        //update ip address
        public int UpdateIpAddress(UserLogModel ipModel)
        {
            int result = 0;
            try
            {
                result = _dataAccessLayer.UpdateIpAddress(ipModel);
                result = 1;
            }
            catch
            {
                throw;
            }
            return result;
        }

        //get tutorial summary
        public IEnumerable<TutorialSummaryModel> GetTutorialSummary(int userId)
        {
            var model = new List<TutorialSummaryModel>();
            try
            {
                DataSet ds = _dataAccessLayer.GetTutorialSummary(userId);

                if (ds != null && ds.Tables[0].Rows[0][0].ToString() == "Session 1")
                {
                    int i = 0;
                    int moduleCountCompleted = 0;
                    int moduleCountPending = 0;
                    int finalmoduleCountCompleted = 0;
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        var data = new TutorialSummaryModel();
                        if (row["SessionName"].ToString() == ds.Tables[1].Rows[i]["SessionName"].ToString())
                        {
                            data.SessionName = row["SessionName"].ToString();
                            data.TotalTalks = Convert.ToInt32(row["TotalTalks"].ToString());
                            if (row["TotalCompletedTalks"].ToString() != "")
                            {
                                
                                    data.TotalCompletedTalks = (row["TotalCompletedTalks"].ToString() != "") ? Convert.ToInt32(row["TotalCompletedTalks"].ToString()) : 0;
                                    data.TotalPendingTalks = (row["TotalCompletedTalks"].ToString() != "") ? data.TotalTalks - data.TotalCompletedTalks : data.TotalTalks;
                                    data.TotalModules = Convert.ToInt32(ds.Tables[1].Rows[i]["TotalModules"].ToString());
                                
                            }
                            else {
                                data.TotalCompletedTalks = 0;
                                data.TotalPendingTalks = 0;
                                data.TotalTalks = 0;
                                data.TotalModules = 0;
                            }                           

                            moduleCountCompleted = 0;
                            moduleCountPending = 0;
                            finalmoduleCountCompleted = 0;
                            data.TotalCompletedModules = 0;

                            if (ds.Tables[2] != null && ds.Tables[2].Rows.Count > i)
                            {

                                if (Convert.ToInt32(ds.Tables[1].Rows[i]["SessionId"].ToString()) == Convert.ToInt32(ds.Tables[2].Rows[i]["SessionId"].ToString()))
                                {
                                    if (ds.Tables[3] != null && ds.Tables[3].Rows.Count > 0)
                                    {

                                        foreach (DataRow row1 in ds.Tables[3].Rows)
                                        {
                                            if (Convert.ToInt32(ds.Tables[2].Rows[i]["ModuleId"].ToString()) == Convert.ToInt32(row1["ModulId"].ToString()))
                                            {
                                                if (row1["isStatus"].ToString() == "1")
                                                {
                                                    moduleCountCompleted++;
                                                }
                                                else
                                                {
                                                    moduleCountPending++;
                                                }

                                                if (Convert.ToInt32(ds.Tables[2].Rows[i]["TotalModuleImage"].ToString()) == moduleCountCompleted)
                                                {
                                                    finalmoduleCountCompleted++;
                                                    data.TotalCompletedModules = finalmoduleCountCompleted;
                                                }

                                                data.TotalPendingModules = (data.TotalCompletedModules != 0 && data.TotalCompletedModules != null) ? data.TotalModules - data.TotalCompletedModules : data.TotalModules;
                                            }

                                        }
                                    }
                                    else
                                    {
                                        data.TotalCompletedModules = 0;
                                        data.TotalPendingModules = data.TotalModules;
                                    }
                                }
                                else
                                {
                                    data.TotalPendingModules = 0;
                                    data.TotalCompletedModules = 0;
                                }
                            }
                            else
                            {
                                data.TotalPendingModules = data.TotalModules;
                                data.TotalCompletedModules = 0;
                                //data.TotalModules = 0;                                
                            }
                            model.Add(data);
                        }
                        i++;
                    }
                }
            }
            catch
            {
                throw;
            }
            return model;
        }

        //set the participate for exam
        public int isParticipate(int userId, string Email, bool part)
        {
            int result = 0;
            try
            {
                result = _dataAccessLayer.UpdateisParticipate(userId, part);

                string support = ConfigurationManager.AppSettings["EmailForRegisterUser"].ToString();
                string isYes = (part) ? "yes" : "no";
                string body = (@"Hello, he/she want to participate the exam " + isYes + "by this is user" + Email);
                SendMail(Email, EmailType.isParticipate, "", body);
                result = 1;
            }
            catch
            {
                throw;
            }
            return result;
        }
    }

    public enum EmailType
    {
        VerifyEmail = 0,
        ForgotPassword = 1,
        ResetPassword = 2,
        ContactUs = 3,
        Otp = 4,
        Registration = 5,
        Comment = 6,
        isParticipate = 7,
        ImageSubmission = 8
    }
}
