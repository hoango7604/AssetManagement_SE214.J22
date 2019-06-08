import { CustomerServiceProxy } from './../../shared/service-proxies/service-proxies';
import { ViewDemoModelModalComponent } from './demo-model/view-demo-model-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { FileUploadModule } from 'ng2-file-upload';
import { ModalModule, PopoverModule, TabsModule, TooltipModule, BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { AutoCompleteModule, EditorModule, FileUploadModule as PrimeNgFileUploadModule, InputMaskModule, PaginatorModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { GWebsiteRoutingModule } from './gwebsite-routing.module';
import { QRCodeModule } from 'angularx-qrcode';

import { MenuClientComponent, CreateOrEditMenuClientModalComponent } from './index';
import { DemoModelComponent } from './demo-model/demo-model.component';
import { CreateOrEditDemoModelModalComponent } from './demo-model/create-or-edit-demo-model-modal.component';
import { CustomerComponent } from './customer/customer.component';
import { ViewCustomerModalComponent } from './customer/view-customer-modal.component';
import { CreateOrEditCustomerModalComponent } from './customer/create-or-edit-customer-modal.component';
import { DonViCungCapTaiSanComponent } from './don-vi-cung-cap-tai-san/don-vi-cung-cap-tai-san.component';
import { ViewDonViCungCapTaiSanModalComponent } from './don-vi-cung-cap-tai-san/view-don-vi-cung-cap-tai-san-modal.component';
import { CreateOrEditDonViCungCapTaiSanModalComponent } from './don-vi-cung-cap-tai-san/create-or-edit-don-vi-cung-cap-tai-san-modal.component';
import { PhongBanComponent } from './phong-ban/phong-ban.component';
import { ViewPhongBanModalComponent } from './phong-ban/view-phong-ban-modal.component';
import { CreateOrEditPhongBanModalComponent } from './phong-ban/create-or-edit-phong-ban-modal.component';
import { HoaDonNhapComponent } from './hoa-don-nhap/hoa-don-nhap.component';
import { CreateOrEditHoaDonNhapModalComponent } from './hoa-don-nhap/create-or-edit-hoa-don-nhap-modal.component';
import { ViewHoaDonNhapModalComponent } from './hoa-don-nhap/view-hoa-don-nhap-modal.component';
import { LoaiTaiSanComponent } from './loai-tai-san/loai-tai-san.component';
import { ViewLoaiTaiSanModalComponent } from './loai-tai-san/view-loai-tai-san-modal.component';
import { CreateOrEditLoaiTaiSanModalComponent } from './loai-tai-san/create-or-edit-loai-tai-san-modal.component';
import { BangYeuCauCungCapTaiSanComponent } from './bang-yeu-cau-cung-cap-tai-san/bang-yeu-cau-cung-cap-tai-san.component';
import { CreateOrEditBangYeuCauCungCapTaiSanModalComponent } from './bang-yeu-cau-cung-cap-tai-san/create-or-edit-bang-yeu-cau-cung-cap-tai-san-modal.component';
import { ViewBangYeuCauCungCapTaiSanModalComponent } from './bang-yeu-cau-cung-cap-tai-san/view-bang-yeu-cau-cung-cap-tai-san-modal.component';
import { TaiSanCoDinhComponent } from './tai-san-co-dinh/tai-san-co-dinh.component';
import { CreateOrEditTaiSanCoDinhModalComponent } from './tai-san-co-dinh/create-or-edit-tai-san-co-dinh-modal.component';
import { ViewTaiSanCoDinhModalComponent } from './tai-san-co-dinh/view-tai-san-co-dinh-modal.component';
import { PhieuBaoDuongComponent } from './phieu-bao-duong/phieu-bao-duong.component';
import { CreateOrEditPhieuBaoDuongModalComponent } from './phieu-bao-duong/create-or-edit-phieu-bao-duong-modal.component';
import { ViewPhieuBaoDuongModalComponent } from './phieu-bao-duong/view-phieu-bao-duong-modal.component';
import { BienBanThanhLyComponent } from './bien-ban-thanh-ly/bien-ban-thanh-ly.component';
import { CreateOrEditBienBanThanhLyModalComponent } from './bien-ban-thanh-ly/create-or-edit-bien-ban-thanh-ly-modal.component';
import { ViewBienBanThanhLyModalComponent } from './bien-ban-thanh-ly/view-bien-ban-thanh-ly-modal.component';
import { BienBanBanGiaoTaiSanComponent } from './bien-ban-ban-giao-tai-san/bien-ban-ban-giao-tai-san.component';
import { CreateOrEditBienBanBanGiaoTaiSanModalComponent } from './bien-ban-ban-giao-tai-san/create-or-edit-bien-ban-ban-giao-tai-san-modal.component';
import { ViewBienBanBanGiaoTaiSanModalComponent } from './bien-ban-ban-giao-tai-san/view-bien-ban-ban-giao-tai-san-modal.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        FileUploadModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        BsDatepickerModule.forRoot(),
        DatepickerModule.forRoot(),
        GWebsiteRoutingModule,
        UtilsModule,
        AppCommonModule,
        TableModule,
        PaginatorModule,
        PrimeNgFileUploadModule,
        AutoCompleteModule,
        EditorModule,
        InputMaskModule,
        QRCodeModule,
    ],
    declarations: [
        MenuClientComponent, CreateOrEditMenuClientModalComponent,
        DemoModelComponent, CreateOrEditDemoModelModalComponent, ViewDemoModelModalComponent,
        CustomerComponent, CreateOrEditCustomerModalComponent, ViewCustomerModalComponent,
        DonViCungCapTaiSanComponent, CreateOrEditDonViCungCapTaiSanModalComponent, ViewDonViCungCapTaiSanModalComponent,
        PhongBanComponent, CreateOrEditPhongBanModalComponent, ViewPhongBanModalComponent,
        HoaDonNhapComponent, CreateOrEditHoaDonNhapModalComponent, ViewHoaDonNhapModalComponent,
        LoaiTaiSanComponent, CreateOrEditLoaiTaiSanModalComponent, ViewLoaiTaiSanModalComponent,
        BangYeuCauCungCapTaiSanComponent, CreateOrEditBangYeuCauCungCapTaiSanModalComponent, ViewBangYeuCauCungCapTaiSanModalComponent,
        TaiSanCoDinhComponent, CreateOrEditTaiSanCoDinhModalComponent, ViewTaiSanCoDinhModalComponent,
        PhieuBaoDuongComponent, CreateOrEditPhieuBaoDuongModalComponent, ViewPhieuBaoDuongModalComponent,
        BienBanThanhLyComponent, CreateOrEditBienBanThanhLyModalComponent, ViewBienBanThanhLyModalComponent,
        BienBanBanGiaoTaiSanComponent, CreateOrEditBienBanBanGiaoTaiSanModalComponent, ViewBienBanBanGiaoTaiSanModalComponent,
    ],
    providers: [
        
        
    ]
})
export class GWebsiteModule { }
