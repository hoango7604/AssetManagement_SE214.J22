﻿using Abp.Domain.Entities;
using GWebsite.AbpZeroTemplate.Core.Models;

namespace GWebsite.AbpZeroTemplate.Application.Share.Assets.Dto
{
    /// <summary>
    /// <model cref="Asset"></model>
    /// </summary>
    public class AssetInput : Entity<int>
    {
        //multi insert
        public int Number { get; set; }
        public int AssetLineID { get; set; }
        public bool IsDamaged { get; set; }
        public long OrganizationUnitId { get; set; }
        public string Note { get; set; }
        public long PONumber { get; set; }
        public int DepreciationMonths { get; set; }
        public float FullDepreciationPrice { get; set; }
        public float DepreciationValue { get; set; }
    }
}
