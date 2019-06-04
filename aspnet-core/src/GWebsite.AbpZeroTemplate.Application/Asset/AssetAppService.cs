﻿using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using GWebsite.AbpZeroTemplate.Application;
using GWebsite.AbpZeroTemplate.Application.Share.Assets;
using GWebsite.AbpZeroTemplate.Application.Share.Assets.Dto;
using GWebsite.AbpZeroTemplate.Core.Authorization;
using GWebsite.AbpZeroTemplate.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace GWebsite.AbpZeroTemplate.Web.Core.Assets
{
    [AbpAuthorize(GWebsitePermissions.Pages_Administration_Asset)]
    public class AssetAppService : GWebsiteAppServiceBase, IAssetAppService
    {
        private readonly IRepository<Asset> assetRepository;
        private readonly IRepository<AssetLine> assetLineRepository;
        private readonly IRepository<AssetOrganizationUnit> assetOrganizationUnitRepository;
        private readonly IRepository<UserOrganizationUnit, long> userOrganizationUnitRepository;

        public AssetAppService(IRepository<Asset> assetRepository, IRepository<AssetLine> assetLineRepository,
            IRepository<AssetOrganizationUnit> assetOrganizationUnitRepository,
            IRepository<UserOrganizationUnit, long> userOrganizationUnitRepository)
        {
            this.assetRepository = assetRepository;
            this.assetLineRepository = assetLineRepository;
            this.assetOrganizationUnitRepository = assetOrganizationUnitRepository;
            this.userOrganizationUnitRepository = userOrganizationUnitRepository;
        }
        public IQueryable<Asset> GetAssetsOfCurrentUser()
        {
            var user = GetCurrentUser();
            var organizationUnitId = userOrganizationUnitRepository.FirstOrDefault(uo => uo.UserId == user.Id)?.OrganizationUnitId;
            if (organizationUnitId == null)
                return null;
            return from po in assetOrganizationUnitRepository.GetAll()
                   where organizationUnitId == po.OrganizationUnitId
                   select po.Asset;
        }
        public async Task<PagedResultDto<AssetDto>> GetsForView(AssetFilter filter)
        {
            var query = GetAssetsOfCurrentUser().Where(x => !x.IsDelete).AsNoTracking();
            if (filter.AssetLineId > 0)
            {
                query = query.Where(x => x.AssetLineId == filter.AssetLineId);
            }

            if (filter.Term != null)
            {
                query = query.Where(x => x.Code.ToLower().Contains(filter.Term));
            }

            var totalCount = query.Count();

            if (!string.IsNullOrWhiteSpace(filter.Sorting))
            {
                query = query.OrderBy(filter.Sorting);
            }
            //if (filter.MaxResultCount > 0)
            //{
            //    query = query.PageBy(filter);
            //}


            var items = await query.PageBy(filter).Include(i => i.AssetLine).ThenInclude(al => al.AssetType)
                .Include(i => i.AssetLine).ThenInclude(al => al.Manufacturer).ToListAsync();

            return new PagedResultDto<AssetDto>(
                totalCount,
                items.Select(item => ObjectMapper.Map<AssetDto>(item)).ToList());
        }


        public async Task<AssetDto> GetAsyncForView(int id)
        {
            var assetEntity = await assetRepository.GetAll().Where(x => !x.IsDelete).AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);

            if (assetEntity == null)
            {
                return null;
            }
            assetEntity.AssetLine = this.assetLineRepository.GetAll().Where(x => !x.IsDelete).AsNoTracking()
               .Include(b => b.AssetType).Include(b => b.Manufacturer).SingleOrDefault(x => x.Id == assetEntity.AssetLineId);
            return ObjectMapper.Map<AssetDto>(assetEntity);
        }

        public async Task<AssetDto> GetAsyncForView(string code)
        {
            var assetEntity = await assetRepository.GetAll().Where(x => !x.IsDelete).AsNoTracking()
                 .SingleOrDefaultAsync(x => x.Code == code);
            if (assetEntity == null)
            {
                return null;
            }
            assetEntity.AssetLine = this.assetLineRepository.GetAll().Where(x => !x.IsDelete).AsNoTracking()
              .Include(b => b.AssetType).Include(b => b.Manufacturer).SingleOrDefault(x => x.Id == assetEntity.AssetLineId);

            return ObjectMapper.Map<AssetDto>(assetEntity);
        }
        public async Task<AssetInput> GetForEdit(int id)
        {
            var assetEntity = await assetRepository.GetAll().Where(x => !x.IsDelete).SingleOrDefaultAsync(x => x.Id == id);

            if (assetEntity == null)
            {
                return null;
            }
            return ObjectMapper.Map<AssetInput>(assetEntity);
        }

        [AbpAuthorize(GWebsitePermissions.Pages_Administration_Asset_Create_Edit)]
        public async Task CreateOrEdit(AssetInput assetInput)
        {
            if (assetInput.Id == 0)
            {
                await CreateAsync(assetInput);
            }
            else
            {
                await UpdateAsync(assetInput);
            }
        }

        [AbpAuthorize(GWebsitePermissions.Pages_Administration_Asset_Create_Edit)]
        public async Task CreateAsync(AssetInput assetInput)
        {
            var assetEntity = ObjectMapper.Map<Asset>(assetInput);
            var assetLineEntity = this.assetLineRepository.GetAll().Where(x => !x.IsDelete).AsNoTracking()
               .Include(b => b.AssetType).Include(b => b.Manufacturer).SingleOrDefault(x => x.Id == assetInput.AssetLineID);
            if (assetLineEntity == null)
                throw new ArgumentException("AssetLine is not existed!");
            Random random = new Random();
            var randomNumber = random.Next(0, 999999).ToString("D6");
            //todo:check existed 
            assetEntity.Code = string.Concat(assetLineEntity.AssetType.Code, assetLineEntity.Manufacturer.Code, assetLineEntity.Code, randomNumber);
            SetAuditInsert(assetEntity);
            await assetRepository.InsertAsync(assetEntity);

            var user = GetCurrentUser();
            var organizationUnitId = userOrganizationUnitRepository.FirstOrDefault(uo => uo.UserId == user.Id)?.OrganizationUnitId;
            if (organizationUnitId != null)
            {
                var assetOrganizationUnit = new AssetOrganizationUnit() { AssetId = assetEntity.Id, OrganizationUnitId = (long)organizationUnitId };
                await this.assetOrganizationUnitRepository.InsertAsync(assetOrganizationUnit);
            }
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        private async Task UpdateAsync(AssetInput assetInput)
        {
            var assetEntity = assetRepository.GetAll().Where(x => !x.IsDelete).SingleOrDefault(x => x.Id == assetInput.Id);
            if (assetEntity == null)
            {
            }
            ObjectMapper.Map(assetInput, assetEntity);
            SetAuditEdit(assetEntity);
            await assetRepository.UpdateAsync(assetEntity);
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        [AbpAuthorize(GWebsitePermissions.Pages_Administration_Asset_Delete)]
        public async Task DeleteAsync(int id)
        {
            var assetEntity = assetRepository.GetAll().Where(x => !x.IsDelete).SingleOrDefault(x => x.Id == id);
            if (assetEntity != null)
            {
                assetEntity.IsDelete = true;
                await assetRepository.UpdateAsync(assetEntity);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
        }
    }
}