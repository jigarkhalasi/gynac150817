using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Gynac;
using Gynac.Controllers;
using System.Web.Script.Serialization;

namespace Gynac.Tests.Controllers
{
    [TestClass]
    public class ValuesControllerTest
    {
        [TestMethod]
        public void SaveUser()
        {
            // Arrange
            ValuesController controller = new ValuesController();

            User user = new User()
            {
                User_Id = 0,
                Title = "Prof",
                First_Name = "TestFN",
                Middle_Name = "",
                Last_Name = "TestLN",
                Email = "TestFNTestLN@gmail.com",
                Email_Verified = false,
                Mobile = "1234567891",
                Password = "12345678",
                Professional_Specialty = "Proff",
                Educational_Qualification = "Edu",
                Street_Address = "Add",
                City_Town = "Mumbai",
                Country = "India",
                Institution_Work_Place = "work",
                Where_Hear = "Web"
            };

            var jsonuser = new JavaScriptSerializer().Serialize(user);

            // Act
            var result = controller.SaveUser(user);

            // Assert
            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void VerifyEmail()
        {
            // Arrange
            ValuesController controller = new ValuesController();

            User user = new User();

            user.Email = "TestFNTestLN@gmail.com";
            user.Guid = "7E7A14F7-3CAC-43E3-920C-C7FB867C8EED";

            var json = new JavaScriptSerializer().Serialize(user);

            // Act
            var result = controller.EmailVerified(user);

            var resultJson = new JavaScriptSerializer().Serialize(result);

            // Assert
            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void VerifyLogin()
        {
            // Arrange
            ValuesController controller = new ValuesController();

            Login login = new Login();

            login.Email = "TestFNTestLN@gmail.com";
            login.Password = "12345678";

            var json = new JavaScriptSerializer().Serialize(login);

            // Act
            var result = controller.VerifyLogin(login);

            var resultJson = new JavaScriptSerializer().Serialize(result);

            // Assert
            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void ForgotPassword()
        {
            // Arrange
            ValuesController controller = new ValuesController();

            User user = new User();

            user.Email = "TestFNTestLN@gmail.com";

            var json = new JavaScriptSerializer().Serialize(user);

            // Act
            var result = controller.ForgotPassword(user);

            var resultJson = new JavaScriptSerializer().Serialize(result);

            // Assert
            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void ResetPassword()
        {
            // Arrange
            ValuesController controller = new ValuesController();

            User user = new User();

            user.Email = "TestFNTestLN@gmail.com";
            user.Guid = "F9D53FC3-91EC-4411-A953-EAF0E5B13EE2";
            user.Password = "123";

            var json = new JavaScriptSerializer().Serialize(user);

            // Act
            var result = controller.ResetPassword(user);

            var resultJson = new JavaScriptSerializer().Serialize(result);

            // Assert
            Assert.IsNotNull(result);
        }
        
        [TestMethod]
        public void SaveUserCourse()
        {
            // Arrange
            ValuesController controller = new ValuesController();

            List<User_Course> listUserCourse = new List<User_Course>();
            User_Course user_Course = new User_Course() { User_Id = 6, Course_Id = 1 };
            User_Course user_Course1 = new User_Course() { User_Id = 6, Course_Id = 6 };
            //User_Course user_Course2 = new User_Course() { User_Id = 6, Course_Id = 7 };
            //User_Course user_Course3 = new User_Course() { User_Id = 6, Course_Id = 8 };

            listUserCourse.Add(user_Course);
            listUserCourse.Add(user_Course1);
            //listUserCourse.Add(user_Course2);
            //listUserCourse.Add(user_Course3);

            //byte[] imageArray = System.IO.File.ReadAllBytes(@"C:\Users\Public\Pictures\Sample Pictures\Tulips.jpg");
            //string base64ImageRepresentation = Convert.ToBase64String(imageArray);

            var json = new JavaScriptSerializer().Serialize(listUserCourse);

            // Act
            var result = controller.SaveUserCourse(listUserCourse);

            // Assert
            Assert.IsNotNull(result);
        }
    }
}
