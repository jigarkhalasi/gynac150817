using Gynac.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Transactions;
using System.Web;

namespace Gynac
{
    public class DataAccessLayer
    {
        public string CONNECTION_STRING = ConfigurationManager.ConnectionStrings["ConnectionString"].ToString();

        //private string CONNECTION_STRING = "Data Source=RUDRESH-PC;Initial Catalog=Gynac;User ID=Rudresh;Password=rudresh@123;Trusted_Connection=False;";
        //private string CONNECTION_STRING = "Data Source=flax.arvixe.com;Initial Catalog=Gynac;User ID=gynac;Password=gynac@123;Trusted_Connection=False;";
         
        public string SaveUser(User user)
        {
            string result = "0";
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Insert_User", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@Title", user.Title);
                        command.Parameters.AddWithValue("@First_Name", user.First_Name);
                        command.Parameters.AddWithValue("@Middle_Name", user.Middle_Name);
                        command.Parameters.AddWithValue("@Last_Name", user.Last_Name);
                        command.Parameters.AddWithValue("@Email", user.Email);
                        command.Parameters.AddWithValue("@Email_Verified", user.Email_Verified);
                        command.Parameters.AddWithValue("@Mobile", user.Mobile);
                        command.Parameters.AddWithValue("@Password", user.Password);
                        command.Parameters.AddWithValue("@Professional_Specialty", user.Professional_Specialty);
                        command.Parameters.AddWithValue("@Educational_Qualification", user.Educational_Qualification);
                        command.Parameters.AddWithValue("@Street_Address", user.Street_Address);
                        command.Parameters.AddWithValue("@City_Town", user.City_Town);
                        command.Parameters.AddWithValue("@Country", user.Country);
                        command.Parameters.AddWithValue("@Institution_Work_Place", user.Institution_Work_Place);
                        command.Parameters.AddWithValue("@Where_Hear", user.Where_Hear);

                        result = command.ExecuteScalar().ToString();
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return result;
        }

        public DataSet UpdateUser(User user)
        {
            DataSet dsResult = new DataSet();

            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Update_User", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@User_Id", user.User_Id);
                        command.Parameters.AddWithValue("@Title", user.Title);
                        command.Parameters.AddWithValue("@First_Name", user.First_Name);
                        command.Parameters.AddWithValue("@Middle_Name", user.Middle_Name);
                        command.Parameters.AddWithValue("@Last_Name", user.Last_Name);
                        command.Parameters.AddWithValue("@Email", user.Email);
                        command.Parameters.AddWithValue("@Email_Verified", user.Email_Verified);
                        command.Parameters.AddWithValue("@Mobile", user.Mobile);
                        command.Parameters.AddWithValue("@Password", user.Password);
                        command.Parameters.AddWithValue("@Professional_Specialty", user.Professional_Specialty);
                        command.Parameters.AddWithValue("@Educational_Qualification", user.Educational_Qualification);
                        command.Parameters.AddWithValue("@Street_Address", user.Street_Address);
                        command.Parameters.AddWithValue("@City_Town", user.City_Town);
                        command.Parameters.AddWithValue("@Country", user.Country);
                        command.Parameters.AddWithValue("@Institution_Work_Place", user.Institution_Work_Place);
                        command.Parameters.AddWithValue("@Where_Hear", user.Where_Hear);

                        SqlDataAdapter da = new SqlDataAdapter();
                        da.SelectCommand = command;

                        da.Fill(dsResult);
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return dsResult;
        }

        public DataSet VerifyLogin(Login login)
        {
            DataSet dsResult = new DataSet();

            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Verify_User", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@Email", login.Email);
                        command.Parameters.AddWithValue("@Password", login.Password);

                        SqlDataAdapter da = new SqlDataAdapter();
                        da.SelectCommand = command;

                        da.Fill(dsResult);
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return dsResult;
        }

        public DataSet VerifyLoginByGuid(User user)
        {
            DataSet dsResult = new DataSet();

            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Verify_User_By_Guid", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@Guid", user.Guid);

                        SqlDataAdapter da = new SqlDataAdapter();
                        da.SelectCommand = command;

                        da.Fill(dsResult);
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return dsResult;
        }

        //public DataSet SaveUserCourse(List<Course> allCourses, List<User_Course> userCourse)
        public DataSet SaveUserCourse(List<User_Course> userCourse)
        {
            int validityDays = 0;
            DateTime registeredTill;
            DataSet dsResult = new DataSet();
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();

                        SqlCommand command = new SqlCommand("Delete_User_Course", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@User_Id", userCourse[0].User_Id);

                        command.ExecuteNonQuery();

                        foreach (User_Course item in userCourse)
                        {
                            //validityDays = allCourses.Where(x => x.Course_Id == item.Course_Id).FirstOrDefault().Validity_Days;

                            registeredTill = DateTime.UtcNow.AddDays(item.Validity_Days);

                            command = new SqlCommand("Insert_User_Course", con);
                            command.CommandType = CommandType.StoredProcedure;

                            command.Parameters.AddWithValue("@User_Id", item.User_Id);
                            command.Parameters.AddWithValue("@Course_Id", item.Course_Id);
                            command.Parameters.AddWithValue("@Registered_Date", DateTime.UtcNow);
                            command.Parameters.AddWithValue("@Registered_Till", registeredTill);
                            command.Parameters.AddWithValue("@Payment_Mode", item.Payment_Mode);
                            command.Parameters.AddWithValue("@Payment_Amount", item.Payment_Amount);
                            command.Parameters.AddWithValue("@Payment_Currency", item.Payment_Currency);

                            //result = Convert.ToInt32(command.ExecuteScalar());

                            SqlDataAdapter da = new SqlDataAdapter();
                            da.SelectCommand = command;

                            da.Fill(dsResult);
                        }
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return dsResult;
        }

        public DataTable GetAllCourse()
        {
            DataTable dt = new DataTable();
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        dt = new DataTable();
                        con.Open();
                        SqlCommand command = new SqlCommand("Get_All_Course", con);
                        command.CommandType = CommandType.StoredProcedure;
                        SqlDataAdapter dataAdapter = new SqlDataAdapter(command);
                        dataAdapter.Fill(dt);
                    }
                }
            }
            catch
            {
                throw;
            }

            return dt;
        }

        public int EmailVerified(User user)
        {
            int result = 0;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Email_Verified", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@Email", user.Email);
                        command.Parameters.AddWithValue("@Guid", user.Guid);

                        result = Convert.ToInt32(command.ExecuteScalar());
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return result;
        }

        public string ForgotPassword(User user)
        {
            string result = String.Empty;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Forgot_Password", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@Email", user.Email);

                        result = command.ExecuteScalar().ToString();
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return result;
        }

        public string ResetPassword(User user)
        {
            string result = String.Empty;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Reset_Password", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@Email", user.Email);
                        command.Parameters.AddWithValue("@Password", user.Password);
                        command.Parameters.AddWithValue("@Guid", user.Guid);

                        result = command.ExecuteScalar().ToString();
                    }
                    trScope.Complete();
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
            int cost = 0;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Get_Total_Course_Cost", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@Guid", guid);

                        cost = Convert.ToInt32(command.ExecuteScalar());
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return cost;
        }

        public int ActivateUserCourse(string guid, string transactionId, string transactionStatus, string orderStatus)
        {
            int noOfActivatedCourse = 0;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Activate_User_Course", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@Guid", guid);
                        command.Parameters.AddWithValue("@TransactionId", transactionId);
                        command.Parameters.AddWithValue("@TransactionStatus", transactionStatus);
                        command.Parameters.AddWithValue("@OrderStatus", orderStatus);

                        noOfActivatedCourse = Convert.ToInt32(command.ExecuteScalar());
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return noOfActivatedCourse;
        }

        //sign out user update the Islogin value
        public int SignOut(int userId)
        {
            int cost = 0;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Update_SignOut_User", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@User_Id", userId);

                        cost = Convert.ToInt32(command.ExecuteScalar());
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return cost;
        }

        //sign out user update the Islogin value
        public int SignIn(int userId)
        {
            int cost = 0;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Update_SignIn_User", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@User_Id", userId);

                        cost = Convert.ToInt32(command.ExecuteScalar());
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return cost;
        }
        public User GetUser(int userId)
        {
            DataSet dsResult = new DataSet();
            var UserInfo = new User();
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Get_User", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@User_Id", userId);                        

                        SqlDataAdapter da = new SqlDataAdapter();
                        da.SelectCommand = command;

                        da.Fill(dsResult);

                        DataRow drUser = dsResult.Tables[0].Rows[0];

                        UserInfo = new User();
                        UserInfo.User_Id = Int32.Parse(drUser["User_Id"].ToString());
                        UserInfo.Title = drUser["Title"].ToString();
                        UserInfo.First_Name = drUser["First_Name"].ToString();
                        UserInfo.Middle_Name = drUser["Middle_Name"].ToString();
                        UserInfo.Last_Name = drUser["Last_Name"].ToString();
                        UserInfo.Email = drUser["Email"].ToString();
                        UserInfo.Email_Verified = Boolean.Parse(drUser["Email_Verified"].ToString());
                        UserInfo.Mobile = drUser["Mobile"].ToString();
                        UserInfo.Password = drUser["Password"].ToString();
                        UserInfo.Professional_Specialty = drUser["Professional_Specialty"].ToString();
                        UserInfo.Educational_Qualification = drUser["Educational_Qualification"].ToString();
                        UserInfo.Street_Address = drUser["Street_Address"].ToString();
                        UserInfo.City_Town = drUser["City_Town"].ToString();
                        UserInfo.Country = drUser["Country"].ToString();
                        UserInfo.Institution_Work_Place = drUser["Institution_Work_Place"].ToString();
                        UserInfo.Where_Hear = drUser["Where_Hear"].ToString();
                                                                      
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return UserInfo;
        }

        //get the notificartion
        public DataSet GetNotificationByUserId(int userId)
        {
            DataSet dsResult = new DataSet();
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Get_User_Notification", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@User_Id", userId);

                        SqlDataAdapter da = new SqlDataAdapter();
                        da.SelectCommand = command;

                        da.Fill(dsResult);
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return dsResult;
        }

        //update notification
        public int UpdateNotification(int userId)
        {
            int res = 0;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Update_Notification", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@UserId", userId);

                        res = Convert.ToInt32(command.ExecuteScalar());
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return res;
        }

        //get all talks based on userId
        public DataSet GetUserTalk(int userId)
        {
            DataSet dsResult = new DataSet();
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Get_User_Talks", con);
                        command.CommandType = CommandType.StoredProcedure;
                        
                        command.Parameters.AddWithValue("@User_Id", userId);
                        

                        SqlDataAdapter da = new SqlDataAdapter();
                        da.SelectCommand = command;

                        da.Fill(dsResult);
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return dsResult;
        }

        //update the video/exam status
        public int UpdateUserTalksStatus(UpdateUserTalkModel model)
        {
            int res = 0;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Update_UserTalk_Status", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@UserTalkId", model.UserTalkId);
                        command.Parameters.AddWithValue("@IsVideoStatus", model.IsVideoStatus);
                        command.Parameters.AddWithValue("@IsExamlear", model.IsExamlear);

                        res = Convert.ToInt32(command.ExecuteScalar());
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return res;
        }

        //upload the images using usertalkid
        public int UploadModuleImages(UploadModuleImagesModel model)
        {
            int res = 0;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Upload_Module_Image", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@UserModuleImageId", model.UserModuleImageId);
                        command.Parameters.AddWithValue("@ImagePath", model.ImagePath);                        
                        command.Parameters.AddWithValue("@ModuleId", model.ModuleId);
                        command.Parameters.AddWithValue("@ModuleImageId", model.ModuleImageId);
                        command.Parameters.AddWithValue("@UserId", model.UserId);                        

                        res = Convert.ToInt32(command.ExecuteScalar());
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return res;
        }

        //get all talks video
        public DataSet GetTalkVideo(int talkId, int userTalkId)
        {
            DataSet dsResult = new DataSet();
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Get_Talk_Video", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@TalkId", talkId);
                        command.Parameters.AddWithValue("@UserTalkId", userTalkId);

                        SqlDataAdapter da = new SqlDataAdapter();
                        da.SelectCommand = command;

                        da.Fill(dsResult);
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return dsResult;
        }

        //update usertalk video comment
        //UpdateUserTalkCommentModel
        public int UpdateUserTalkComment(UpdateUserTalkCommentModel model)
        {
            int res = 0;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Update_UserTalk_Commet", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@UserTalkId", model.UserTalkId);
                        command.Parameters.AddWithValue("@Comment", model.Comment);                        

                        res = Convert.ToInt32(command.ExecuteScalar());
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return res;
        }

        //update exam clear
        public int UpdateUserTalkExam(int userTalkId)
        {
            int res = 0;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Update_UserTalk_Exam", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@UserTalkId", userTalkId);                        

                        res = Convert.ToInt32(command.ExecuteScalar());
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return res;
        }

        //get all images by module
        public DataSet GetModuleImages(int moduleId, int userId)
        {
            DataSet dsResult = new DataSet();
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Get_User_Images", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@UserId", userId);
                        command.Parameters.AddWithValue("@ModuleId", moduleId);

                        SqlDataAdapter da = new SqlDataAdapter();
                        da.SelectCommand = command;

                        da.Fill(dsResult);
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return dsResult;
        }

        //get all user ratings
        public DataSet GetUserRatings(int userId)
        {
            DataSet dsResult = new DataSet();
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Get_User_Ratings", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@User_Id", userId);

                        SqlDataAdapter da = new SqlDataAdapter();
                        da.SelectCommand = command;

                        da.Fill(dsResult);
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return dsResult;
        }

        //update user ratings
        public int UpdateUserRating(UserRatingsModel model)
        {
            int res = 0;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Update_User_Ratings", con);
                        command.CommandType = CommandType.StoredProcedure;

                        
                        command.Parameters.AddWithValue("@UserRatingId", model.UserRatingId);
                        command.Parameters.AddWithValue("@User_Id", model.UserId);
                        command.Parameters.AddWithValue("@RatingId", model.RatingId);
                        command.Parameters.AddWithValue("@RateMark", model.RateMark);

                        res = Convert.ToInt32(command.ExecuteScalar());
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return res;
        }

        //insert in to bookmark
        public int AddUserBookmark(UserBookmarkModel model)
        {
            int cost = 0;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Insert_User_BookMark", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@User_Id", model.UserId);
                        command.Parameters.AddWithValue("@BookMarkName", model.BookMarkName);
                        command.Parameters.AddWithValue("@BookMarkTime", model.BookMarkTime);
                        command.Parameters.AddWithValue("@TalkId", model.TalkId);

                        cost = Convert.ToInt32(command.ExecuteScalar());
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return cost;
        }

        //get all user bookmarks
        public DataSet GetUserBookmark(int userId, int talkId)
        {
            DataSet dsResult = new DataSet();
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Get_User_BookMark", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@User_Id", userId);
                        command.Parameters.AddWithValue("@TalkId", talkId);

                        SqlDataAdapter da = new SqlDataAdapter();
                        da.SelectCommand = command;

                        da.Fill(dsResult);
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return dsResult;
        }

        //delete get user bookmark
        public int DeleteUserBookmark(int userBookmarkId)
        {
            int cost = 0;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Delete_User_BookMark", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@BookMarkId", userBookmarkId);

                        cost = Convert.ToInt32(command.ExecuteScalar());
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return cost;
        }

        //update ip address
        public int UpdateIpAddress(UserLogModel ipModel)
        {
            int res = 0;
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Update_UserIp", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@User_Id", ipModel.UserId);
                        command.Parameters.AddWithValue("@UserAgent", ipModel.UserAgent);
                        command.Parameters.AddWithValue("@IpAddress", ipModel.UserIpAddress);

                        res = Convert.ToInt32(command.ExecuteScalar());
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return res;
        }

        //get tutorial summary
        public DataSet GetTutorialSummary(int userId)
        {
            DataSet dsResult = new DataSet();
            try
            {
                using (TransactionScope trScope = new TransactionScope())
                {
                    using (SqlConnection con = new SqlConnection(CONNECTION_STRING))
                    {
                        con.Open();
                        SqlCommand command = new SqlCommand("Get_Tutorial_Summary", con);
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@User_Id", userId);

                        SqlDataAdapter da = new SqlDataAdapter();
                        da.SelectCommand = command;

                        da.Fill(dsResult);
                    }
                    trScope.Complete();
                }
            }
            catch
            {
                throw;
            }

            return dsResult;
        }
    }
}