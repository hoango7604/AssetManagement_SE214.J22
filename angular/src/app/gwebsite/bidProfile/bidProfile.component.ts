import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { CreateOrEditBidProfileModalComponent } from './create-or-edit-bidProfile-modal/create-or-edit-bidProfile-modal.component';
import { WebApiServiceProxy, IFilter } from '@shared/service-proxies/webapi.service';
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker';
import * as moment from 'moment';
import { ApprovalStatusEnum, BidTypeEnum, BidProfileTypeInfo } from './dto/bidProfile.dto';


@Component({
    selector: 'app-bidProfile',
    templateUrl: './bidProfile.component.html',
    styleUrls: ['./bidProfile.component.css'],
    animations: [appModuleAnimation()]
})
export class BidProfileComponent extends AppComponentBase implements AfterViewInit, OnInit {

    /**
     * @ViewChild là dùng get control và call thuộc tính, functions của control đó
     */
    @ViewChild('textsTable') textsTable: ElementRef;
    @ViewChild('createOrEditModal') createOrEditModal: CreateOrEditBidProfileModalComponent;
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;

    /**
     * tạo các biến dể filters
     */
    filterText: string;
    //permission cho duyệt, thêm, xóa, sửa: Admin và Department tạo bidProfile đó.
    // duyệt: chỉ mỗi Admin đc duyệt
    // sửa, đóng: department tạo ra bidProfile đó và Admin.
    // thêm: ai thêm cũng đc, ko phân quyền
    public isPermissionEditCloseActive = false;

    public approvalStatusEnum = ApprovalStatusEnum;
    public approvalStatus = 3; // all status
    public ApprovalStatusList = [
        {
            id: ApprovalStatusEnum.All,
            name: 'All'
        },
        {
            id: ApprovalStatusEnum.Approved,
            name: 'Approved'
        },
        {
            id: ApprovalStatusEnum.Awaiting,
            name: 'Awaiting'
        }
    ];

    public bidTypeEnum = BidTypeEnum;
    public bidType = 1;
    public bidTypes = [
        {
            id: BidTypeEnum.Bidding,
            name: 'Bidding'
        },
        {
            id: BidTypeEnum.AppointContractors,
            name: 'Appoint Contractors'
        }
    ];

    public createStartDatePickerOptions: IMyDpOptions = {
        selectorWidth: '240px',
        dateFormat: 'dd/mm/yyyy',
        showTodayBtn: true,
        todayBtnTxt: 'Now',
        showClearDateBtn: true,
        alignSelectorRight: true,
        openSelectorOnInputClick: true,
        inline: false,
        editableDateField: false,
        selectionTxtFontSize: '13px',
        height: '37px',
        firstDayOfWeek: 'su',
        sunHighlight: true,
        disableUntil: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate() - 1
        }
    };

    public createEndDatePickerOptions: IMyDpOptions = {
        selectorWidth: '240px',
        dateFormat: 'dd/mm/yyyy',
        showTodayBtn: true,
        todayBtnTxt: 'Now',
        showClearDateBtn: true,
        alignSelectorRight: true,
        openSelectorOnInputClick: true,
        inline: false,
        editableDateField: false,
        selectionTxtFontSize: '13px',
        height: '37px',
        firstDayOfWeek: 'su',
        sunHighlight: true,
        disableUntil: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate() - 1
        }
    };

    // public model: any = { date: { year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate() } };
    // public model = new Date();
    public startDateString = '';
    public endDateString = '';
    public bidProfileCodeFilter = '';
    public bidCatalogFilterId;
    public bidCatalogEditId;

    public bidProfileFakes = [
        {
            id: 1,
            code: 'S001',
            name: 'Purchase early in the year',
            bidCatalog: 'ProductCode1',
            startReceivedDate: '05/11/2018',
            endReceivedDate: '06/11/2018',
            projectCode: 'ProjectCode1',
            bidType: 1
        },
        {
            id: 2,
            code: 'S002',
            name: 'Purchase early in the year',
            bidCatalog: 'ProductCode1',
            startReceivedDate: '05/11/2018',
            endReceivedDate: '06/11/2018',
            projectCode: 'ProjectCode1',
            bidType: 2
        },
        {
            id: 3,
            code: 'S003',
            name: 'Purchase early in the year',
            bidCatalog: 'ProductCode1',
            startReceivedDate: '05/11/2018',
            endReceivedDate: '06/11/2018',
            projectCode: 'ProjectCode1',
            bidType: 1
        },
        {
            id: 3,
            code: 'S003',
            name: 'Purchase early in the year',
            bidCatalog: 'ProductCode1',
            startReceivedDate: '05/11/2018',
            endReceivedDate: '06/11/2018',
            projectCode: 'ProjectCode1',
            bidType: 1
        },
        {
            id: 4,
            code: 'S004',
            name: 'Purchase early in the year',
            bidCatalog: 'ProductCode1',
            startReceivedDate: '05/11/2018',
            endReceivedDate: '06/11/2018',
            projectCode: 'ProjectCode1',
            bidType: 2
        },
        {
            id: 5,
            code: 'S005',
            name: 'Purchase early in the year',
            bidCatalog: 'ProductCode1',
            startReceivedDate: '05/11/2018',
            endReceivedDate: '06/11/2018',
            projectCode: 'ProjectCode1',
            bidType: 1
        },
        {
            id: 6,
            code: 'S006',
            name: 'Purchase early in the year',
            bidCatalog: 'ProductCode1',
            startReceivedDate: '05/11/2018',
            endReceivedDate: '06/11/2018',
            projectCode: 'ProjectCode1',
            bidType: 2
        }
    ];

    //api 8.7, get all products có status=1(active hay open)
    public productInfos = [];
    public productFakes = [
        {
            id: 1,
            code: 'Pd01',
            name: 'Product1'
        },
        {
            id: 2,
            code: 'Pd02',
            name: 'Product1'
        },
        {
            id: 3,
            code: 'Pd03',
            name: 'Product1'
        },
        {
            id: 4,
            code: 'Pd04',
            name: 'Product1'
        },
        {
            id: 5,
            code: 'Pd05',
            name: 'Product1'
        },
        {
            id: 6,
            code: 'Pd06',
            name: 'Product1'
        }
    ];

    public oldObject = {};

    public myConfigStyleHeader: any = {
        'font-size': '11px'
    };
    public myConfigStyle: any = {
        'font-size': '11px'
    };
    public header;

    constructor(
        injector: Injector,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _apiService: WebApiServiceProxy
    ) {
        super(injector);
    }

    /**
     * Hàm xử lý trước khi View được init
     */
    ngOnInit(): void {
        this.isPermissionEditCloseActive = true;
        // call hàm này khi subcribe api 8.7 get all product success
        this.handelSelects();
    }

    /**
     * Hàm xử lý sau khi View được init
     */
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.init();
        });
    }

    public handelSelects(): void {
        // filter products
        this.productInfos = [];
        this.productFakes.forEach((item, i) => {
            this.productInfos.push(
                new BidProfileTypeInfo(item.id, `${item.code} - ${item.name}`));
        });
    }
    /**
     * Hàm get danh sách BidProfile
     * @param event
     */
    getBidProfiles(event?: LazyLoadEvent) {
        if (!this.paginator || !this.dataTable) {
            return;
        }

        //show loading trong gridview
        this.primengTableHelper.showLoadingIndicator();

        /**
         * Sử dụng _apiService để call các api của backend
         */

        // this._apiService.get('api/MenuClient/GetMenuClientsByFilter',
        //     [{ fieldName: 'Name', value: this.filterText }],
        //     this.primengTableHelper.getSorting(this.dataTable),
        //     this.primengTableHelper.getMaxResultCount(this.paginator, event),
        //     this.primengTableHelper.getSkipCount(this.paginator, event),
        // ).subscribe(result => {
        //     this.primengTableHelper.totalRecordsCount = result.totalCount;
        //     this.primengTableHelper.records = result.items;
        //     this.primengTableHelper.hideLoadingIndicator();
        // });

        this.primengTableHelper.totalRecordsCount = 16;
        this.primengTableHelper.records = this.bidProfileFakes;

        this.primengTableHelper.records.forEach((item) => {
            item.isEdit = false;
        });

        this.primengTableHelper.hideLoadingIndicator();
    }

    init(): void {
        //get params từ url để thực hiện filter
        this._activatedRoute.params.subscribe((params: Params) => {
            this.filterText = params['filterText'] || '';
            //reload lại gridview
            this.reloadPage();
        });
    }
    /**
     * onScrollX
     * @param event
     */
    public onScrollX(event): void {
        this.myConfigStyleHeader = {
            ...this.myConfigStyle,
            left: this.header ? `${this.header.getBoundingClientRect().left}px` : 'auto'
        };
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    applyFilters(): void {
        //truyền params lên url thông qua router
        this._router.navigate(['app/gwebsite/bidProfile', {
            filterText: this.filterText
        }]);

        if (this.paginator.getPage() !== 0) {
            this.paginator.changePage(0);
            return;
        }
    }

    /**
     * Tạo pipe thay vì tạo từng hàm truncate như thế này
     * @param text
     */
    truncateString(text): string {
        return abp.utils.truncateStringWithPostfix(text, 32, '...');
    }

    //Refresh grid khi thực hiện create or edit thành công
    refreshValueFromModal(): void {
        if (this.createOrEditModal.bidProfile.id) {
            for (let i = 0; i < this.primengTableHelper.records.length; i++) {
                if (this.primengTableHelper.records[i].id === this.createOrEditModal.bidProfile.id) {
                    this.primengTableHelper.records[i] = this.createOrEditModal.bidProfile;
                    return;
                }
            }
        } else { this.reloadPage(); }
    }

    //hàm show view create BidProfile
    createBidProfile() {
        this.createOrEditModal.show();
    }

    public searchBidProfile(): void {
        //3 params filter FE truyền vào api
        // filter, values default = ''
        console.log(this.approvalStatus + '--' + this.bidProfileCodeFilter + '--' + this.bidCatalogFilterId +
        '--' + this.bidType + '--' + this.startDateString + '--' + this.endDateString);
    }

    public onDateChangedByStart(event: IMyDateModel): void {
        const date = Object.assign({}, event);
        this.startDateString = date.jsdate ? moment(date.jsdate).format('YYYY-MM-DDTHH:mm:ss') : '';
    }
    public onDateChangedByEnd(event: IMyDateModel): void {
        const date = Object.assign({}, event);
        this.endDateString = date.jsdate ? moment(date.jsdate).format('YYYY-MM-DDTHH:mm:ss') : '';
    }

    public actionEdit(row: any, $event: Event): void {
        // $event.stopPropagation();
        this.oldObject['name'] = row.name;
        this.oldObject['bidCatalog'] = row.bidCatalog; // 1, 2, 3, ...
        this.oldObject['bidType'] = row.bidType; // 1, 2
        this.oldObject['projectCode'] = row.projectCode;
        this.oldObject['startReceivedDate'] = row.startReceivedDate;
        this.oldObject['endReceivedDate'] = row.endReceivedDate;

        this.bidCatalogEditId = 0;

        row.isEdit = true;
    }

    public saveEditItem(id: number, row: any, $event: Event): void {
        if (this.isPermissionEditCloseActive && row.name && row.name !== '') {

            // vì bên html đã tự bind [(ngModel)] vào row.name và row.note rồi, nên ở đây ta chỉ cần lấy ra giá trị để update
            console.log(id + '---' + row.name + '---' + row.unitPrice + '---' + row.calUnit + '---' + row.description);

           
            if (this.bidCatalogEditId !== 0) {
                row.bidCatalog = this.productFakes.find(x => +x.id === +this.bidCatalogEditId).code;


                //update TẠI ĐÂY với các params cần update là: row.name, row.bidCatalog
                // sau khi đã đc xử lý ở FE, e chỉ cần nhập mấy cái này là params đưa vào api là đc.
                //Hiện tại row.name, row.bidCatalog... đã mang giá trị mới, e chỉ cần gọi nó vào api update.

                
            }

            //save thành công
            row.isEdit = false;
        }

    }

    public cancelEdit(row: any, $event: Event): void {
        row.name = this.oldObject['name'];
        row.bidCatalog = this.oldObject['bidCatalog'];

        row.unitPrice = this.oldObject['unitPrice'];
        row.calUnit = this.oldObject['calUnit'];
        row.description = this.oldObject['description'];

        row.isEdit = false;
    }

    public actionPCItem(id: number, row: any): void {
        if (this.isPermissionEditCloseActive) {
            // dựa vào id, set status cho bidProfile là close nếu nó đang open và ngược lại.

            //sau khi set success
            row.status = row.status === ApprovalStatusEnum.Awaiting ? ApprovalStatusEnum.Approved : ApprovalStatusEnum.Awaiting;
        }
    }

    //chỉ những người có permission mới đc phép thực thi action với PC
    public removePcItem(id: number, row: any, index: number): void {
        if (this.isPermissionEditCloseActive) {
            this.primengTableHelper.records.splice(index, 1);
        }
        this.primengTableHelper.hideLoadingIndicator();
    }
}
