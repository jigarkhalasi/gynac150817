using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gynac.Models
{
    public class UserRatingsModel
    {
        public int RatingId { get; set; }
        public string RatingName { get; set; }

        public int UserRatingId { get; set; }
        public int UserId { get; set; }        
        public int RateMark { get; set; }
    }
}