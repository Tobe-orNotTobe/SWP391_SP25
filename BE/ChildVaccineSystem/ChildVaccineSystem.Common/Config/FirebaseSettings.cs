using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChildVaccineSystem.Common.Config
{
    public class FirebaseSettings
    {
        public string ApiKey { get; set; } = string.Empty;
        public string AuthDomain { get; set; } = string.Empty;
        public string ProjectId { get; set; } = string.Empty;
        public string StorageBucket { get; set; } = string.Empty;
        public string MessagingSenderId { get; set; } = string.Empty;
        public string AppId { get; set; } = string.Empty;
        public string MeasurementId { get; set; } = string.Empty;
        public string ServiceAccountPath { get; set; } = string.Empty;
    }
}
