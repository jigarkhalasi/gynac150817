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

//user table also set isparticipate
//ALTER TABLE ModuleMaster
//ADD ModuleDesc nvarchar(max) NULL

//ALTER TABLE UserModuleImage
//ADD IsModuleClear int NULL
//CONSTRAINT isModule_clear DEFAULT 0

//--update UserModuleImage set IsModuleClear=0 where userid=45

//ALTER TABLE Usertalks
//ADD ModuleId int NULL
//CONSTRAINT isModule_Id DEFAULT 0

//ALTER TABLE Usertalks
//ADD IsModuleClear int NULL
//CONSTRAINT isModuleuser_clear DEFAULT 0

//====================19/09/2017
//ALTER TABLE [gynac].[dbo].[User]
//ADD StartDate datetime null 

//ALTER TABLE [gynac].[dbo].[User]
//ADD EndDate datetime null 

//select * from [user]
//2017-09-19 22:40:10.107

//update [user] set StartDate = '2017-09-19 22:40:10.107' , EndDate = '2017-12-19 22:40:10.107' where user_id=45
