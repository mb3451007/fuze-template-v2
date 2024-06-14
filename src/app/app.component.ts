import { ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { SpreadsheetModule } from '@syncfusion/ej2-angular-spreadsheet';
import { SharedService } from './shared.service';
import { Subscription } from 'rxjs/internal/Subscription';


import { CommonModule, DOCUMENT } from '@angular/common';
import { FuseConfig, FuseConfigService } from '@fuse/services/config';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FUSE_VERSION } from '@fuse/version';
import { FusePlatformService } from '@fuse/services/platform';
import { Observable, ObservableInputTuple } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
// 
import { combineLatest, filter, map, Subject, takeUntil } from 'rxjs';
import { DenseLayoutComponent } from "./layout/layouts/vertical/dense/dense.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        RouterOutlet,
        SpreadsheetModule,
        CommonModule,
        DenseLayoutComponent
    ]
})
export class AppComponent implements OnInit {
    constructor(private sharedService: SharedService,
     private changeDetector: ChangeDetectorRef,private _fuseConfigService :FuseConfigService, 
     private _fuseMediaWatcherService:FuseMediaWatcherService,private _router: Router,
     private _renderer2: Renderer2,@Inject(DOCUMENT) private _document: any,
     private _fusePlatformService: FusePlatformService,private _activatedRoute: ActivatedRoute,
    ) {}
     private _unsubscribeAll: Subject<any> = new Subject<any>();
    isDarkMode:boolean=false;
    isFullscreen = false;
    applicationFullscreen: boolean;
    showSideBar: boolean = true;
    toggleSideBar: boolean = false;
    scheme: 'dark' | 'light';
    theme: string;
    config: FuseConfig;
    layout: string= 'classic';
    ngOnInit(): any {
        if (window.location.pathname.indexOf('auth') >= 0) {
            this.showSideBar = false;
        }
        this.sharedService.fullscreenState$.subscribe((isFullscreen) => {
            this.isFullscreen = isFullscreen;
        });
     

        this.sharedService.toggleSideBar.subscribe((v: any) => { 
            this.toggleSideBar = v;
            console.log ('yesssss', this.toggleSideBar)
            this.changeDetector.detectChanges();
        })

        // Layouuuuuuuttt


            // Set the theme and scheme based on the configuration
         combineLatest([
                this._fuseConfigService.config$,
                this._fuseMediaWatcherService.onMediaQueryChange$([
                    '(prefers-color-scheme: dark)',
                    '(prefers-color-scheme: light)',
                ]),
            ])
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    map(([config, mql]) => {
                        const options = {
                            scheme: config.scheme,
                            theme: config.theme,
                        };
    
                        // If the scheme is set to 'auto'...
                        if (config.scheme === 'auto') {
                            // Decide the scheme using the media query
                            options.scheme = mql.breakpoints[
                                '(prefers-color-scheme: dark)'
                            ]
                                ? 'dark'
                                : 'light';
                        }
    
                        return options;
                    })
                )
                .subscribe((options) => {
                    // Store the options
                    this.scheme = options.scheme;
                    this.theme = options.theme;
    
                    // Update the scheme and theme
                    this._updateScheme();
                    this._updateTheme();
                });
    
            // Subscribe to config changes
            this._fuseConfigService.config$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((config: FuseConfig) => {
                    // Store the config
                    this.config = config;
    
                    // Update the layout
                    this._updateLayout();
                });
    
            // Subscribe to NavigationEnd event
            this._router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    takeUntil(this._unsubscribeAll)
                )
                .subscribe(() => {
                    // Update the layout
                    this._updateLayout();
                });
    
            // Set the app version
            this._renderer2.setAttribute(
                this._document.querySelector('[ng-version]'),
                'fuse-version',
                FUSE_VERSION
            );
    
            // Set the OS name
            this._renderer2.addClass(
                this._document.body,
                this._fusePlatformService.osName
            );
        }
        private _updateScheme(): void {
            // Remove class names for all schemes
            this._document.body.classList.remove('light', 'dark');
    
            // Add class name for the currently selected scheme
            this._document.body.classList.add(this.scheme);
        }


        private _updateTheme(): void {
            // Find the class name for the previously selected theme and remove it
            this._document.body.classList.forEach((className: string) => {
                if (className.startsWith('theme-')) {
                    this._document.body.classList.remove(
                        className,
                        className.split('-')[1]
                    );
                }
            });
    
            // Add class name for the currently selected theme
            this._document.body.classList.add(this.theme);
        }

    

        private _updateLayout(): void {
            // Get the current activated route
            let route = this._activatedRoute;
            while (route.firstChild) {
                route = route.firstChild;
            }
    
            // 1. Set the layout from the config
            this.layout = this.config.layout;
            console.log ('layoutttt', this.layout)
    
            // 2. Get the query parameter from the current route and
            // set the layout and save the layout to the config
            const layoutFromQueryParam = route.snapshot.queryParamMap.get('layout');
            if (layoutFromQueryParam) {
                this.layout = layoutFromQueryParam;
                if (this.config) {
                    this.config.layout = layoutFromQueryParam;
                }
            }
    
            // 3. Iterate through the paths and change the layout as we find
            // a config for it.
            //
            // The reason we do this is that there might be empty grouping
            // paths or componentless routes along the path. Because of that,
            // we cannot just assume that the layout configuration will be
            // in the last path's config or in the first path's config.
            //
            // So, we get all the paths that matched starting from root all
            // the way to the current activated route, walk through them one
            // by one and change the layout as we find the layout config. This
            // way, layout configuration can live anywhere within the path and
            // we won't miss it.
            //
            // Also, this will allow overriding the layout in any time so we
            // can have different layouts for different routes.
            const paths = route.pathFromRoot;
            paths.forEach((path) => {
                // Check if there is a 'layout' data
                if (
                    path.routeConfig &&
                    path.routeConfig.data &&
                    path.routeConfig.data.layout
                ) {
                    // Set the layout
                    this.layout = path.routeConfig.data.layout;
                    console.log ('layouttt2222', this.layout)
                }
            });
        }

    }


