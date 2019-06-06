
import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { WebApiServiceProxy, IFilter } from '@shared/service-proxies/webapi.service';
import { DemoModelServiceProxy, AssetLineServiceProxy, AssetLineDto } from '@shared/service-proxies/service-proxies';
import { ViewAssetLineModalComponent } from './view-asset-line-modal.component';
import { CreateOrEditAssetLineModalComponent } from './create-or-edit-asset-line-modal.component';

@Component({
    templateUrl: './asset-line.component.html',
    animations: [appModuleAnimation()]
})
export class AssetLineComponent extends AppComponentBase implements AfterViewInit {
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;
    @ViewChild('createOrEditModal') createOrEditModal: CreateOrEditAssetLineModalComponent;
    @ViewChild('viewModal') viewModal: ViewAssetLineModalComponent;
    filterTerm: string;

    constructor(
        injector: Injector,
        private _assetLineService: AssetLineServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _apiService: WebApiServiceProxy
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.init();
        });
    }
    init(): void {
        this._activatedRoute.params.subscribe((params: Params) => {
            this.filterTerm = params['term'] || '';
            this.reloadList(this.filterTerm, null);
        });
    }
    getAssetLines(event?: LazyLoadEvent) {
        if (!this.paginator || !this.dataTable) {
            return;
        }

        //show loading trong gridview
        this.primengTableHelper.showLoadingIndicator();

        /**
         * mặc định ban đầu lấy hết dữ liệu nên dữ liệu filter = null
         */

        this.reloadList(null, event);

    }


    reloadList(filterTerm, event?: LazyLoadEvent) {
        this._assetLineService.getByFilter(filterTerm, 0, 0, this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event),
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }
    createAssetLine() {
        this.createOrEditModal.show();
    }

    deleteAssetLine(id): void {
        this._assetLineService.delete(id).subscribe(() => {
            this.reloadPage();
        })
    }


    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    applyFilters(): void {
        this.reloadList(this.filterTerm, null);

        if (this.paginator.getPage() !== 0) {
            this.paginator.changePage(0);
            return;
        }
    }

    /**
    * @param text
    */
    truncateString(text): string {
        return abp.utils.truncateStringWithPostfix(text, 32, '...');
    }
}
