import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FindOrganizationUnitAssetsInput, NameValueDto, OrganizationUnitServiceProxy, AssetsToOrganizationUnitInput } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { ModalDirective } from 'ngx-bootstrap';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { IAssetsWithOrganizationUnit } from './assets-with-organization-unit';

@Component({
    selector: 'placeAssetModal',
    templateUrl: './place-asset-modal.component.html'
})
export class PlaceAssetComponent extends AppComponentBase {

    organizationUnitId: number;

    @Output() assetPlaced: EventEmitter<IAssetsWithOrganizationUnit> = new EventEmitter<IAssetsWithOrganizationUnit>();

    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;

    isShown = false;
    filterText = '';
    tenantId?: number;
    saving = false;
    selectedMembers: NameValueDto[];

    constructor(
        injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy
    ) {
        super(injector);
    }

    show(): void {
        this.modal.show();
    }

    refreshTable(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    close(): void {
        this.modal.hide();
    }

    shown(): void {
        this.isShown = true;
        this.getRecordsIfNeeds(null);
    }

    getRecordsIfNeeds(event: LazyLoadEvent): void {
        if (!this.isShown) {
            return;
        }

        this.getRecords(event);
    }

    getRecords(event?: LazyLoadEvent): void {

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        const input = new FindOrganizationUnitAssetsInput();
        input.organizationUnitId = this.organizationUnitId;
        input.filter = this.filterText;
        input.skipCount = this.primengTableHelper.getSkipCount(this.paginator, event);
        input.maxResultCount = this.primengTableHelper.getMaxResultCount(this.paginator, event);

        this._organizationUnitService
            .findAssets(input)
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    placeAssetsToOrganizationUnit(): void {
        const input = new AssetsToOrganizationUnitInput();
        input.organizationUnitId = this.organizationUnitId;
        input.assetIds = _.map(this.selectedMembers, selectedMember => Number(selectedMember.value));
        this.saving = true;
        this._organizationUnitService
            .placeAssetsToOrganizationUnit(input)
            .subscribe(() => {
                this.notify.success(this.l('SuccessfullyAdded'));
                this.assetPlaced.emit({
                    assetIds: input.assetIds,
                    ouId: input.organizationUnitId
                });
                this.saving = false;
                this.close();
                this.selectedMembers = [];
            });
    }
}
