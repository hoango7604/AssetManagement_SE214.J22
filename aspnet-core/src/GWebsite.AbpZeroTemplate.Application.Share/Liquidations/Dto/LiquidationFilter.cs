﻿using GSoft.AbpZeroTemplate.Dto;
using GWebsite.AbpZeroTemplate.Core.Models;
using System;

namespace GWebsite.AbpZeroTemplate.Application.Share.Liquidations.Dto
{
    /// <summary>
    /// <model cref="Liquidation"></model>
    /// </summary>
    public class LiquidationFilter : PagedAndSortedInputDto
    {
        //Mã tài sản
        public string AssetID { get; set; }
    }
}