﻿using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using GWebsite.AbpZeroTemplate.Application;
using GWebsite.AbpZeroTemplate.Application.Share.ThuHois;
using GWebsite.AbpZeroTemplate.Application.Share.ThuHois.Dto;
using GWebsite.AbpZeroTemplate.Core.Authorization;
using GWebsite.AbpZeroTemplate.Core.Models;
using System.Linq;
using System.Linq.Dynamic.Core;
using System;
namespace GWebsite.AbpZeroTemplate.Web.Core.ThuHois
{
    [AbpAuthorize(GWebsitePermissions.Pages_Administration_MenuClient)]
    public class ThuHoiAppService : GWebsiteAppServiceBase, IThuHoiAppService
    {
        private readonly IRepository<ThuHoi> thuHoiRepository;
        private readonly IRepository<DonVi> donvirepository;
        private readonly IRepository<CTDonVi> ctdonvirepository;
        private readonly IRepository<CTTaiSan> cttsrepository;
        public ThuHoiAppService(IRepository<ThuHoi> thuHoiRepository,IRepository<DonVi> donvirepository, IRepository<CTDonVi> ctdonvirepository
           , IRepository<CTTaiSan> cttsrepository)
        {
            this.thuHoiRepository = thuHoiRepository;
            this.donvirepository = donvirepository;
            this.ctdonvirepository = ctdonvirepository;
            this.cttsrepository = cttsrepository;
        }
        public void CreateOrEditThuHoi(ThuHoiInput thuHoiInput)
        {
            if (thuHoiInput.Id == 0)
            {
                Create(thuHoiInput);
            }
            else
            {
                Update(thuHoiInput);
            }
        }

        public void DeleteThuHoi(int id)
        {
            var thuHoiEnity = thuHoiRepository.GetAll().Where(x => !x.IsDelete).SingleOrDefault(x => x.Id == id);
            if (thuHoiEnity != null)
            {
                thuHoiEnity.IsDelete = true;
                thuHoiRepository.Update(thuHoiEnity);
                CurrentUnitOfWork.SaveChanges();
            }
        }

        public ThuHoiInput GetThuHoiForEdit(int id)
        {
            var thuHoiEnity = thuHoiRepository.GetAll().Where(x => !x.IsDelete).SingleOrDefault(x => x.Id == id);
            if (thuHoiEnity == null)
            {
                return null;
            }
            return ObjectMapper.Map<ThuHoiInput>(thuHoiEnity);
        }

        public ThuHoiForViewDto GetThuHoiForView(int id)
        {
            var thuHoiEnity = thuHoiRepository.GetAll().Where(x => !x.IsDelete).SingleOrDefault(x => x.Id == id);
            if (thuHoiEnity == null)
            {
                return null;
            }
            return ObjectMapper.Map<ThuHoiForViewDto>(thuHoiEnity);
        }

        public PagedResultDto<ThuHoiDto> GetThuHois(ThuHoiFilter input)
        {
            var query = thuHoiRepository.GetAll().Where(x => !x.IsDelete);

            // filter by value
            if (input.TenDonVi != null)
            {
                query = query.Where(x => x.TenDonVi.ToLower().Equals(input.TenDonVi));
            }

            var totalCount = query.Count();

            // sorting
            if (!string.IsNullOrWhiteSpace(input.Sorting))
            {
                query = query.OrderBy(input.Sorting);
            }

            // paging
            var items = query.PageBy(input).ToList();

            // result
            return new PagedResultDto<ThuHoiDto>(
                totalCount,
                items.Select(item => ObjectMapper.Map<ThuHoiDto>(item)).ToList());
        }
        #region Private Method

        [AbpAuthorize(GWebsitePermissions.Pages_Administration_MenuClient_Create)]
        private void Create(ThuHoiInput thuHoiInput)
        {
            var MaDonVi = donvirepository.GetAll().Where(x => !x.IsDelete).FirstOrDefault(x => x.TenDonVi == thuHoiInput.TenDonVi).Id;
            var checksoluongTS = ctdonvirepository.GetAll().Where(x => !x.IsDelete).FirstOrDefault(x => x.MaTS == thuHoiInput.MaTS && x.MaDV == MaDonVi).SoLuong;
            if(thuHoiInput.SoLuongTh<=checksoluongTS)
            {
                thuHoiInput.MaDV = MaDonVi;
                thuHoiInput.NgayThuHoi = DateTime.Now;
                var thuHoiEnity = ObjectMapper.Map<ThuHoi>(thuHoiInput);
                SetAuditInsert(thuHoiEnity);
                thuHoiRepository.Insert(thuHoiEnity);
                CurrentUnitOfWork.SaveChanges();
                for (int i = 0; i < thuHoiInput.SoLuongTh; i++)
                {
                    var updateMaThuHoi = cttsrepository.GetAll().Where(x => !x.IsDelete).FirstOrDefault(x => x.MaTS == thuHoiInput.MaTS && x.MATH == 0);
                    updateMaThuHoi.MATH = thuHoiEnity.Id;
                    CurrentUnitOfWork.SaveChanges();
                }
                var updateSoLuong = ctdonvirepository.GetAll().Where(x => !x.IsDelete).FirstOrDefault(x => x.MaTS == thuHoiInput.MaTS && x.MaDV == MaDonVi);
                updateSoLuong.SoLuong -= thuHoiInput.SoLuongTh;
                CurrentUnitOfWork.SaveChanges();
            }

        }

        [AbpAuthorize(GWebsitePermissions.Pages_Administration_MenuClient_Edit)]
        private void Update(ThuHoiInput thuHoiInput)
        {
            var thuHoiEnity = thuHoiRepository.GetAll().Where(x => !x.IsDelete).SingleOrDefault(x => x.Id == thuHoiInput.Id);
            if (thuHoiEnity == null)
            {
            }
            ObjectMapper.Map(thuHoiInput, thuHoiEnity);
            SetAuditEdit(thuHoiEnity);
            thuHoiRepository.Update(thuHoiEnity);
            CurrentUnitOfWork.SaveChanges();
        }

        #endregion
    }
}
