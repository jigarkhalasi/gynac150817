// //> single login (done)
// //singnout :- 
// //> notification code set up (done)
// //> get all the user talks (done)
// //UserTalkId
// //SessionName
// //ModuleName
// //TalkName
// //IsActive
// //> talks update the paly button (done)
// //> talks update the quetion submit (done) but change the if condition in  sql
// //> talks update image upload single image upload functionallity
// //


// USE [gynac]
// GO
// /****** Object:  StoredProcedure [dbo].[Get_User]   Script Date: 02-08-17 9:49:55 PM ******/
// SET ANSI_NULLS ON
// GO
// SET QUOTED_IDENTIFIER ON
// GO
// alter procedure [dbo].[Get_User]
           // @User_Id INT = null           
// AS
	// BEGIN 

	// SELECT	[User_Id]
						// ,[Title]
						// ,[First_Name]
						// ,[Middle_Name]
						// ,[Last_Name]
						// ,[Email]
						// ,[Email_Verified]
						// ,[Mobile]
						// ,[Password]
						// ,[Professional_Specialty]
						// ,[Educational_Qualification]
						// ,[Street_Address]
						// ,[City_Town]
						// ,[Country]
						// ,[Institution_Work_Place]
						// ,[Where_Hear]
						// ,[IsLogin]						
				// FROM	[dbo].[User] 
				// WHERE   User_Id= @User_Id
	
// END

//ALTER TABLE [gynac].[dbo].[UserTalks]
//ADD Comment nvarchar(max) null 

//ALTER TABLE [gynac].[dbo].[UserTalks]
//ADD Duration nvarchar(20) null 


//ALTER TABLE [gynac].[dbo].[Faculty]
//ADD ProfilePic nvarchar(max) null 

//ALTER TABLE [gynac].[dbo].[Faculty]
//ADD Email nvarchar(100) null 

//ALTER TABLE [gynac].[dbo].[User]
//ADD IsLogin int null 



//image path settings
//video link set up