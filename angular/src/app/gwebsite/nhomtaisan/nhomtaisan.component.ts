import { ViewNhomTaiSanModalComponent } from './view-nhomtaisan-modal.component';
import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { NhomTaiSanServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditNhomTaiSanModalComponent } from './create-or-edit-nhomtaisan-modal.component';
import { SearchTaiSanComponent } from './search-taisan.component';

@Component({
    templateUrl: './nhomtaisan.component.html',
    animations: [appModuleAnimation()]
})
export class NhomTaiSanComponent extends AppComponentBase implements AfterViewInit, OnInit {

    /**
     * @ViewChild là dùng get control và call thuộc tính, functions của control đó
     */
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('createOrEditModal') createOrEditModal: CreateOrEditNhomTaiSanModalComponent;
    @ViewChild('viewNhomTaiSanModal') viewNhomTaiSanModal: ViewNhomTaiSanModalComponent;
    //@ViewChild('createOrEditSearchModal') searchTaiSanModal: SearchTaiSanComponent;
    /**
     * tạo các biến dể filters
     */
    tenNhomTaiSan: string;
    loaiTaiSan: string;
    soThangKhauHao: number;
    tyLeKhauHao: number;

    constructor(
        injector: Injector,
        private _nhomTaiSanService: NhomTaiSanServiceProxy,
        private _activatedRoute: ActivatedRoute,
    ) {
        super(injector);
        this.tenNhomTaiSan = null;
        this.loaiTaiSan = null;
        this.soThangKhauHao = null;
        this.tyLeKhauHao = null;
    }

    /**
     * Hàm xử lý trước khi View được init
     */
    ngOnInit(): void {
    }

    /**
     * Hàm xử lý sau khi View được init
     */
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.init();
        });
    }

    /**
     * Hàm get danh sách NhomTaiSan
     * @param event
     */
    getNhomTaiSan(event?: LazyLoadEvent) {
        if (!this.paginator || !this.dataTable) {
            return;
        }

        //show loading trong gridview
        this.primengTableHelper.showLoadingIndicator();

        /**
         * mặc định ban đầu lấy hết dữ liệu nên dữ liệu filter = null
         */

        this.reloadList(event);

    }

    reloadList(event?: LazyLoadEvent) {
        this._nhomTaiSanService.getNhomTaiSanByFilter(this.tenNhomTaiSan, this.loaiTaiSan, this.soThangKhauHao, this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event),
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    refreshList(event?: LazyLoadEvent) {
        this._nhomTaiSanService.getNhomTaiSanByFilter(null, null, null, this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event),
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    deleteNhomTaiSan(id): void {
        this._nhomTaiSanService.deleteNhomTaiSan(id).subscribe(() => {
            this.reloadPage();
        })
    }

    init(): void {
        //get params từ url để thực hiện filter
        this._activatedRoute.params.subscribe((params: Params) => {
            this.tenNhomTaiSan = params['tenNhomTaiSan'] || '';
            this.reloadList(null);
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    applyFilters(): void {
        //truyền params lên url thông qua router
        this.reloadList(null);

        if (this.paginator.getPage() !== 0) {
            this.paginator.changePage(0);
            return;
        }
    }

    //hàm show view create NhomTaiSan
    createNhomTaiSan() {
       this.createOrEditModal.show();
    }

    // searchTaiSan() {
    //     this.searchTaiSanModal.show();
    // }

    /**
     * Tạo pipe thay vì tạo từng hàm truncate như thế này
     * @param text
     */
    truncateString(text): string {
        return abp.utils.truncateStringWithPostfix(text, 32, '...');
    }
}
