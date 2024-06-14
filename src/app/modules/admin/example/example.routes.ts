import { Routes } from '@angular/router';
import { FoglioComponent } from 'app/foglio/foglio.component';
import { HomeComponent } from 'app/home/home.component';
import { ExampleComponent } from 'app/modules/admin/example/example.component';

export default [
    {
        path     : '',
        component: ExampleComponent,
    },
    
] as Routes;
