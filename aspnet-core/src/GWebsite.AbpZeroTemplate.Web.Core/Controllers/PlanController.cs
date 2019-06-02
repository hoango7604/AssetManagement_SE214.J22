﻿using Abp.Application.Services.Dto;
using GWebsite.AbpZeroTemplate.Application.Share.Plans;
using GWebsite.AbpZeroTemplate.Application.Share.Plans.Dto;
using GWebsite.AbpZeroTemplate.Core.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GWebsite.AbpZeroTemplate.Application.Controllers
{
    [Route("api/[controller]/[action]")]
    public  class PlanController : GWebsiteControllerBase
    {
        private readonly IPlanAppService _PlanAppService;
        public PlanController(IPlanAppService PlanAppService)
        {
            _PlanAppService = PlanAppService;
        }


        [HttpGet]
        public async Task<ListResultDto<PlanDto>> GetPlans(PlanListInputDto input)
        {
            return await this._PlanAppService.GetPlanWithFilterAsync(input);
        }

        [HttpGet]
        public async Task<IEnumerable<string>> GetAllDepartment()
        {
            return await this._PlanAppService.GetAllDepartmentAsync();
        }
    }
}
