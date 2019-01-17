import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeResolverService } from './home.resolver.service';

// if this const gets too large, export it from a routs.ts file in this dir
export const editorRoutes: Routes = [
    { path: '', component: HomeComponent, resolve: { isLive: HomeResolverService } },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(editorRoutes),
        ClarityModule,
        SharedModule
    ],
    declarations: [
        HomeComponent
    ],
    providers: [
        HomeResolverService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    exports: [
        HomeComponent
    ]
})
export class HomeModule { }
