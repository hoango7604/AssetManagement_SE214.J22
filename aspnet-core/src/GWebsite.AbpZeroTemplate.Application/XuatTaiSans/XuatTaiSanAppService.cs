﻿using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using GWebsite.AbpZeroTemplate.Application;
using GWebsite.AbpZeroTemplate.Application.Share.XuatTaiSans;
using GWebsite.AbpZeroTemplate.Application.Share.XuatTaiSans.Dto;
using GWebsite.AbpZeroTemplate.Application.Share.CTDonVis.Dto;
using GWebsite.AbpZeroTemplate.Core.Authorization;
using GWebsite.AbpZeroTemplate.Core.Models;
using System.Linq;
using System.Linq.Dynamic.Core;
using System;
namespace GWebsite.AbpZeroTemplate.Web.Core.XuatTaiSans
{
    [AbpAuthorize(GWebsitePermissions.Pages_Administration_MenuClient)]
    public class XuatTaiSanAppService:GWebsiteAppServiceBase,IXuatTaiSanAppService
    {
        private readonly IRepository<XuatTaiSan> xuatttaisanRepository;
        private readonly IRepository<DonVi> donVirepository;
        private readonly IRepository<NhanVien> nhanVienrepository;
        private readonly IRepository<ThongTinTaiSan> thongtintaisanrepository;
        public XuatTaiSanAppService(IRepository<XuatTaiSan> xuatttaisanRepository, IRepository<DonVi> donVirepository
            , IRepository<NhanVien> nhanVienrepository
            , IRepository<ThongTinTaiSan> thongtintaisanrepository)
        {
            this.xuatttaisanRepository = xuatttaisanRepository;
            this.donVirepository = donVirepository;
            this.nhanVienrepository = nhanVienrepository;
            this.thongtintaisanrepository = thongtintaisanrepository;
        }
        public void CreateOrEditXuatTaiSan(XuatTaiSanInput xuatTaiSanInput)
        {
            if (xuatTaiSanInput.Id == 0)
            {
                Create(xuatTaiSanInput);
            }
            else
            {
                Update(xuatTaiSanInput);
            }
        }

        public void DeleteXuatTaiSan(int id)
        {
            var xuattaisanEntity = xuatttaisanRepository.GetAll().Where(x => !x.IsDelete).SingleOrDefault(x => x.Id == id);
            if (xuattaisanEntity != null)
            {
                xuattaisanEntity.IsDelete = true;
                xuatttaisanRepository.Update(xuattaisanEntity);
                CurrentUnitOfWork.SaveChanges();
            }
        }

        public XuatTaiSanInput GetXuatTaiSanForEdit(int id)
        {
            var xuattaisanEntity = xuatttaisanRepository.GetAll().Where(x => !x.IsDelete).SingleOrDefault(x => x.Id == id);
            if (xuattaisanEntity == null)
            {
                return null;
            }
            return ObjectMapper.Map<XuatTaiSanInput>(xuattaisanEntity);
        }

        public XuatTaiSanForViewDto GetXuatTaiSanForView(int id)
        {
            var xuattaisanEntity = xuatttaisanRepository.GetAll().Where(x => !x.IsDelete).SingleOrDefault(x => x.Id == id);
            if (xuattaisanEntity == null)
            {
                return null;
            }
            return ObjectMapper.Map<XuatTaiSanForViewDto>(xuattaisanEntity);
        }

        public PagedResultDto<XuatTaiSanDto> GetXuatTaiSans(XuatTaiSanFilter input)
        {
            var query = xuatttaisanRepository.GetAll().Where(x => !x.IsDelete);

            // filter by value
            if (input.TenTaiSan != null)
            {
                query = query.Where(x => x.TenTaiSan.ToLower().Equals(input.TenTaiSan));
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
            return new PagedResultDto<XuatTaiSanDto>(
                totalCount,
                items.Select(item => ObjectMapper.Map<XuatTaiSanDto>(item)).ToList());
        }

        public string[] GetArrTenDonVi()
        {
            var query = donVirepository.GetAll().Where(x => !x.IsDelete).Select(x => x.TenDonVi).ToArray();
            string[] str = query.Select(x => x.ToString()).ToArray();
            return str;
        }

        public string[] GetArrTenNhanVienTheoDV(string tenDV)
        {
            int maDV = donVirepository.GetAll().Where(x => !x.IsDelete).FirstOrDefault(x => x.TenDonVi == tenDV).Id;

            var query = nhanVienrepository.GetAll().Where(x => !x.IsDelete).Where(x => x.MaDV == maDV).Select(x => x.TenNhanVien).ToArray();
            string[] str = query.Select(x => x.ToString()).ToArray();
            return str;
        }
        #region Private Method

        [AbpAuthorize(GWebsitePermissions.Pages_Administration_MenuClient_Create)]
        private void Create(XuatTaiSanInput xuatTaiSanInput)
        {

            var maDonVi = donVirepository.GetAll().Where(x => !x.IsDelete).FirstOrDefault(x => x.TenDonVi == xuatTaiSanInput.TenDonVi).Id;
            var maNhanVien = nhanVienrepository.GetAll().Where(x => !x.IsDelete).FirstOrDefault(x => x.MaDV == maDonVi && x.TenNhanVien == xuatTaiSanInput.TenNhanVien).Id;

            xuatTaiSanInput.MaDonVi = maDonVi;
            xuatTaiSanInput.MaNhanVien = maNhanVien;
            xuatTaiSanInput.NgayXuat = DateTime.Now;

           
            var xuattaisanEnity = ObjectMapper.Map<XuatTaiSan>(xuatTaiSanInput);
            SetAuditInsert(xuattaisanEnity);
            xuatttaisanRepository.Insert(xuattaisanEnity);
            CurrentUnitOfWork.SaveChanges();

            var updateTaiSan = thongtintaisanrepository.GetAll().Where(x => !x.IsDelete).SingleOrDefault(x => x.MaTS == xuatTaiSanInput.MaTaiSan);
            updateTaiSan.MaDV = xuattaisanEnity.MaDonVi;
            updateTaiSan.TenDV = xuatTaiSanInput.TenDonVi;
            updateTaiSan.TinhTrang = "Đã cấp phát";
            CurrentUnitOfWork.SaveChanges();
        }

        [AbpAuthorize(GWebsitePermissions.Pages_Administration_MenuClient_Edit)]
        private void Update(XuatTaiSanInput xuatTaiSanInput)
        {
            var xuattaisanEnity = xuatttaisanRepository.GetAll().Where(x => !x.IsDelete).SingleOrDefault(x => x.Id == xuatTaiSanInput.Id);
            if (xuattaisanEnity == null)
            {
            }
            ObjectMapper.Map(xuatTaiSanInput, xuattaisanEnity);
            SetAuditEdit(xuattaisanEnity);
            xuatttaisanRepository.Update(xuattaisanEnity);
            CurrentUnitOfWork.SaveChanges();
        }

        #endregion
    }
}
