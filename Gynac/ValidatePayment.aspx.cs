using CCA.Util;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Gynac
{
    public partial class ValidatePayment : System.Web.UI.Page
    {
        public string encResponse = String.Empty;
        public string guid = String.Empty;
        public string workingKey = String.Empty;
        public string transaction_Id = String.Empty;
        public string transaction_Status = String.Empty;
        public string order_Status = String.Empty;
        public string success_order_Status = String.Empty;
        public string lectureURL = string.Empty;
        public int noOfActivatedCourse = 0;
        
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                CCACrypto ccaCrypto;
                lectureURL = ConfigurationManager.AppSettings["LectureURL"].ToString();
                
                if (Request.Form["encResp"] != null)
                {
                    ccaCrypto = new CCACrypto();

                    workingKey = ConfigurationManager.AppSettings["WorkingKey"].ToString(); //"580B9D14C245D159DD3AEF9FBAC35360";//put in the 32bit alpha numeric key in the quotes provided here            
                    success_order_Status = ConfigurationManager.AppSettings["SuccessOrderStatus"].ToString();                    

                    //Label3.Text = Request.Form["encResp"].ToString();

                    encResponse = ccaCrypto.Decrypt(Request.Form["encResp"], workingKey);
                    NameValueCollection Params = new NameValueCollection();
                    string[] segments = encResponse.Split('&');
                    foreach (string seg in segments)
                    {
                        string[] parts = seg.Split('=');
                        if (parts.Length > 0)
                        {
                            string Key = parts[0].Trim();
                            string Value = parts[1].Trim();
                            Params.Add(Key, Value);
                        }
                    }

                    string res = string.Empty;

                    for (int i = 0; i < Params.Count; i++)
                    {
                        res += Params.Keys[i] + " = " + Params[i] + "===##===";

                        if (Params.Keys[i].ToString().Trim().ToLower().Equals("order_id"))
                        {
                            //Label3.Text = "Tracking Id: " + Params[i].ToString();
                            guid = Params[i].ToString();
                        }

                        if (Params.Keys[i].ToString().Trim().ToLower().Equals("tracking_id"))
                        {
                            //Label3.Text = "Tracking Id: " + Params[i].ToString();
                            transaction_Id = Params[i].ToString();
                        }

                        if (Params.Keys[i].ToString().Trim().ToLower().Equals("status_message"))
                        {
                            //Label1.Text = "Status Message: " + Params[i].ToString();
                            transaction_Status = Params[i].ToString();
                        }

                        if (Params.Keys[i].ToString().Trim().ToLower().Equals("order_status"))
                        {
                            //Label1.Text = "Status Message: " + Params[i].ToString();
                            order_Status = Params[i].ToString();
                        }
                    }

                    if (!String.IsNullOrWhiteSpace(guid) && !String.IsNullOrWhiteSpace(transaction_Id) && !String.IsNullOrWhiteSpace(transaction_Status) && !String.IsNullOrWhiteSpace(order_Status))
                    {
                        if (order_Status.Trim().ToLower().Equals(success_order_Status.ToLower()))
                        {
                            // Update column Is_Active to true in User_Course
                            BusinessLayer businessLayer = new BusinessLayer();

                            noOfActivatedCourse = businessLayer.ActivateUserCourse(guid, transaction_Id, transaction_Status, order_Status);

                            if (noOfActivatedCourse > 0)
                            {                                
                                lectureURL = lectureURL + "success/" + guid;
                                Response.Redirect(lectureURL,true);                                
                            }                            
                        }
                        else
                        {
                            //lectureURL += "fail" + "/1/guid:" + guid + "###/### transaction_Id:" + transaction_Id + "###/### transaction_Status:" + transaction_Status + "###/### order_Status:" + order_Status;
                            lectureURL = lectureURL + "fail/" + guid;
                            Response.Redirect(lectureURL, true);                                
                        }
                    }
                    else
                    {
                        lectureURL = lectureURL + "fail/" + guid;
                        Response.Redirect(lectureURL, true);                                
                    }
                }
                else
                {
                    lectureURL = lectureURL + "fail/" + guid;
                    Response.Redirect(lectureURL, true);                                
                }
                
            }
            catch (Exception ex)
            {
                lectureURL = lectureURL + "fail/" + guid;
                //Response.Redirect(lectureURL, true);                                
            }
        }
    }
}
