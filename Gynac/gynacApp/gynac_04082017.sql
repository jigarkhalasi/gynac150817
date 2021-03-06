USE [master]
GO
/****** Object:  Database [gynac]    Script Date: 8/4/2017 2:32:33 PM ******/
CREATE DATABASE [gynac]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'gynac', FILENAME = N'C:\Program Files (x86)\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\DATA\gynac.mdf' , SIZE = 3072KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'gynac_log', FILENAME = N'C:\Program Files (x86)\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\DATA\gynac_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [gynac] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [gynac].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [gynac] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [gynac] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [gynac] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [gynac] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [gynac] SET ARITHABORT OFF 
GO
ALTER DATABASE [gynac] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [gynac] SET AUTO_CREATE_STATISTICS ON 
GO
ALTER DATABASE [gynac] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [gynac] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [gynac] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [gynac] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [gynac] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [gynac] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [gynac] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [gynac] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [gynac] SET  DISABLE_BROKER 
GO
ALTER DATABASE [gynac] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [gynac] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [gynac] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [gynac] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [gynac] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [gynac] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [gynac] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [gynac] SET RECOVERY FULL 
GO
ALTER DATABASE [gynac] SET  MULTI_USER 
GO
ALTER DATABASE [gynac] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [gynac] SET DB_CHAINING OFF 
GO
ALTER DATABASE [gynac] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [gynac] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
USE [gynac]
GO
/****** Object:  Schema [gynac]    Script Date: 8/4/2017 2:32:33 PM ******/
CREATE SCHEMA [gynac]
GO
/****** Object:  StoredProcedure [dbo].[Activate_User_Course]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Activate_User_Course] 
			@Guid varchar(100) = null
			,@TransactionId varchar(100) = null
			,@TransactionStatus varchar(150) = null
			,@OrderStatus varchar(50) = null
AS
BEGIN 
	
	DECLARE @noOfActivatedCourse int
	SET @noOfActivatedCourse = 0

	IF EXISTS (SELECT * FROM [User] WHERE [Guid] = @Guid)
	BEGIN
		SELECT		@noOfActivatedCourse = COUNT(*)
		FROM		Course as C
		INNER JOIN	[User_Course] as UC
			ON		UC.Course_Id = C.Course_Id
		INNER JOIN	[User] as U
			ON		U.[User_Id] = UC.[User_Id]
			WHERE	U.[Guid] = @Guid
			AND		UC.Registered_Till IS NULL	

		UPDATE		UC
		SET			UC.Is_Active = 1,
					UC.Registered_Till = GETDATE() + C.Validity_Days,
					UC.Transaction_Id = @TransactionId,
					UC.Transaction_Status = @TransactionStatus,
					UC.Order_Status = @OrderStatus
		FROM		Course as C
		INNER JOIN	[User_Course] as UC
			ON		UC.Course_Id = C.Course_Id
		INNER JOIN	[User] as U
			ON		U.[User_Id] = UC.[User_Id]
			WHERE	U.[Guid] = @Guid
			AND		UC.Registered_Till IS NULL		
		
		--UPDATE	[User]
		--SET		Transaction_Id = @TransactionId,
		--		Transaction_Status = @TransactionStatus,
		--		Order_Status = @OrderStatus
		--WHERE	[Guid] = @Guid
			
		--SELECT		@noOfActivatedCourse = COUNT(*)
		--FROM		User_Course as UC				
		--INNER JOIN	[User] as U
		--	ON		UC.[User_Id] = U.[User_Id]
		--	WHERE	U.[Guid] = @Guid

	END

	SELECT @noOfActivatedCourse
END 




GO
/****** Object:  StoredProcedure [dbo].[Delete_User_Course]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Delete_User_Course]
			@User_Id int = null           
AS
BEGIN 
	DELETE FROM User_Course WHERE User_Id = @User_Id AND Is_Active = 0
	--DECLARE @dummy as INT
	--SET @dummy = 1
END 



GO
/****** Object:  StoredProcedure [dbo].[Email_Verified]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Email_Verified] 
			@Guid varchar(100) = null
           ,@Email varchar(100) = null           
AS
BEGIN 
	UPDATE	[dbo].[User]
	SET		Email_Verified = 1
	WHERE	Email = @Email 
	AND		Guid = @Guid

	SELECT	COUNT(*) 
	FROM	[dbo].[User] 
	WHERE	Email = @Email 
	AND		Guid = @Guid
	AND		Email_Verified = 1

END 




GO
/****** Object:  StoredProcedure [dbo].[Forgot_Password]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Forgot_Password]
           @Email varchar(100) = null           
AS
BEGIN 
	IF NOT EXISTS (SELECT * FROM [dbo].[User] WHERE Email = @Email)
		BEGIN
			SELECT 0
		END
	ELSE
		BEGIN
			DECLARE @id uniqueidentifier			
			SET @id = NEWID()

			UPDATE	[dbo].[User]
			SET		[Guid] = @id
			WHERE	Email = @Email 

			SELECT @id
		END
END 




GO
/****** Object:  StoredProcedure [dbo].[Get_All_Course]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Get_All_Course]			
AS
	BEGIN 

	SELECT [Course_Id]
		  ,[Faculty_Id]
		  ,[Course_Image]
		  ,[Name]
		  ,[Description]
		  ,[Fees]
		  ,[Currency]
		  ,[Validity_Days]		  
	  FROM [dbo].[Course]
	END 




GO
/****** Object:  StoredProcedure [dbo].[Get_Talk_Video]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Get_Talk_Video]
           @TalkId INT = 0
AS
	BEGIN 	
		select t.*,f.Title +'. '+  f.Name as FacultyName from TalkMaster t
		inner join Faculty f on f.Faculty_Id= t.FacultyId
		where id=@TalkId
END
--exec [dbo].[Get_Talk_Video]






GO
/****** Object:  StoredProcedure [dbo].[Get_Total_Course_Cost]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Get_Total_Course_Cost] 
			@Guid varchar(100) = null
AS
BEGIN 
	
	DECLARE @cost int
	SET @cost = 0

	IF EXISTS (SELECT * FROM [User] WHERE [Guid] = @Guid)
	BEGIN
		
		SELECT		@cost = SUM(C.Fees)
		FROM		Course as C
		INNER JOIN	[User_Course] as UC
			ON		UC.Course_Id = C.Course_Id
		INNER JOIN	[User] as U
			ON		U.[User_Id] = UC.[User_Id]
			WHERE	U.[Guid] = @Guid
			AND		UC.Is_Active = 0				
	END

	SELECT @cost
END 



GO
/****** Object:  StoredProcedure [dbo].[Get_User_Notification]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Get_User_Notification]
           @User_Id INT = 0
AS
	BEGIN 	
		select n.Id as NotificationId, n.Comment, n.IsRead  from [Notification] n where n.UserId = @User_Id
END



GO
/****** Object:  StoredProcedure [dbo].[Get_User_Talks]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Get_User_Talks]
           @User_Id INT = 0
AS
	BEGIN 	
		--select n.Id as NotificationId, n.Comment, n.IsRead  from [Notification] n where n.UserId = @User_Id
		select u.Id as UserTalkId, s.Name as SessionName, m.Name as ModuleName, t.Name as TalkName, u.IsActive  from UserTalks u
		inner join TalkMaster t on t.Id = u.TalkId
		inner join ModuleMaster m on m.Id = t.ModulId
		inner join SessionMaster s on s.Id = m.SessionId
		where UserId = 45
END
GO
/****** Object:  StoredProcedure [dbo].[Insert_User]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Insert_User]
			@Title varchar(10) = null
           ,@First_Name varchar(50) = null
           ,@Middle_Name  varchar(50) = null
           ,@Last_Name varchar(50) = null
           ,@Email varchar(100) = null
           ,@Email_Verified BIT = null
           ,@Mobile varchar(15) = null
           ,@Password varchar(50) = null
           ,@Professional_Specialty varchar(50) = null
           ,@Educational_Qualification varchar(50) = null
           ,@Street_Address varchar(100) = null
           ,@City_Town varchar(50) = null
           ,@Country varchar(50) = null
           ,@Institution_Work_Place varchar(50) = null
           ,@Where_Hear varchar(50) = null
AS
	BEGIN 

	IF EXISTS (SELECT * FROM [dbo].[User] WHERE Email = @Email)
		BEGIN
			SELECT 2
		END
	ELSE
		BEGIN
			DECLARE @id uniqueidentifier			
			SET @id = NEWID()

			INSERT INTO [dbo].[User]
						([Title]
						,[First_Name]
						,[Middle_Name]
						,[Last_Name]
						,[Email]
						,[Email_Verified]
						,[Mobile]
						,[Password]
						,[Professional_Specialty]
						,[Educational_Qualification]
						,[Street_Address]
						,[City_Town]
						,[Country]
						,[Institution_Work_Place]
						,[Where_Hear]
						,[Guid])
					VALUES
						(@Title
						,@First_Name 
						,@Middle_Name
						,@Last_Name
						,@Email
						,@Email_Verified
						,@Mobile
						,@Password
						,@Professional_Specialty
						,@Educational_Qualification
						,@Street_Address
						,@City_Town
						,@Country
						,@Institution_Work_Place
						,@Where_Hear
						,@id)

				SELECT @id
		END
	END 




GO
/****** Object:  StoredProcedure [dbo].[Insert_User_Course]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Insert_User_Course]
			@User_Id int = null
           ,@Course_Id int = null
           ,@Registered_Date datetime = null
           ,@Registered_Till datetime = null
           ,@Payment_Mode varchar(100) = null
           ,@Payment_Amount decimal(10,5) = null
           ,@Payment_Currency varchar(50) = null
AS
	BEGIN

		DECLARE @InsertFlag AS BIT
		SET @InsertFlag = 0 

		IF EXISTS (SELECT * FROM User_Course WHERE User_Id = @User_Id AND Course_Id = @Course_Id AND Registered_Till IS NOT NULL)
			BEGIN
				IF EXISTS (SELECT * FROM User_Course WHERE User_Id = @User_Id AND Course_Id = @Course_Id AND Registered_Till < GETDATE())
					BEGIN
						SET @InsertFlag = 1						
					END
			END
		ELSE IF NOT EXISTS (SELECT * FROM User_Course WHERE User_Id = @User_Id AND Course_Id = @Course_Id)
			BEGIN 
				SET @InsertFlag = 1				
			END
		IF @InsertFlag = 1
		BEGIN
			INSERT INTO [dbo].[User_Course]
								   ([User_Id]
								   ,[Course_Id]
								   ,[Registered_Date]
								   --,[Registered_Till]
								   ,[Payment_Mode]
								   ,[Payment_Amount]
								   ,[Payment_Currency]
								   )
							 VALUES
								   (@User_Id
								   ,@Course_Id
								   ,@Registered_Date
								   --,@Registered_Till
								   ,@Payment_Mode
								   ,@Payment_Amount
								   ,@Payment_Currency
								   )
		END

		SELECT	[User_Id]
				,[Title]
				,[First_Name]
				,[Middle_Name]
				,[Last_Name]
				,[Email]
				,[Email_Verified]
				,[Mobile]
				,[Password]
				,[Professional_Specialty]
				,[Educational_Qualification]
				,[Street_Address]
				,[City_Town]
				,[Country]
				,[Institution_Work_Place]
				,[Where_Hear]
		FROM	[dbo].[User] 
		WHERE	User_Id = @User_Id

		DECLARE @guidVal uniqueidentifier			
		SET @guidVal = NEWID()

		DECLARE @guid varchar(30)			

		SELECT @guid = SUBSTRING(convert(nvarchar(50), @guidVal), 0,30)

		UPDATE	[dbo].[User]
		SET		[Guid] = @guid
		WHERE	[User_Id] = @User_Id 		

		-- Pending User Course
		--SELECT	[User_Course_Id]
		--		,[User_Id]
		--		,[Course_Id]
		--		,[Registered_Date]
		--		,[Registered_Till]
		--		,[Payment_Mode]
		--		,[Payment_Amount]
		--		,[Payment_Currency]
		--FROM	[dbo].[User_Course]
		--WHERE	User_Id = @User_Id
		--AND		[Payment_Pending] = 1

		-- Active User Course
		SELECT	[User_Course_Id]
				,[User_Id]
				,[Course_Id]
				,[Registered_Date]
				,[Registered_Till]
				,[Payment_Mode]
				,[Payment_Amount]
				,[Payment_Currency]
		FROM	[dbo].[User_Course]
		WHERE	User_Id = @User_Id
		AND		[Registered_Till] > GETDATE()

		-- Expired User Course
		SELECT	[User_Course_Id]
				,[User_Id]
				,[Course_Id]
				,[Registered_Date]
				,[Registered_Till]
				,[Payment_Mode]
				,[Payment_Amount]
				,[Payment_Currency]
		FROM	[dbo].[User_Course]
		WHERE	User_Id = @User_Id
		AND		[Registered_Till] < GETDATE()

		-- GUID for payment work
		select @guid as GUID
	END 





GO
/****** Object:  StoredProcedure [dbo].[Reset_Password]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Reset_Password]
           @Email varchar(100) = null     
		  ,@Password varchar(50) = null      
		  ,@Guid varchar(100) = null
AS
BEGIN 
	IF NOT EXISTS (SELECT * FROM [dbo].[User] WHERE Email = @Email AND [Guid] = @Guid)
		BEGIN
			SELECT 0
		END
	ELSE
		BEGIN
			UPDATE	[dbo].[User]
			SET		Password = @Password
			WHERE	Email = @Email 
			AND		[Guid] = @Guid

			SELECT count(*) FROM [dbo].[User] WHERE Email = @Email AND [Guid] = @Guid
		END
END 




GO
/****** Object:  StoredProcedure [dbo].[Update_Notification]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Update_Notification]
			@NotificationId int = null
AS
	BEGIN 	
			UPDATE	[dbo].[Notification]
			SET IsRead = 1
			WHERE	Id = @NotificationId		
	END 




GO
/****** Object:  StoredProcedure [dbo].[Update_SignOut_User]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Update_SignOut_User]
			@User_Id int = null
AS
	BEGIN 	
			UPDATE	[dbo].[User]
			SET IsLogin = 0
			WHERE User_Id = @User_Id
	END 




GO
/****** Object:  StoredProcedure [dbo].[Update_User]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Update_User]
			@User_Id int = null
		   ,@Title varchar(10) = null
           ,@First_Name varchar(50) = null
           ,@Middle_Name  varchar(50) = null
           ,@Last_Name varchar(50) = null
           ,@Email varchar(100) = null
           ,@Email_Verified BIT = null
           ,@Mobile varchar(15) = null
           ,@Password varchar(50) = null
           ,@Professional_Specialty varchar(50) = null
           ,@Educational_Qualification varchar(50) = null
           ,@Street_Address varchar(100) = null
           ,@City_Town varchar(50) = null
           ,@Country varchar(50) = null
           ,@Institution_Work_Place varchar(50) = null
           ,@Where_Hear varchar(50) = null
AS
	BEGIN 

	IF NOT EXISTS (SELECT * FROM [dbo].[User] WHERE User_Id = @User_Id)
		BEGIN
			SELECT 2
		END
	ELSE
		BEGIN			
			UPDATE	[dbo].[User]
			SET		[Title] = @Title
					,[First_Name] = @First_Name
					,[Middle_Name] = @Middle_Name
					,[Last_Name] = @Last_Name
					,[Email] = @Email
					,[Email_Verified] = @Email_Verified
					,[Mobile] = @Mobile
					,[Password] = @Password
					,[Professional_Specialty] = @Professional_Specialty
					,[Educational_Qualification] = @Educational_Qualification
					,[Street_Address] = @Street_Address
					,[City_Town] = @City_Town
					,[Country] = @Country
					,[Institution_Work_Place] = @Institution_Work_Place
					,[Where_Hear] = @Where_Hear
			WHERE	User_Id = @User_Id

			SELECT	[User_Id]
						,[Title]
						,[First_Name]
						,[Middle_Name]
						,[Last_Name]
						,[Email]
						,[Email_Verified]
						,[Mobile]
						,[Password]
						,[Professional_Specialty]
						,[Educational_Qualification]
						,[Street_Address]
						,[City_Town]
						,[Country]
						,[Institution_Work_Place]
						,[Where_Hear]
				FROM	[dbo].[User] 
				WHERE	Email = @Email AND Password = @Password AND Email_Verified = 1

				---- Pending User Course
				--SELECT	[User_Course_Id]
				--		,[User_Id]
				--		,[Course_Id]
				--		,[Registered_Date]
				--		,[Registered_Till]
				--		,[Payment_Mode]
				--		,[Payment_Amount]
				--		,[Payment_Currency]
				--		,[Payment_Pending]
				--FROM	[dbo].[User_Course]
				--WHERE	User_Id = @User_Id
				--AND		[Payment_Pending] = 1

				-- Active User Course
				SELECT	[User_Course_Id]
						,[User_Id]
						,[Course_Id]
						,[Registered_Date]
						,[Registered_Till]
						,[Payment_Mode]
						,[Payment_Amount]
						,[Payment_Currency]
				FROM	[dbo].[User_Course]
				WHERE	User_Id = @User_Id
				AND		Is_Active = 1
				AND		[Registered_Till] > GETDATE()

				-- Expired User Course
				SELECT	[User_Course_Id]
						,[User_Id]
						,[Course_Id]
						,[Registered_Date]
						,[Registered_Till]
						,[Payment_Mode]
						,[Payment_Amount]
						,[Payment_Currency]
				FROM	[dbo].[User_Course]
				WHERE	User_Id = @User_Id
				AND		Is_Active = 1
				AND		[Registered_Till] < GETDATE()
			
		END
	END 




GO
/****** Object:  StoredProcedure [dbo].[Update_User_Email_Verification]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Update_User_Email_Verification]
			@User_Id int = null
           ,@Email varchar(100) = null           
AS
	BEGIN 
	UPDATE	[User]
	SET		Email_Verified = 1
	WHERE	Email = @Email 
	AND		User_Id = @User_Id
	END 




GO
/****** Object:  StoredProcedure [dbo].[Update_User_Talk]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Update_User_Talk]
			@User_TalkId int = 45
AS
	BEGIN 	
			UPDATE	[dbo].[UserTalks]
			SET IsActive = 1
			WHERE	Id = @User_TalkId
END 
--exec [dbo].[Update_User_Talk]




GO
/****** Object:  StoredProcedure [dbo].[Update_UserTalk_Commet]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Update_UserTalk_Commet]
			@UserTalkId int = null,
			@Comment nvarchar(max) = null
AS
	BEGIN 	
			UPDATE	[dbo].[UserTalks]
			SET Comment = @Comment
			WHERE	Id = @UserTalkId
END 




GO
/****** Object:  StoredProcedure [dbo].[Update_UserTalk_Status]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Update_UserTalk_Status]
			@UserTalkId int = null,
			@IsVideoStatus bit = null,
			@IsExamlear bit = null

AS
	BEGIN 				
			UPDATE	[dbo].[UserTalks]
			SET IsVideoStatus = 1
			WHERE	Id = @UserTalkId
	END 




GO
/****** Object:  StoredProcedure [dbo].[Upload_Module_Image]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Upload_Module_Image]
			@UserModuleImageId int = 0,			
			@ImagePath nvarchar(max) = null,
			@IsStatus int = null,
			@ModuleId int = null,
			@ModuleImageId int=null,	
			@UserId int = null,
			@FacultyId int=null		
			
AS
	BEGIN 	
			if(@UserModuleImageId = 0)
			begin
			insert into UserModuleImage(ImagePath,IsStatus,ModulId,ModuleImageId,UserId,Faculty_Id) values
			(@ImagePath, @IsStatus, @ModuleId, @ModuleImageId, @UserId, @FacultyId)
			end
			else
			begin
				-- end
				update UserModuleImage
				set ImagePath = @ImagePath , IsStatus = @IsStatus
				where Id = @UserModuleImageId

			end
			
END 




GO
/****** Object:  StoredProcedure [dbo].[Verify_User]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Verify_User]
           @Email varchar(100) = null
           ,@Password varchar(50) = null
AS
	BEGIN 
	DECLARE @User_Id INT = 0

	IF EXISTS(SELECT User_Id FROM [dbo].[User] WHERE Email = @Email AND Password = @Password AND Email_Verified = 0)
		BEGIN
			SELECT 1
		END 
	ELSE IF EXISTS (SELECT User_Id FROM [dbo].[User] WHERE Email = @Email AND Password = @Password AND Email_Verified = 1)
		BEGIN
				SELECT @User_Id = User_Id FROM [dbo].[User] WHERE Email = @Email AND Password = @Password AND Email_Verified = 1 and User_Id = 0
				SELECT	[User_Id]
						,[Title]
						,[First_Name]
						,[Middle_Name]
						,[Last_Name]
						,[Email]
						,[Email_Verified]
						,[Mobile]
						,[Password]
						,[Professional_Specialty]
						,[Educational_Qualification]
						,[Street_Address]
						,[City_Town]
						,[Country]
						,[Institution_Work_Place]
						,[Where_Hear]
				FROM	[dbo].[User] 
				WHERE	Email = @Email AND Password = @Password AND Email_Verified = 1

				---- Pending User Course
				--SELECT	[User_Course_Id]
				--		,[User_Id]
				--		,[Course_Id]
				--		,[Registered_Date]
				--		,[Registered_Till]
				--		,[Payment_Mode]
				--		,[Payment_Amount]
				--		,[Payment_Currency]
				--		,[Payment_Pending]
				--FROM	[dbo].[User_Course]
				--WHERE	User_Id = @User_Id
				--AND		[Payment_Pending] = 1

				-- Active User Course
				SELECT	[User_Course_Id]
						,[User_Id]
						,[Course_Id]
						,[Registered_Date]
						,[Registered_Till]
						,[Payment_Mode]
						,[Payment_Amount]
						,[Payment_Currency]
				FROM	[dbo].[User_Course]
				WHERE	User_Id = @User_Id
				AND		Is_Active = 1
				AND		[Registered_Till] > GETDATE()

				-- Expired User Course
				SELECT	[User_Course_Id]
						,[User_Id]
						,[Course_Id]
						,[Registered_Date]
						,[Registered_Till]
						,[Payment_Mode]
						,[Payment_Amount]
						,[Payment_Currency]
				FROM	[dbo].[User_Course]
				WHERE	User_Id = @User_Id
				AND		Is_Active = 1
				AND		[Registered_Till] < GETDATE()

				UPDATE	[dbo].[User] SET IsLogin = 1 WHERE User_Id = @User_Id
				
		END
	--ELSE
	--	SELECT 0		
	END



GO
/****** Object:  StoredProcedure [dbo].[Verify_User_By_Guid]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Verify_User_By_Guid]
           @Guid varchar(100) = null
AS
	BEGIN 
	DECLARE @User_Id INT = 0

	IF EXISTS (SELECT [User_Id] FROM [dbo].[User] WHERE [Guid] = @Guid AND Email_Verified = 1)
		BEGIN
				SELECT @User_Id = [User_Id] FROM [dbo].[User] WHERE [Guid] = @Guid AND Email_Verified = 1
				SELECT	[User_Id]
						,[Title]
						,[First_Name]
						,[Middle_Name]
						,[Last_Name]
						,[Email]
						,[Email_Verified]
						,[Mobile]
						,[Password]
						,[Professional_Specialty]
						,[Educational_Qualification]
						,[Street_Address]
						,[City_Town]
						,[Country]
						,[Institution_Work_Place]
						,[Where_Hear]
				FROM	[dbo].[User] 
				WHERE	[User_Id] = @User_Id AND Email_Verified = 1

				---- Pending User Course
				--SELECT	[User_Course_Id]
				--		,[User_Id]
				--		,[Course_Id]
				--		,[Registered_Date]
				--		,[Registered_Till]
				--		,[Payment_Mode]
				--		,[Payment_Amount]
				--		,[Payment_Currency]
				--		,[Payment_Pending]
				--FROM	[dbo].[User_Course]
				--WHERE	User_Id = @User_Id
				--AND		[Payment_Pending] = 1

				-- Active User Course
				SELECT	[User_Course_Id]
						,[User_Id]
						,[Course_Id]
						,[Registered_Date]
						,[Registered_Till]
						,[Payment_Mode]
						,[Payment_Amount]
						,[Payment_Currency]
				FROM	[dbo].[User_Course]
				WHERE	[User_Id] = @User_Id
				AND		[Is_Active] = 1
				AND		[Registered_Till] > GETDATE()

				-- Expired User Course
				SELECT	[User_Course_Id]
						,[User_Id]
						,[Course_Id]
						,[Registered_Date]
						,[Registered_Till]
						,[Payment_Mode]
						,[Payment_Amount]
						,[Payment_Currency]
				FROM	[dbo].[User_Course]
				WHERE	[User_Id] = @User_Id
				AND		[Is_Active] = 1
				AND		[Registered_Till] < GETDATE()
				
		END
	--ELSE
	--	SELECT 0		
	END




GO
/****** Object:  Table [dbo].[AspNetRoles]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoles](
	[Id] [nvarchar](128) NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserClaims]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserLogins]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserLogins](
	[LoginProvider] [nvarchar](128) NOT NULL,
	[ProviderKey] [nvarchar](128) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserRoles]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserRoles](
	[UserId] [nvarchar](128) NOT NULL,
	[RoleId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUsers]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUsers](
	[Id] [nvarchar](128) NOT NULL,
	[Email] [nvarchar](256) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[LockoutEndDateUtc] [datetime] NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
	[UserName] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Course]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Course](
	[Course_Id] [int] IDENTITY(1,1) NOT NULL,
	[Faculty_Id] [int] NOT NULL,
	[Course_Image] [varchar](max) NULL,
	[Name] [varchar](100) NOT NULL,
	[Description] [varchar](500) NOT NULL,
	[Fees] [int] NOT NULL,
	[Currency] [varchar](20) NOT NULL,
	[Validity_Days] [int] NOT NULL,
	[Insert_Date] [datetime] NOT NULL,
	[Update_Date] [datetime] NOT NULL,
 CONSTRAINT [PK_Course] PRIMARY KEY CLUSTERED 
(
	[Course_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Faculty]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Faculty](
	[Faculty_Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [varchar](10) NULL,
	[Name] [varchar](100) NOT NULL,
	[Image] [varchar](max) NOT NULL,
	[Profile_Summary] [varchar](500) NOT NULL,
	[Insert_Date] [datetime] NOT NULL,
	[Update_Date] [datetime] NOT NULL,
 CONSTRAINT [PK_Faculty] PRIMARY KEY CLUSTERED 
(
	[Faculty_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[ModuleImage]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ModuleImage](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SampleImage] [nvarchar](1000) NULL,
	[Description] [nvarchar](max) NULL,
	[ModulId] [int] NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
 CONSTRAINT [PK__ModuleIm__3214EC07A8DB72F3] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ModuleMaster]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ModuleMaster](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[SessionId] [int] NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
	[FacultyId] [int] NULL,
 CONSTRAINT [PK__ModuleMa__3214EC07616223A7] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Notification]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Notification](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Comment] [nvarchar](max) NOT NULL,
	[IsRead] [int] NULL,
	[FacultyId] [int] NULL,
	[UserId] [int] NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
 CONSTRAINT [PK__Notifica__3214EC0733304CA7] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[QuestionMaster]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuestionMaster](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Question] [nvarchar](200) NOT NULL,
	[Ans] [nvarchar](max) NULL,
	[ImagePath] [nvarchar](max) NULL,
	[TalkId] [int] NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
 CONSTRAINT [PK__Question__3214EC07C905EC38] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[QuetionOptionMaster]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuetionOptionMaster](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[QueOption] [nvarchar](max) NOT NULL,
	[QueId] [int] NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
 CONSTRAINT [PK__QuetionO__3214EC075BC4B7E3] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[SessionMaster]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SessionMaster](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
 CONSTRAINT [PK__SessionM__3214EC07FC87B2A3] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[TalkMaster]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TalkMaster](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[VideoLink] [nvarchar](max) NULL,
	[FacultyId] [int] NULL,
	[ModulId] [int] NULL,
	[SessionId] [int] NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
 CONSTRAINT [PK__TalkMast__3214EC07A2390EC2] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[User]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[User](
	[User_Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [varchar](10) NOT NULL,
	[First_Name] [varchar](50) NOT NULL,
	[Middle_Name] [varchar](50) NULL,
	[Last_Name] [varchar](50) NOT NULL,
	[Email] [varchar](100) NOT NULL,
	[Email_Verified] [bit] NOT NULL,
	[Mobile] [varchar](15) NOT NULL,
	[Password] [varchar](50) NOT NULL,
	[Professional_Specialty] [varchar](50) NOT NULL,
	[Educational_Qualification] [varchar](50) NULL,
	[Street_Address] [varchar](100) NULL,
	[City_Town] [varchar](50) NOT NULL,
	[Country] [varchar](50) NOT NULL,
	[Institution_Work_Place] [varchar](50) NOT NULL,
	[Where_Hear] [varchar](50) NULL,
	[Guid] [varchar](50) NULL,
	[Transaction_Id] [varchar](100) NULL,
	[Transaction_Status] [varchar](150) NULL,
	[Order_Status] [varchar](50) NULL,
	[Comment] [nvarchar](max) NULL,
	[IsLogin] [bit] NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[User_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[User_Course]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[User_Course](
	[User_Course_Id] [int] IDENTITY(1,1) NOT NULL,
	[User_Id] [int] NOT NULL,
	[Course_Id] [int] NOT NULL,
	[Registered_Date] [datetime] NOT NULL,
	[Registered_Till] [datetime] NULL,
	[Payment_Mode] [varchar](100) NULL,
	[Payment_Amount] [decimal](10, 5) NULL,
	[Payment_Currency] [varchar](50) NULL,
	[Is_Active] [bit] NOT NULL,
	[Transaction_Id] [varchar](100) NULL,
	[Transaction_Status] [varchar](150) NULL,
	[Order_Status] [varchar](50) NULL,
 CONSTRAINT [PK_User_Course] PRIMARY KEY CLUSTERED 
(
	[User_Course_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[UserAnswer]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserAnswer](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[IsValid] [int] NULL,
	[QueOptionId] [int] NULL,
	[QueId] [int] NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
 CONSTRAINT [PK__UserAnsw__3214EC076BD83C27] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[UserModuleImage]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserModuleImage](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ImagePath] [nvarchar](max) NULL,
	[IsStatus] [int] NULL,
	[Comment] [nvarchar](max) NULL,
	[ModulId] [int] NULL,
	[ModuleImageId] [int] NULL,
	[UserId] [int] NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
	[Faculty_Id] [int] NULL,
 CONSTRAINT [PK__UserModu__3214EC07D81B5431] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[UserTalks]    Script Date: 8/4/2017 2:32:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserTalks](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Enddate] [datetime] NULL,
	[IsActive] [int] NULL,
	[IsVideoStatus] [int] NULL,
	[IsExamlear] [int] NULL,
	[TalkId] [int] NULL,
	[UserId] [int] NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
	[Comment] [nvarchar](max) NULL,
 CONSTRAINT [PK__UserTask__3214EC07B86985DC] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
INSERT [dbo].[AspNetUsers] ([Id], [Email], [EmailConfirmed], [PasswordHash], [SecurityStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEndDateUtc], [LockoutEnabled], [AccessFailedCount], [UserName]) VALUES (N'29ac61d2-f1f5-470a-b41a-e0548d8d3813', N'jigs.prince78@gmail.com', 0, N'APz0AGcx9QzuoQUX40BEaFkjMWs3gp2Vbzq2Ht7ApAsALzpT5cZMIUjPsVPTdD43Qw==', N'c579c4cd-1003-45f3-92d2-b2362177d129', NULL, 0, 0, NULL, 1, 0, N'jigs.prince78@gmail.com')
GO
SET IDENTITY_INSERT [dbo].[Course] ON 

GO
INSERT [dbo].[Course] ([Course_Id], [Faculty_Id], [Course_Image], [Name], [Description], [Fees], [Currency], [Validity_Days], [Insert_Date], [Update_Date]) VALUES (1, 1, N'image', N'Torsion: A Diagnostic Dilemma Made Easy', N'Course 1', 1500, N'inr', 90, CAST(0x0000A68C00F23131 AS DateTime), CAST(0x0000A68C00F23131 AS DateTime))
GO
INSERT [dbo].[Course] ([Course_Id], [Faculty_Id], [Course_Image], [Name], [Description], [Fees], [Currency], [Validity_Days], [Insert_Date], [Update_Date]) VALUES (2, 1, N'inage', N'Scanning the Pelvis: Basics Along with Tips and Tricks', N'Course 2', 1500, N'inr', 90, CAST(0x0000A68C00F23131 AS DateTime), CAST(0x0000A68C00F23131 AS DateTime))
GO
INSERT [dbo].[Course] ([Course_Id], [Faculty_Id], [Course_Image], [Name], [Description], [Fees], [Currency], [Validity_Days], [Insert_Date], [Update_Date]) VALUES (3, 1, N'image ', N'Congenital Uterine Anomalies - Simplified', N'Course 3', 1500, N'inr', 90, CAST(0x0000A68C00F23131 AS DateTime), CAST(0x0000A68C00F23131 AS DateTime))
GO
INSERT [dbo].[Course] ([Course_Id], [Faculty_Id], [Course_Image], [Name], [Description], [Fees], [Currency], [Validity_Days], [Insert_Date], [Update_Date]) VALUES (4, 1, N'image ', N'Spectrum of Endometriosis: Beyond ‘Ground Glass’ Endometriotic Cysts', N'Course 4', 2000, N'inr', 90, CAST(0x0000A68C00F23131 AS DateTime), CAST(0x0000A68C00F23131 AS DateTime))
GO
INSERT [dbo].[Course] ([Course_Id], [Faculty_Id], [Course_Image], [Name], [Description], [Fees], [Currency], [Validity_Days], [Insert_Date], [Update_Date]) VALUES (8, 4, NULL, N'Cycle Assessment in infertility and ART', N'Sample Descp', 2500, N'inr', 90, CAST(0x0000A68C00F23131 AS DateTime), CAST(0x0000A68C00F23131 AS DateTime))
GO
INSERT [dbo].[Course] ([Course_Id], [Faculty_Id], [Course_Image], [Name], [Description], [Fees], [Currency], [Validity_Days], [Insert_Date], [Update_Date]) VALUES (9, 4, NULL, N'Basic TVS', N'Basic TVS', 1500, N'INR', 90, CAST(0x0000A6C400F23130 AS DateTime), CAST(0x0000A6C400F23131 AS DateTime))
GO
INSERT [dbo].[Course] ([Course_Id], [Faculty_Id], [Course_Image], [Name], [Description], [Fees], [Currency], [Validity_Days], [Insert_Date], [Update_Date]) VALUES (10, 4, NULL, N'Tubal Assessment', N'Tubal Assessment', 1500, N'INR', 90, CAST(0x0000A6C400F23130 AS DateTime), CAST(0x0000A6C400F23131 AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Course] OFF
GO
SET IDENTITY_INSERT [dbo].[Faculty] ON 

GO
INSERT [dbo].[Faculty] ([Faculty_Id], [Title], [Name], [Image], [Profile_Summary], [Insert_Date], [Update_Date]) VALUES (1, N'Prof', N'ABC', N'XYZ', N'ABX XYZ', CAST(0x0000A68C00F23131 AS DateTime), CAST(0x0000A68C00F23131 AS DateTime))
GO
INSERT [dbo].[Faculty] ([Faculty_Id], [Title], [Name], [Image], [Profile_Summary], [Insert_Date], [Update_Date]) VALUES (4, N'Prof', N'ere', N'er', N'weewr', CAST(0x0000A68C00F23131 AS DateTime), CAST(0x0000A68C00F23131 AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Faculty] OFF
GO
SET IDENTITY_INSERT [dbo].[ModuleImage] ON 

GO
INSERT [dbo].[ModuleImage] ([Id], [SampleImage], [Description], [ModulId], [CreateDate], [UpdateDate]) VALUES (1, NULL, N'This is demo', 1, CAST(0x0000A7B800F9718C AS DateTime), CAST(0x0000A7B800F9718C AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[ModuleImage] OFF
GO
SET IDENTITY_INSERT [dbo].[ModuleMaster] ON 

GO
INSERT [dbo].[ModuleMaster] ([Id], [Name], [SessionId], [CreateDate], [UpdateDate], [FacultyId]) VALUES (1, N'MODULE 1: GENERAL TECHNIQUES IN GYNECOLOGICAL ULTRASOUND', 1, CAST(0x0000A7B800F02AE0 AS DateTime), CAST(0x0000A7B800F02AE0 AS DateTime), 1)
GO
INSERT [dbo].[ModuleMaster] ([Id], [Name], [SessionId], [CreateDate], [UpdateDate], [FacultyId]) VALUES (2, N'MODULE 2: ULTRASOUND EVALUATION OF MYOMETRIUM', 1, CAST(0x0000A7B800F02AE0 AS DateTime), CAST(0x0000A7B800F02AE0 AS DateTime), NULL)
GO
INSERT [dbo].[ModuleMaster] ([Id], [Name], [SessionId], [CreateDate], [UpdateDate], [FacultyId]) VALUES (3, N'MODULE 3: ULTRASOUND EVALUATION OF CONGENITAL UTERINE ANOMALIES', 1, CAST(0x0000A7B800F02AE1 AS DateTime), CAST(0x0000A7B800F02AE1 AS DateTime), NULL)
GO
SET IDENTITY_INSERT [dbo].[ModuleMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[Notification] ON 

GO
INSERT [dbo].[Notification] ([Id], [Comment], [IsRead], [FacultyId], [UserId], [CreateDate], [UpdateDate]) VALUES (1, N'test', 1, NULL, 45, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[Notification] OFF
GO
SET IDENTITY_INSERT [dbo].[QuestionMaster] ON 

GO
INSERT [dbo].[QuestionMaster] ([Id], [Question], [Ans], [ImagePath], [TalkId], [CreateDate], [UpdateDate]) VALUES (1, N'Q 1: Determine the position of this fibroid based on findings in this 3D
rendered coronal image of the uterus: (Choose a single option for each sub question)', N'a) Fundal; b) Upper Corpus;
			c) Mid corpus; d) Lower corpus;
			e) Cervical; e) not possible', NULL, 1, CAST(0x0000A7B800F73C34 AS DateTime), CAST(0x0000A7B800F73C34 AS DateTime))
GO
INSERT [dbo].[QuestionMaster] ([Id], [Question], [Ans], [ImagePath], [TalkId], [CreateDate], [UpdateDate]) VALUES (2, N'Q 2: Which of these are not usual/known features of sarcomas:
(Note - there may be more than one option)', N'a) Often single large tumors
appearing like fibroids', NULL, 1, CAST(0x0000A7B800F73C34 AS DateTime), CAST(0x0000A7B800F73C34 AS DateTime))
GO
INSERT [dbo].[QuestionMaster] ([Id], [Question], [Ans], [ImagePath], [TalkId], [CreateDate], [UpdateDate]) VALUES (3, N'Q 3: Which of these features of a fibroid are not useful in differentiating
between fibroids & adenomyoma/adenomyosis?
(Note - there may be more than one option)', N'a) Margins are well defined', NULL, 1, CAST(0x0000A7B800F73C34 AS DateTime), CAST(0x0000A7B800F73C34 AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[QuestionMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[QuetionOptionMaster] ON 

GO
INSERT [dbo].[QuetionOptionMaster] ([Id], [QueOption], [QueId], [CreateDate], [UpdateDate]) VALUES (1, N'a) Fundal; b) Upper Corpus;
			c) Mid corpus; d) Lower corpus;
			e) Cervical; e) not possible', 1, CAST(0x0000A7B800F8A20A AS DateTime), CAST(0x0000A7B800F8A20A AS DateTime))
GO
INSERT [dbo].[QuetionOptionMaster] ([Id], [QueOption], [QueId], [CreateDate], [UpdateDate]) VALUES (2, N'a) Submucous; b) Intramural;
c) Subserous ; d) Transmural;
e) not possible', 1, CAST(0x0000A7B800F8A20A AS DateTime), CAST(0x0000A7B800F8A20A AS DateTime))
GO
INSERT [dbo].[QuetionOptionMaster] ([Id], [QueOption], [QueId], [CreateDate], [UpdateDate]) VALUES (3, N'a) Anterior; b) Posterior;
c) Right lateral; d) Left lateral;
e) not possible', 1, CAST(0x0000A7B800F8A20A AS DateTime), CAST(0x0000A7B800F8A20A AS DateTime))
GO
INSERT [dbo].[QuetionOptionMaster] ([Id], [QueOption], [QueId], [CreateDate], [UpdateDate]) VALUES (4, N'a) Right sided; b) Left;
c) Midline; e) not possible', 1, CAST(0x0000A7B800F8A20A AS DateTime), CAST(0x0000A7B800F8A20A AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[QuetionOptionMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[SessionMaster] ON 

GO
INSERT [dbo].[SessionMaster] ([Id], [Name], [CreateDate], [UpdateDate]) VALUES (1, N'SESSION 1', CAST(0x0000A7B800EDC388 AS DateTime), CAST(0x0000A7B800EDC388 AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[SessionMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[TalkMaster] ON 

GO
INSERT [dbo].[TalkMaster] ([Id], [Name], [VideoLink], [FacultyId], [ModulId], [SessionId], [CreateDate], [UpdateDate]) VALUES (1, N'METHODOLOGY (TAS & TVS) AND TRICKS TO SCAN THE PELVIS
ULTRASOUND SETTINGS', NULL, 1, 1, 1, CAST(0x0000A7B800F2F0BB AS DateTime), CAST(0x0000A7B800F2F0BB AS DateTime))
GO
INSERT [dbo].[TalkMaster] ([Id], [Name], [VideoLink], [FacultyId], [ModulId], [SessionId], [CreateDate], [UpdateDate]) VALUES (2, N'ULTRASOUND SETTINGS', NULL, 1, 1, 1, CAST(0x0000A7B800F2F0BB AS DateTime), CAST(0x0000A7B800F2F0BB AS DateTime))
GO
INSERT [dbo].[TalkMaster] ([Id], [Name], [VideoLink], [FacultyId], [ModulId], [SessionId], [CreateDate], [UpdateDate]) VALUES (3, N'THREE DIMENSIONAL ULTRASOUND IN GYNECOLOGY', NULL, 1, 1, 1, CAST(0x0000A7B800F2F0BB AS DateTime), CAST(0x0000A7B800F2F0BB AS DateTime))
GO
INSERT [dbo].[TalkMaster] ([Id], [Name], [VideoLink], [FacultyId], [ModulId], [SessionId], [CreateDate], [UpdateDate]) VALUES (4, N' DOPPLER IN GYNECOLOGY ', NULL, 1, 1, 1, CAST(0x0000A7B800F2F0BB AS DateTime), CAST(0x0000A7B800F2F0BB AS DateTime))
GO
INSERT [dbo].[TalkMaster] ([Id], [Name], [VideoLink], [FacultyId], [ModulId], [SessionId], [CreateDate], [UpdateDate]) VALUES (5, N'ENHANCED ULTRASOUND TECHNIQUES (SONOHYSTEROGRAPHY & GEL SONOVAGINOGRAPHY) ', NULL, 1, 1, 1, CAST(0x0000A7B800F2F0BC AS DateTime), CAST(0x0000A7B800F2F0BC AS DateTime))
GO
INSERT [dbo].[TalkMaster] ([Id], [Name], [VideoLink], [FacultyId], [ModulId], [SessionId], [CreateDate], [UpdateDate]) VALUES (6, N' EVALUATION OF MYOMETRIUM (Based on MUSA Guidelines) & NORMAL MYOMETRIUM ', NULL, 4, 2, 1, CAST(0x0000A7B800F2F0BC AS DateTime), CAST(0x0000A7B800F2F0BC AS DateTime))
GO
INSERT [dbo].[TalkMaster] ([Id], [Name], [VideoLink], [FacultyId], [ModulId], [SessionId], [CreateDate], [UpdateDate]) VALUES (7, N'FIBROID (LEIOMYOMA) & SARCOMA ', NULL, 4, 2, 1, CAST(0x0000A7B800F2F0BC AS DateTime), CAST(0x0000A7B800F2F0BC AS DateTime))
GO
INSERT [dbo].[TalkMaster] ([Id], [Name], [VideoLink], [FacultyId], [ModulId], [SessionId], [CreateDate], [UpdateDate]) VALUES (8, N' ADENOMYOSIS AND ADENOMYOMA ', NULL, 4, 2, 1, CAST(0x0000A7B800F2F0BC AS DateTime), CAST(0x0000A7B800F2F0BC AS DateTime))
GO
INSERT [dbo].[TalkMaster] ([Id], [Name], [VideoLink], [FacultyId], [ModulId], [SessionId], [CreateDate], [UpdateDate]) VALUES (9, N'EMBRYOPATHOGENESIS, APPROACH & DIAGNOSIS OF UTERINE ANOMALIES ', NULL, 4, 3, 1, CAST(0x0000A7B800F2F0BC AS DateTime), CAST(0x0000A7B800F2F0BC AS DateTime))
GO
INSERT [dbo].[TalkMaster] ([Id], [Name], [VideoLink], [FacultyId], [ModulId], [SessionId], [CreateDate], [UpdateDate]) VALUES (10, N'CERVICAL & VAGINAL ANOMALIES ', NULL, 4, 3, 1, CAST(0x0000A7B800F2F0BC AS DateTime), CAST(0x0000A7B800F2F0BC AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[TalkMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[User] ON 

GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (1, N'test', N'Nipun', N'', N'Patel', N'nipun710@gmail.com', 1, N'1234567890', N'12345', N'test', N'test', N'test', N'Pune', N'India', N'test', N'Google search', N'5FEE3D06-5BE8-4908-A050-06848', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (2, N'Mrs', N'Priya', N'', N'Ghatge', N'pungul@gmail.com', 1, N'uiyuiy89798', N'popo', N'asd', N'asd', N'sda', N'Mumbai', N'India', N'iuyuiyuiyi', N'Friend', N'CD27473F-0562-4D3A-9AFD-87D3819BC4C3', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (3, N'Dr', N'Mala', N'', N'Sibal', N'mala@sibal.com', 1, N'09845069940', N'sairam7', N'Obstetrician & Gynecology', N'MBBS, DGO, DNB', N'91, Bhuvaneshwari Nagar,
C V Raman Nagar,
Bangalore 560093', N'Bangalore', N'India', N'Manipal Hospital, Bangalore', N'Friend', N'552D6F3F-3843-4C9D-A0CA-4FB20', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (5, N'Mrs', N'Sonal', NULL, N'Panchal', N'sonalyogesh@yahoo.com', 1, N'9999999999', N'sonal123', N'Doctor', N'MBBS', N'Bangalore', N'Bangalore', N'India', N'Bangalore', N'Friend', N'B8900AE8-6E4E-4B53-926A-9537F', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (6, N'Mrs', N'Annu', NULL, N'Gulati', N'annugulati@gmail.com', 1, N'9089879878', N'popo', N'popo', N'popo', N'popo', N'pune', N'India', N'hghjg', N'Google search', N'0897F50E-2123-4561-9D02-6873F9DD41CC', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (7, N'Ms', N'Sarita', NULL, N'Nair', N'saritanair101@gmail.com', 1, N'9632333546', N'abcdefgh', N'Sr ultrasound', N'MBBS', N'Doddenakundi', N'Bangalore', N'India', N'Bangalore', N'Friend', N'AF51415F-FB15-42D2-BD21-F68D9716C5CB', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (8, N'Mr', N'Rudresh', NULL, N'Bhangale', N'rudresh.bhangale@gmail.com', 1, N'12345677', N'123456', N'Spec', N'Edu', N'Add', N'Pune', N'India', N'Work', N'Google search', N'9E96A015-57EA-4B81-8A55-78EF6', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (9, N'Dr.', N'Rajesh', NULL, N'Uppal', N'uppalrajesh@gmail.com', 0, N'9110026253', N'malausg', N'Radiology', N'Radiologist', N'R 22   South Extension 2', N'New Delhi', N'India', N'Upall Diagnostics', N'Friend', N'A12FD7C0-B887-4DF3-B7C9-7ABE420FFD6A', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (18, N'test', N'tesst', NULL, N'test', N'rudresh.s.bhangale@gmail.com', 1, N'653425', N'1', N'prof', N'edu', N'add', N'test', N'India', N'edfg', N'Friend', N'E0386787-BDA4-45F2-A2E8-867C5ACCB34B', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (32, N'Dr', N'LATHA', NULL, N'PARAMESWARAN', N'WINSMART@YAHOO.COM', 0, N'42030866', N'monica96', N'Ultrasound', N'MBBS MSc Diagnostic Ultrasound', N'7 Srinivasa Avenue Road', N'Chennai', N'India', N'42030866', N'Friend', N'DFA73596-8FD0-46F6-AFF9-096C66CD9757', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (33, N'SRIDEVI', N'koppaka', NULL, N'sridevi', N'kvsridevi2000@yahoo.co.in', 0, N'9440515253', N'sridevi', N'gyneacologist', N'MS OBG , FELLOW IN FETAL MEDICINE', N'DR.K.V.SRIDEVI
FLAT NO 312, AKSHAYA ASPIRA, PLOT NO 66, KIRLAMPUDY LAYOUT,', N'VISAKHAPATNAM', N'India', N'PINNACLE WOMENS IMAGING CENTER', N'Friend', N'322A6123-5C64-4081-B4A4-2C85AC538984', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (36, N'Dr', N'HEMA', NULL, N'DESAI', N'hema8872@gmail.com', 1, N'9848730253', N'babboo1003', N'gynecology', N'M.S.Ob Gyn', N'Habitat Elite, 516,
Kavadiguda
H:No: 6-6-33 A/B/C', N'SECUNDERABAD', N'India', N'Fernandez Hospitals', N'Friend', N'DB382BBA-C7A8-4149-9773-69CA2CE73030', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (37, N'Doctor', N'Vijaya', NULL, N'Bharathi', N'bharathi.b2002@gmail.com', 0, N'9701218184', N'bODYGUARD', N'Laparoscopic surgeon', N'MD,FMIS', N'1958,MIG BHEL RCPURAM
HYDERABAD
TELANGANA
502032', N'HYDERABAD', N'India', N'FERNANDEZ HOSPITAL', N'Other', N'EDAFE89B-5C3B-4AF3-B1B8-7E41FBDA6A7A', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (38, N'Test', N'Nipun123', NULL, N'Patel123', N'nipunpatel111@gmail.com', 0, N'8888895323', N'12345', N'test', NULL, N'Test', N'Pune', N'India', N'test', NULL, N'93831AB7-E365-4CA6-BD80-A79DABC2A8E0', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (39, N'Dr', N'El idrissi', NULL, N'Fouad', N'Fouadelidrissi@hotmail.fr', 0, N'2120667942', N'elidrissifouad', N'Gynecology Obstetric', NULL, N'Residence Florence 17 Avenue des FAR', N'Tetouan', N'Others', N'Clinic Tetouan', N'Newspaper/magazine article', N'2FB3A603-0208-4967-8D1B-3E41EB9FCE98', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (40, N'Dr', N'Suhas', NULL, N'Otiv', N'suhasotiv@gmail.com', 1, N'9822091965', N'Shruti96', N'Obstetrics & Gynecology', N'MD Obs Gyn', N'B-6, Mittal Court, 478 Rasta Peth, Pune 411011', N'Pune', N'India', N'KEM Hospital, Pune', N'Other', N'A9D55EA6-31E6-4B67-A493-7D3B0', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (41, N'Dr', N'Habib', NULL, N'Zakerian', N'drhz1348@gmail.com', 1, N'9121731249', N'habib1249', N'Radiologist', N'M.D', N'22 bahman ave.markazi medical building', N'shahrood', N'Iran', N'emam hoseyn hospital', N'Other', N'C0539C77-89D1-4C14-8136-710A1FF321FD', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (42, N'Dr', N'Shruthi', NULL, N'K', N'shruthikprasad27@Gmail.com', 0, N'9980697761', N'maanyatha57', N'Fetal medicine', N'MBBS ,MS (OBG)', N'No 92. .6th Main 7th Cross 
MIG Second Stage 
KHB Colony', N'Bangalore', N'India', N'Cloudnine', NULL, N'7F602668-6B85-47BD-A417-EFA5E0F072C1', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (43, N'DR.', N'farzin', NULL, N'arabzadeh', N'farzin.arabzadeh9@gmail.com', 1, N'9166712609', N'arabzadeh', N'radiologist', NULL, N'khozestan', N'behbahan', N'Iran', N'private clinic', N'Other', N'85F70488-A677-48DE-91E2-2F9E8FFF214B', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (44, N'dr.', N'hasmukh', NULL, N'lal', N'doctorhasmukh@gmail.com', 1, N'9437096677', N'hasmukh@46', N'consultant sonologisi', N'mbbs,dip.ultrasonography', N'director, medicare,doctor house
dharamshala road', N'TITILAGARH', N'India', N'TITILAGARH', N'Facebook', N'C4C6E6BA-BBB2-49EA-AD0E-4F805', NULL, NULL, NULL, NULL, 0)
GO
INSERT [dbo].[User] ([User_Id], [Title], [First_Name], [Middle_Name], [Last_Name], [Email], [Email_Verified], [Mobile], [Password], [Professional_Specialty], [Educational_Qualification], [Street_Address], [City_Town], [Country], [Institution_Work_Place], [Where_Hear], [Guid], [Transaction_Id], [Transaction_Status], [Order_Status], [Comment], [IsLogin]) VALUES (45, N'Gync_Jigar', N'jigar', NULL, N'khalas', N'jigs.prince79@gmail.com', 1, N'12312122', N'123456', N'teacher', N'mca', N'ahmedabad', N'Pune', N'India', N'india', N'Friend', N'F575DD9A-633A-453A-80DF-2F6DDB8A5EB5', NULL, NULL, NULL, NULL, 0)
GO
SET IDENTITY_INSERT [dbo].[User] OFF
GO
SET IDENTITY_INSERT [dbo].[User_Course] ON 

GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (7, 1, 1, CAST(0x0000A6970120E390 AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (10, 3, 1, CAST(0x0000A69A005E6483 AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (11, 6, 1, CAST(0x0000A6970120E390 AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (12, 5, 1, CAST(0x0000A69A00C8FE42 AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (13, 2, 1, CAST(0x0000A69A00D67F60 AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (14, 1, 2, CAST(0x0000A69A014931C5 AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (15, 2, 2, CAST(0x0000A69B0045C2F3 AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (16, 2, 3, CAST(0x0000A69B0045C9B9 AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (17, 2, 4, CAST(0x0000A69B0045C9B9 AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (18, 3, 2, CAST(0x0000A69B00D525C1 AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (19, 3, 3, CAST(0x0000A69B00D52652 AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (20, 3, 4, CAST(0x0000A69B00D52652 AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (21, 7, 2, CAST(0x0000A6A80126FC7D AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (22, 7, 1, CAST(0x0000A6A80126FC86 AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (27, 8, 3, CAST(0x0000A6B500FB3B2E AS DateTime), CAST(0x0000A70F00A9439A AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, N'105134134639', N'Transaction Successful', N'Success')
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (28, 3, 8, CAST(0x0000A6BC00EC9FFC AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(1500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (31, 5, 8, CAST(0x0000A6BE0015D97B AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (52, 1, 4, CAST(0x0000A6BE012AB03E AS DateTime), NULL, NULL, CAST(2000.00000 AS Decimal(10, 5)), NULL, 0, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (63, 3, 10, CAST(0x0000A6C4006D47AD AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(1500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (64, 3, 9, CAST(0x0000A6C4006D47AD AS DateTime), CAST(0x0000A9710120E390 AS DateTime), NULL, CAST(1500.00000 AS Decimal(10, 5)), NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (65, 2, 10, CAST(0x0000A6C4009061DA AS DateTime), NULL, NULL, CAST(1500.00000 AS Decimal(10, 5)), NULL, 0, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (66, 2, 9, CAST(0x0000A6C4009061DE AS DateTime), NULL, NULL, CAST(1500.00000 AS Decimal(10, 5)), NULL, 0, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (67, 40, 2, CAST(0x0000A7340043E958 AS DateTime), NULL, NULL, CAST(1500.00000 AS Decimal(10, 5)), NULL, 0, NULL, NULL, NULL)
GO
INSERT [dbo].[User_Course] ([User_Course_Id], [User_Id], [Course_Id], [Registered_Date], [Registered_Till], [Payment_Mode], [Payment_Amount], [Payment_Currency], [Is_Active], [Transaction_Id], [Transaction_Status], [Order_Status]) VALUES (68, 44, 8, CAST(0x0000A79A001C1158 AS DateTime), NULL, NULL, CAST(2500.00000 AS Decimal(10, 5)), NULL, 0, NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[User_Course] OFF
GO
SET IDENTITY_INSERT [dbo].[UserModuleImage] ON 

GO
INSERT [dbo].[UserModuleImage] ([Id], [ImagePath], [IsStatus], [Comment], [ModulId], [ModuleImageId], [UserId], [CreateDate], [UpdateDate], [Faculty_Id]) VALUES (1, NULL, NULL, NULL, 1, 1, 45, NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[UserModuleImage] OFF
GO
SET IDENTITY_INSERT [dbo].[UserTalks] ON 

GO
INSERT [dbo].[UserTalks] ([Id], [Enddate], [IsActive], [IsVideoStatus], [IsExamlear], [TalkId], [UserId], [CreateDate], [UpdateDate], [Comment]) VALUES (46, CAST(0x0000A71100000000 AS DateTime), 0, NULL, NULL, 1, 45, NULL, NULL, N'abcddfsdg')
GO
INSERT [dbo].[UserTalks] ([Id], [Enddate], [IsActive], [IsVideoStatus], [IsExamlear], [TalkId], [UserId], [CreateDate], [UpdateDate], [Comment]) VALUES (47, CAST(0x0000A71100000000 AS DateTime), 0, NULL, NULL, 2, 45, NULL, NULL, NULL)
GO
INSERT [dbo].[UserTalks] ([Id], [Enddate], [IsActive], [IsVideoStatus], [IsExamlear], [TalkId], [UserId], [CreateDate], [UpdateDate], [Comment]) VALUES (48, CAST(0x0000A71100000000 AS DateTime), 0, NULL, NULL, 3, 45, NULL, NULL, NULL)
GO
INSERT [dbo].[UserTalks] ([Id], [Enddate], [IsActive], [IsVideoStatus], [IsExamlear], [TalkId], [UserId], [CreateDate], [UpdateDate], [Comment]) VALUES (49, CAST(0x0000A71100000000 AS DateTime), 0, NULL, NULL, 4, 45, NULL, NULL, NULL)
GO
INSERT [dbo].[UserTalks] ([Id], [Enddate], [IsActive], [IsVideoStatus], [IsExamlear], [TalkId], [UserId], [CreateDate], [UpdateDate], [Comment]) VALUES (50, CAST(0x0000A71100000000 AS DateTime), 0, NULL, NULL, 5, 45, NULL, NULL, NULL)
GO
INSERT [dbo].[UserTalks] ([Id], [Enddate], [IsActive], [IsVideoStatus], [IsExamlear], [TalkId], [UserId], [CreateDate], [UpdateDate], [Comment]) VALUES (51, CAST(0x0000A71100000000 AS DateTime), 0, NULL, NULL, 6, 45, NULL, NULL, NULL)
GO
INSERT [dbo].[UserTalks] ([Id], [Enddate], [IsActive], [IsVideoStatus], [IsExamlear], [TalkId], [UserId], [CreateDate], [UpdateDate], [Comment]) VALUES (52, CAST(0x0000A71100000000 AS DateTime), 0, NULL, NULL, 7, 45, NULL, NULL, NULL)
GO
INSERT [dbo].[UserTalks] ([Id], [Enddate], [IsActive], [IsVideoStatus], [IsExamlear], [TalkId], [UserId], [CreateDate], [UpdateDate], [Comment]) VALUES (53, CAST(0x0000A71100000000 AS DateTime), 0, NULL, NULL, 8, 45, NULL, NULL, NULL)
GO
INSERT [dbo].[UserTalks] ([Id], [Enddate], [IsActive], [IsVideoStatus], [IsExamlear], [TalkId], [UserId], [CreateDate], [UpdateDate], [Comment]) VALUES (54, CAST(0x0000A71100000000 AS DateTime), 0, NULL, NULL, 9, 45, NULL, NULL, NULL)
GO
INSERT [dbo].[UserTalks] ([Id], [Enddate], [IsActive], [IsVideoStatus], [IsExamlear], [TalkId], [UserId], [CreateDate], [UpdateDate], [Comment]) VALUES (55, CAST(0x0000A71100000000 AS DateTime), 0, NULL, NULL, 10, 45, NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[UserTalks] OFF
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [RoleNameIndex]    Script Date: 8/4/2017 2:32:33 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [RoleNameIndex] ON [dbo].[AspNetRoles]
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_UserId]    Script Date: 8/4/2017 2:32:33 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserClaims]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_UserId]    Script Date: 8/4/2017 2:32:33 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserLogins]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_RoleId]    Script Date: 8/4/2017 2:32:33 PM ******/
CREATE NONCLUSTERED INDEX [IX_RoleId] ON [dbo].[AspNetUserRoles]
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_UserId]    Script Date: 8/4/2017 2:32:33 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserRoles]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [UserNameIndex]    Script Date: 8/4/2017 2:32:33 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UserNameIndex] ON [dbo].[AspNetUsers]
(
	[UserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[User] ADD  DEFAULT (NULL) FOR [Transaction_Id]
GO
ALTER TABLE [dbo].[User] ADD  DEFAULT (NULL) FOR [Transaction_Status]
GO
ALTER TABLE [dbo].[User] ADD  DEFAULT (NULL) FOR [Order_Status]
GO
ALTER TABLE [dbo].[User_Course] ADD  DEFAULT ((0)) FOR [Is_Active]
GO
ALTER TABLE [dbo].[AspNetUserClaims]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserClaims] CHECK CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserLogins]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserLogins] CHECK CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[Course]  WITH CHECK ADD  CONSTRAINT [FK_Course_Faculty] FOREIGN KEY([Faculty_Id])
REFERENCES [dbo].[Faculty] ([Faculty_Id])
GO
ALTER TABLE [dbo].[Course] CHECK CONSTRAINT [FK_Course_Faculty]
GO
ALTER TABLE [dbo].[ModuleImage]  WITH CHECK ADD  CONSTRAINT [FK__ModuleIma__Modul__3B75D760] FOREIGN KEY([ModulId])
REFERENCES [dbo].[ModuleMaster] ([Id])
GO
ALTER TABLE [dbo].[ModuleImage] CHECK CONSTRAINT [FK__ModuleIma__Modul__3B75D760]
GO
ALTER TABLE [dbo].[ModuleMaster]  WITH CHECK ADD FOREIGN KEY([FacultyId])
REFERENCES [dbo].[Faculty] ([Faculty_Id])
GO
ALTER TABLE [dbo].[ModuleMaster]  WITH CHECK ADD  CONSTRAINT [FK__ModuleMas__Sessi__38996AB5] FOREIGN KEY([SessionId])
REFERENCES [dbo].[SessionMaster] ([Id])
GO
ALTER TABLE [dbo].[ModuleMaster] CHECK CONSTRAINT [FK__ModuleMas__Sessi__38996AB5]
GO
ALTER TABLE [dbo].[Notification]  WITH CHECK ADD  CONSTRAINT [FK__Notificat__Facul__5EBF139D] FOREIGN KEY([FacultyId])
REFERENCES [dbo].[Faculty] ([Faculty_Id])
GO
ALTER TABLE [dbo].[Notification] CHECK CONSTRAINT [FK__Notificat__Facul__5EBF139D]
GO
ALTER TABLE [dbo].[Notification]  WITH CHECK ADD  CONSTRAINT [FK__Notificat__UserI__5FB337D6] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([User_Id])
GO
ALTER TABLE [dbo].[Notification] CHECK CONSTRAINT [FK__Notificat__UserI__5FB337D6]
GO
ALTER TABLE [dbo].[QuestionMaster]  WITH CHECK ADD  CONSTRAINT [FK__QuestionM__TalkI__4316F928] FOREIGN KEY([TalkId])
REFERENCES [dbo].[TalkMaster] ([Id])
GO
ALTER TABLE [dbo].[QuestionMaster] CHECK CONSTRAINT [FK__QuestionM__TalkI__4316F928]
GO
ALTER TABLE [dbo].[QuetionOptionMaster]  WITH CHECK ADD  CONSTRAINT [FK__QuetionOp__QueId__45F365D3] FOREIGN KEY([QueId])
REFERENCES [dbo].[QuestionMaster] ([Id])
GO
ALTER TABLE [dbo].[QuetionOptionMaster] CHECK CONSTRAINT [FK__QuetionOp__QueId__45F365D3]
GO
ALTER TABLE [dbo].[TalkMaster]  WITH CHECK ADD  CONSTRAINT [FK__TalkMaste__Facul__3E52440B] FOREIGN KEY([FacultyId])
REFERENCES [dbo].[Faculty] ([Faculty_Id])
GO
ALTER TABLE [dbo].[TalkMaster] CHECK CONSTRAINT [FK__TalkMaste__Facul__3E52440B]
GO
ALTER TABLE [dbo].[TalkMaster]  WITH CHECK ADD  CONSTRAINT [FK__TalkMaste__Modul__3F466844] FOREIGN KEY([ModulId])
REFERENCES [dbo].[ModuleMaster] ([Id])
GO
ALTER TABLE [dbo].[TalkMaster] CHECK CONSTRAINT [FK__TalkMaste__Modul__3F466844]
GO
ALTER TABLE [dbo].[TalkMaster]  WITH CHECK ADD  CONSTRAINT [FK__TalkMaste__Sessi__403A8C7D] FOREIGN KEY([SessionId])
REFERENCES [dbo].[SessionMaster] ([Id])
GO
ALTER TABLE [dbo].[TalkMaster] CHECK CONSTRAINT [FK__TalkMaste__Sessi__403A8C7D]
GO
ALTER TABLE [dbo].[User_Course]  WITH CHECK ADD  CONSTRAINT [FK_User_Course_Course] FOREIGN KEY([Course_Id])
REFERENCES [dbo].[Course] ([Course_Id])
GO
ALTER TABLE [dbo].[User_Course] CHECK CONSTRAINT [FK_User_Course_Course]
GO
ALTER TABLE [dbo].[User_Course]  WITH CHECK ADD  CONSTRAINT [FK_User_Course_User] FOREIGN KEY([User_Id])
REFERENCES [dbo].[User] ([User_Id])
GO
ALTER TABLE [dbo].[User_Course] CHECK CONSTRAINT [FK_User_Course_User]
GO
ALTER TABLE [dbo].[UserAnswer]  WITH CHECK ADD  CONSTRAINT [FK__UserAnswe__QueId__49C3F6B7] FOREIGN KEY([QueId])
REFERENCES [dbo].[QuestionMaster] ([Id])
GO
ALTER TABLE [dbo].[UserAnswer] CHECK CONSTRAINT [FK__UserAnswe__QueId__49C3F6B7]
GO
ALTER TABLE [dbo].[UserAnswer]  WITH CHECK ADD  CONSTRAINT [FK__UserAnswe__QueOp__48CFD27E] FOREIGN KEY([QueOptionId])
REFERENCES [dbo].[QuetionOptionMaster] ([Id])
GO
ALTER TABLE [dbo].[UserAnswer] CHECK CONSTRAINT [FK__UserAnswe__QueOp__48CFD27E]
GO
ALTER TABLE [dbo].[UserModuleImage]  WITH CHECK ADD FOREIGN KEY([Faculty_Id])
REFERENCES [dbo].[Faculty] ([Faculty_Id])
GO
ALTER TABLE [dbo].[UserModuleImage]  WITH CHECK ADD  CONSTRAINT [FK__UserModul__Modul__5070F446] FOREIGN KEY([ModulId])
REFERENCES [dbo].[ModuleMaster] ([Id])
GO
ALTER TABLE [dbo].[UserModuleImage] CHECK CONSTRAINT [FK__UserModul__Modul__5070F446]
GO
ALTER TABLE [dbo].[UserModuleImage]  WITH CHECK ADD  CONSTRAINT [FK__UserModul__Modul__5165187F] FOREIGN KEY([ModuleImageId])
REFERENCES [dbo].[ModuleImage] ([Id])
GO
ALTER TABLE [dbo].[UserModuleImage] CHECK CONSTRAINT [FK__UserModul__Modul__5165187F]
GO
ALTER TABLE [dbo].[UserModuleImage]  WITH CHECK ADD  CONSTRAINT [FK__UserModul__UserI__52593CB8] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([User_Id])
GO
ALTER TABLE [dbo].[UserModuleImage] CHECK CONSTRAINT [FK__UserModul__UserI__52593CB8]
GO
ALTER TABLE [dbo].[UserTalks]  WITH CHECK ADD  CONSTRAINT [FK__UserTask__TalkId__4CA06362] FOREIGN KEY([TalkId])
REFERENCES [dbo].[TalkMaster] ([Id])
GO
ALTER TABLE [dbo].[UserTalks] CHECK CONSTRAINT [FK__UserTask__TalkId__4CA06362]
GO
ALTER TABLE [dbo].[UserTalks]  WITH CHECK ADD  CONSTRAINT [FK__UserTask__UserId__4D94879B] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([User_Id])
GO
ALTER TABLE [dbo].[UserTalks] CHECK CONSTRAINT [FK__UserTask__UserId__4D94879B]
GO
USE [master]
GO
ALTER DATABASE [gynac] SET  READ_WRITE 
GO
