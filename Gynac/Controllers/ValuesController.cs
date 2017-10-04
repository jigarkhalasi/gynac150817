using Gynac.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

using System.Net.Http;

using System.Web;
using System.Web.Http;

namespace Gynac
{
    [RoutePrefix("api/gynac")]
    public class ValuesController : ApiController
    {
        BusinessLayer _businessLayer = new BusinessLayer();

        [Route("saveuser")]
        public int SaveUser(User user)
        {
            int result = 0;
            try
            {
                result = _businessLayer.SaveUser(user);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [Route("updateuser")]
        public VerifiedUser UpdateUser(User user)
        {
            VerifiedUser result = null;
            try
            {
                result = _businessLayer.UpdateUser(user);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [Route("emailverified")]
        public int EmailVerified(User user)
        {
            int result = 0;
            try
            {
                result = _businessLayer.EmailVerified(user);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [Route("verifyloginbyguid")]
        public VerifiedUser VerifyLoginByGuid(User user)
        {
            VerifiedUser result;
            try
            {
                result = _businessLayer.VerifyLoginByGuid(user);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [Route("verifylogin")]
        public VerifiedUser VerifyLogin(Login login)
        {
            VerifiedUser result;
            try
            {
                var ipModel = GetUserLogIp();
                result = _businessLayer.VerifyLogin(login);
                if (result != null)
                {
                    if (!result.IsLogin && result.EmailVerificationPending != true && result.IsTalkExist)
                    {
                        if (result.UserAgent != ipModel.UserAgent && result.IpAddress != ipModel.UserIpAddress && result.UserInfo.User_Id != 45)
                        {
                            var IsSendSms = result.UserInfo.Country.Equals("India", StringComparison.OrdinalIgnoreCase);
                            result.Otp = GenerateOTP(IsSendSms, result.UserInfo.Email, result.UserInfo.Mobile);
                            
                            //set the userip address and user agent
                            ipModel.UserId = result.UserInfo.User_Id;
                            var res = _businessLayer.UpdateIpAddress(ipModel);

                            result.IsAlreadyLoginSameIp = false;
                        }
                        else {
                            result.IsAlreadyLoginSameIp = true;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [Route("forgotpassword")]
        public int ForgotPassword(User user)
        {
            int result = 0;
            try
            {
                result = _businessLayer.ForgotPassword(user);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [Route("resetpassword")]
        public int ResetPassword(User user)
        {
            int result = 0;
            try
            {
                result = _businessLayer.ResetPassword(user);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [HttpGet]
        [Route("getcourses")]
        public List<Course> GetCourses()
        {
            List<Course> result;
            try
            {
                result = _businessLayer.GetCourses();
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [Route("saveusercourse")]
        public VerifiedUser SaveUserCourse(List<User_Course> userCourses)
        {
            VerifiedUser verifiedUser = null;
            try
            {
                verifiedUser = _businessLayer.SaveUserCourse(userCourses);
            }
            catch (Exception ex)
            {
                throw;
            }
            return verifiedUser;
        }

        [Route("sendcontactusemail")]
        public int SendContactUsEmail(ContactUs contactUs)
        {
            int result = 1;
            try
            {
                result = _businessLayer.SendContactUsEmail(contactUs);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //sing out change the flage
        [HttpPost]
        [Route("signout")]
        public int SignOut(int userId)
        {
            int result = 1;
            try
            {
                result = _businessLayer.SignOut(userId);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [HttpPost]
        [Route("signin")]
        public int SignIn(int userId)
        {
            int result = 1;
            try
            {
                result = _businessLayer.SignIn(userId);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [Route("getuser")]
        public User GetUser(int userId)
        {
            User result;
            try
            {
                result = _businessLayer.GetUser(userId);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        //get all notification
        [HttpGet]
        [Route("getnotificationbyuserid")]
        public IEnumerable<NotificationModel> GetNotificationByUserId(int userId)
        {
            var result = new List<NotificationModel>();
            try
            {
                result = _businessLayer.GetNotificationByUserId(userId).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //update the notificartion flage value
        [HttpPost]
        [Route("updatenotification")]
        public int UpdateNotification(int userId)
        {
            int result = 0;
            try
            {
                result = _businessLayer.UpdateNotification(userId);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //get all user talks
        [HttpGet]
        [Route("getusertalks")]
        public IEnumerable<UserTalksModel> GetUserTalk(int userId)
        {
            var result = new List<UserTalksModel>();
            try
            {
                userId = (userId != 0) ? userId : 0;
                result = _businessLayer.GetUserTalk(userId).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //update the usertalks play button value
        [HttpPost]
        [Route("updateusertalkstatus")]
        public int UpdateUserTalksStatus(UpdateUserTalkModel model)
        {
            int result = 0;
            try
            {
                result = _businessLayer.UpdateUserTalksStatus(model);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [Route("uploadmoduleimage")]
        [HttpPost]
        public async Task<IHttpActionResult> UploadImage()
        {
            var httpRequest = HttpContext.Current.Request;
            int result = 0;

            var model = new UploadModuleImagesModel();
            model.UserId = Convert.ToInt32(httpRequest.Form[0]);
            model.ModuleId = Convert.ToInt32(httpRequest.Form[1]);
            model.ModuleImageId = Convert.ToInt32(httpRequest.Form[2]);
            model.UserModuleImageId = Convert.ToInt32(httpRequest.Form[3]);
            model.ModuleName = httpRequest.Form[4];
            model.UserEmail = httpRequest.Form[5];
            model.FacultyId = Convert.ToInt32(httpRequest.Form[6]);

            foreach (string file in httpRequest.Files)
            {
                var postedFile = httpRequest.Files[file];
                if (postedFile != null && postedFile.ContentLength > 0)
                {

                    int MaxContentLength = 1024 * 1024 * 20; //Size = 20 MB  

                    IList<string> AllowedFileExtensions = new List<string> { ".jpg", ".jpeg", ".gif", ".png" };
                    var ext = postedFile.FileName.Substring(postedFile.FileName.LastIndexOf('.'));
                    var extension = ext.ToLower();
                    if (!AllowedFileExtensions.Contains(extension))
                    {
                        throw new Exception("Please upload image of type .jpg, .jpeg, .gif, .png.");
                    }
                    else if (postedFile.ContentLength > MaxContentLength)
                    {
                        throw new Exception("Please upload a file upto 1 mb.");
                    }
                    else
                    {
                        var fileName = Guid.NewGuid().ToString() + extension;
                        var filePath = HttpContext.Current.Server.MapPath("~/Images/" + fileName);
                        postedFile.SaveAs(filePath);

                        model.ImagePath = "/Images/" + fileName;
                        result = _businessLayer.UploadModuleImages(model, fileName);

                        return Ok(result);
                    }
                }

                throw new Exception("Please upload a image.");
            }
            throw new Exception("Please upload a image.");
        }

        //get the user talk video
        [HttpGet]
        [Route("gettalkvideo")]
        public TalkVideoModel GetTalkVideo(int talkId, int userTalkId)
        {
            var result = new TalkVideoModel();
            try
            {
                result = _businessLayer.GetTalkVideo(talkId, userTalkId);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //update the usertalks comment
        [HttpPost]
        [Route("updateusertalkcomment")]
        public int UpdateUserTalksStatus(UpdateUserTalkCommentModel model)
        {
            int result = 0;
            try
            {
                result = _businessLayer.UpdateUserTalkComment(model);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //update the usertalks comment
        [HttpPost]
        [Route("updateusertalkexam")]
        public int UpdateUserTalkExam(int userTalkId, int moduleId, int userId)
        {
            int result = 0;
            try
            {
                result = _businessLayer.UpdateUserTalkExam(userTalkId, moduleId, userId);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //get all user talks
        [HttpGet]
        [Route("getmoduleimages")]
        public IEnumerable<UserModuleImageModel> GetModuleImages(int moduleId, int userId)
        {
            var result = new List<UserModuleImageModel>();
            try
            {
                result = _businessLayer.GetModuleImages(moduleId, userId).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //get all user talks
        [HttpGet]
        [Route("getuserratings")]
        public IEnumerable<UserRatingsModel> GetUserRatings(int userId, int talkId)
        {
            var result = new List<UserRatingsModel>();
            try
            {
                userId = (userId != 0) ? userId : 0;
                result = _businessLayer.GetUserRatings(userId, talkId).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [HttpPost]
        [Route("updateuserratings")]
        public int UpdateUserRating(UserRatingsModel[] model)
        {
            int result = 0;
            try
            {
                for (int i = 0; i < model.Count(); i++)
                {
                    if (model[i].RateMark != 0 && model[i].UserRatingId != 0) {
                        model[i].IsEdit = 0;
                        result = _businessLayer.UpdateUserRating(model[i]);    
                    }
                    else if (model[i].RateMark != 0 && model[i].UserRatingId == 0)
                    {
                        model[i].IsEdit = 1;
                        result = _businessLayer.UpdateUserRating(model[i]);    
                    }
                    
                }
                
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //generate the otp 
        //https://www.aspsnippets.com/Articles/Generate-Unique-Random-OTP-One-Time-Password-in-ASPNet-using-C-and-VBNet.aspx
        //http://www.aspdotnet-suresh.com/2015/08/generate-one-time-password-otp-in-aspnet-using-csharp-vbnet.html
        //[HttpGet]
        //[Route("generateotp")]
        public string GenerateOTP(bool IsSendSms, string Email, string Mobile)
        {
            //declare array string to generate random string with combination of small,capital letters and numbers
            char[] charArr = "0123456789".ToCharArray();
            string strrandom = string.Empty;
            Random objran = new Random();
            int noofcharacters = 5;//Convert.ToInt32(txtCharacters.Text);
            for (int i = 0; i < noofcharacters; i++)
            {
                //It will not allow Repetation of Characters
                int pos = objran.Next(1, charArr.Length);
                if (!strrandom.Contains(charArr.GetValue(pos).ToString()))
                    strrandom += charArr.GetValue(pos);
                else
                    i--;
            }
            //lblResult.Text = strrandom;

            String message = "Welcome to Gynecology Academy. Your OTP for login is: " + strrandom ;//HttpUtility.UrlEncode(otp);
            String smsMessage = "Welcome to Gynecology Academy. Your OTP for login is: " + strrandom;
            if (IsSendSms)
            {
                var res = _businessLayer.sendSMS(strrandom, Mobile, smsMessage);
            }
            var resu = _businessLayer.SendOtpEmail(Email, message);
            //if (res)
            //{
            return strrandom;
            //}
            //else
            //{
            //  return strrandom;
            //}
        }

        //get all user bookmark
        [HttpGet]
        [Route("getuserbookmark")]
        public IEnumerable<UserBookmarkModel> GetUserBookmark(int userId, int talkId)
        {
            var result = new List<UserBookmarkModel>();
            try
            {
                userId = (userId != 0) ? userId : 0;
                result = _businessLayer.GetUserBookmark(userId, talkId).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [HttpPost]
        [Route("adduserbookmark")]
        public int AddUserBookmark(UserBookmarkModel model)
        {
            int result = 0;
            try
            {
                result = _businessLayer.AddUserBookmark(model);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [HttpPost]
        [Route("deleteuserbookmark")]
        public int DeleteUserBookmark(int userBookmarkId)
        {
            int result = 0;
            try
            {
                result = _businessLayer.DeleteUserBookmark(userBookmarkId);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public UserLogModel GetUserLogIp()
        {
            var model = new UserLogModel();
            model.UserIpAddress = HttpContext.Current.Request.UserHostAddress;
            model.UserAgent = HttpContext.Current.Request.UserAgent;
            //var CalledUrl = HttpContext.Current.Request.Url.OriginalString;
            return model;
        }

        //get tutorial summary
        [HttpGet]
        [Route("gettutorialsummary")]
        public IEnumerable<TutorialSummaryModel> GetTutorialSummary(int userId)
        {
            var result = new List<TutorialSummaryModel>();
            try
            {
                result = _businessLayer.GetTutorialSummary(userId).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        //is participate the or not
        [HttpPost]
        [Route("isparticipate")]
        public int iSparticipate(int userId, string userEmail, bool part)
        {
            int result = 0;
            try
            {
                result = _businessLayer.isParticipate(userId, userEmail, part);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
    }
}
