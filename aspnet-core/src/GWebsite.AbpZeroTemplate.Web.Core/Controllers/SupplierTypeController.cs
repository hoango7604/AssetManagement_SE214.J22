﻿using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using GWebsite.AbpZeroTemplate.Application.Share.MenuClients.Dto;
using Microsoft.AspNetCore.Mvc;
using GWebsite.AbpZeroTemplate.Application.Share.SupplierType;
using GWebsite.AbpZeroTemplate.Application.Share.Bidding.Dto;
using GWebsite.AbpZeroTemplate.Application.Share.SupplierType.Dto;

namespace GWebsite.AbpZeroTemplate.Application.Controllers
{
    [Route("api/[controller]/[action]")]
    public class SupplierTypeController : GWebsiteControllerBase
    {
        private readonly ISupplierTypeAppService supplierTypeAppService;

        public SupplierTypeController(ISupplierTypeAppService supplierTypeAppService)
        {
            this.supplierTypeAppService = supplierTypeAppService;
        }

        [HttpGet]
        public async Task<ListResultDto<SupplierTypeDto>> GetSupplierTypes(SupplierTypeListInputDto input)
        {
            return await this.supplierTypeAppService.GetSupplierTypesAsync(input);
        }

        [HttpPost]
        public async Task<SupplierTypeDto> CreateSupplierTypeDto(SupplierTypeDto dto)
        {
            return await this.supplierTypeAppService.CreateSupplierTypeAsync(dto);
        }

        [HttpPost("status/{id}")]
        public async Task<SupplierTypeDto> SetStatusSupplierTypeAsync(int id)
        {
            return await this.supplierTypeAppService.SetStatusSupplierTypeAsync(id);
        }

        [HttpDelete("{id}")]
        public async Task DeleteSupplierTypeAsync(int id)
        {
            await this.supplierTypeAppService.DeleteSupplierTypeAsync(id);
        }

        [HttpPost("edit")]
        public async Task<SupplierTypeDto> EditNameSupplierTypeAsync(SupplierTypeDto dto)
        {
            return await this.supplierTypeAppService.EditNameSupplierTypeAsync(dto.Id, dto.Name, dto.Note);
        }
    }
}
