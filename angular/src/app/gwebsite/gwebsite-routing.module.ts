import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuClientComponent } from '@app/gwebsite/menu-client/menu-client.component';
import { MenuClientComponent as DepreciationComponent} from '@app/gwebsite/depreciation/depreciation.component';
import { DemoModelComponent } from './demo-model/demo-model.component';
import { CustomerComponent } from './customer/customer.component';

@NgModule({
    imports: [
        RouterModule.forChild([
        
            {
                path: '',
                children: [
                    {
                        path: 'depreciation', component: DepreciationComponent,
                        //data: { permission: 'Pages.Administration.Depreciation' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'demo-model', component: DemoModelComponent,
                        data: { permission: 'Pages.Administration.DemoModel' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'customer', component: CustomerComponent,
                        data: { permission: 'Pages.Administration.Customer' }
                    },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class GWebsiteRoutingModule { }
