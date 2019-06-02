﻿using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GWebsite.AbpZeroTemplate.Core.Models
{
  public partial  class SubPlan : Entity<int>
    {
        public string ProductCode { get; set; }
        public float Totalprice { get; set; }
        public string ScheduleMonth  { get; set; }
        public int ImplementQantity { get; set; }
        public float ImplementPrice { get; set; }
        public float PesidualQuantity { get; set; }
        public float PesidualPrice { get; set; }
        public int PlanId { get; set; }
        public Plan Plan { get; set; }

    }
}
