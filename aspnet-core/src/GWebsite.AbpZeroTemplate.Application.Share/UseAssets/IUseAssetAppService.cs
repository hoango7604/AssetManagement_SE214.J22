﻿using Abp.Application.Services.Dto;
using GWebsite.AbpZeroTemplate.Application.Share.UseAssets.Dto;

namespace GWebsite.AbpZeroTemplate.Application.Share.UseAssets
{
    public interface IUseAssetAppService
    {
        void CreateOrEditUseAsset(UseAssetInput useassetInput);
        UseAssetInput GetUseAssetForEdit(int id);
        void DeleteUseAsset(int id);
        PagedResultDto<UseAssetDto> GetUseAssets(UseAssetFilter input);
        UseAssetForViewDto GetUseAssetForView(int id);
        void ApproveUseAsset(int id);
    }
}
