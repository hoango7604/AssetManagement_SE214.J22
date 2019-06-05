﻿using Abp.Domain.Entities;
using GWebsite.AbpZeroTemplate.Core.Models;

namespace GWebsite.AbpZeroTemplate.Application.Share.UseAssets.Dto
{
    /// <summary>
    /// <model cref="UseAsset"></model>
    /// </summary>
    public class UseAssetDto : Entity<int>
    {
        //Mã tài sản
        public string AssetId { get; set; }
        //Mã đơn vị sử dụng
        public string UnitsUsedId { get; set; }
        //Mã người sử dụng
        public string UserId { get; set; }
        //Ngày xuất
        public string DateExport { get; set; }
        //Trạng thái duyệt
        public string StatusApproved { get; set; }
    }
}
