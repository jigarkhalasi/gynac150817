using CCA.Util;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Gynac
{
    public partial class Pay : System.Web.UI.Page
    {
        CCACrypto ccaCrypto = new CCACrypto();
        string workingKey = String.Empty;//put in the 32bit alpha numeric key in the quotes provided here 	
        string ccaRequest = "";
        public string strEncRequest = "";
        public string accessCode = String.Empty;// put the access key in the quotes provided here.
        public string lectureURL = string.Empty;
        public string redirectUrl = String.Empty;
        public string cancelUrl = String.Empty;
        public float serviceTax = 0;

        protected void Page_Load(object sender, EventArgs e)
        {
            float cost = 0;
            lectureURL = ConfigurationManager.AppSettings["LectureURL"].ToString();

            if (!IsPostBack)
            {
                if (Request["id"] != null)
                {
                    workingKey = ConfigurationManager.AppSettings["WorkingKey"].ToString();     // "580B9D14C245D159DD3AEF9FBAC35360"
                    accessCode = ConfigurationManager.AppSettings["AccessCode"].ToString();  // "AVBP67DI15CE97PBEC"
                    redirectUrl = ConfigurationManager.AppSettings["CCAvenueRedirectUrl"].ToString();
                    cancelUrl = ConfigurationManager.AppSettings["CCAvenueCancelUrl"].ToString();
                    serviceTax = float.Parse(ConfigurationManager.AppSettings["ServiceTax"].ToString());

                    string guid = Request["id"].ToString();

                    BusinessLayer businessLayer = new BusinessLayer();
                    float costValue = (float)businessLayer.GetTotalCourseCost(guid);

                    if (costValue > 0)
                    {
                        cost = float.Parse(costValue.ToString());
                    }

                    if (cost > 0)
                    {

                        if (serviceTax > 0)
                        {
                            cost = cost + (float)Math.Round(((cost * serviceTax)/100),2);
                        }

                        ccaRequest = ccaRequest + "merchant_id=110743&";
                        ccaRequest = ccaRequest + "order_id=" + guid + "&";
                        ccaRequest = ccaRequest + "amount=" + cost + "&";
                        ccaRequest = ccaRequest + "currency=INR&";
                        ccaRequest = ccaRequest + "access_code=" + accessCode + "&";
                        ccaRequest = ccaRequest + "redirect_url=" + redirectUrl + "&";
                        ccaRequest = ccaRequest + "cancel_url=" + cancelUrl + "&";
                        //ccaRequest = ccaRequest + "order_id=123&";
                        //ccaRequest = ccaRequest + "amount=1.0&";
                        //ccaRequest = ccaRequest + "currency=INR&";
                        //ccaRequest = ccaRequest + "access_code=AVBP67DI15CE97PBEC&";
                        //ccaRequest = ccaRequest + "redirect_url=http://www.gynac.org/ValidatePayment.aspx&";
                        //ccaRequest = ccaRequest + "cancel_url=http://www.gynac.org/WebForm_Failure.aspx&";
                        ccaRequest = ccaRequest + "language=EN&";

                        strEncRequest = ccaCrypto.Encrypt(ccaRequest, workingKey);
                    }
                }
                //else
                //{
                //    Response.Redirect(lectureURL);
                //}
            }            
        }
    }
}