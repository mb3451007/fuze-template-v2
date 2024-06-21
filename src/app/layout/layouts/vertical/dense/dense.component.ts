import { NgIf,CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseConfig, FuseConfigService } from '@fuse/services/config';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'dense-layout',
    templateUrl  : './dense.component.html',
    styleUrls    : ['./dense.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [FuseLoadingBarComponent, FuseVerticalNavigationComponent, MatButtonModule, MatIconModule, LanguagesComponent, FuseFullscreenComponent, SearchComponent, ShortcutsComponent, MessagesComponent, NotificationsComponent, UserComponent, NgIf, RouterOutlet, QuickChatComponent,CommonModule,RouterModule],
})
export class DenseLayoutComponent implements OnInit, OnDestroy
{
    isHovered = false;
    isScreenSmall: boolean;
    navigation: Navigation;
    navigationAppearance: 'default' | 'dense' = 'dense';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isDarkModeOn: boolean = false;
    navigations: FuseNavigationItem[] = [
        // {
        //     id: 'home',
        //     title: 'Home',
        //     type: 'basic',
        //     link: '/home',
        //     icon: 'home' 
        // },
        {
            id: 'home',
            title: 'Home',
            type: 'basic',
            link: '/layout/homes',
            icon: 'homes', 
            exactMatch: true,
            isActiveMatchOptions: {
                queryParams: 'subset',
                matrixParams: 'subset',
                paths: 'subset',
                fragment: 'ignored'
            }

        },
        {
            id: 'archivio',
            title: 'Archivio',
            type: 'basic',
            link: '/archivio',
            icon: 'archivio' ,
            exactMatch: true,
        },
        {
            id: 'workspace',
            title: 'Workspace',
            type: 'basic', 
            link: '/workspace',
            icon: 'work-space' ,
            exactMatch: true,
        },
        {
            id: 'foglio',
            title: 'Foglio',
            type: 'basic',
            link: '/layout/foglio',
            icon: 'foglio' ,
            exactMatch: true,
        },
        {
            id: 'report',
            title: 'Report',
            type: 'basic',
            link: '/report',
            icon: 'reports' ,
            exactMatch: true,
        },
        {
            id: 'supporto',
            title: 'Supporto',
            type: 'basic',
            link: '/supporto',
            icon: 'supportto' ,
            exactMatch: true,
        },
      
    ];
    
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseConfigService:FuseConfigService,
        private router: Router, private renderer: Renderer2,
        // private sharedService: SharedService,
       
    )
    {
        this.currentPath=window.location.pathname;
        this.router.events.subscribe((event)=>{
            if(event instanceof NavigationEnd){
                this.currentPath=event.url;
            }
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }
    toggleSideNav: boolean = true;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._fuseNavigationService.toggle.subscribe(d => {
            this.toggleSideNav = d;
            console.log ('ddddddddddd', d)
        })
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) =>
            {
                this.navigation = navigation;
            });
// Example: Update navigation items if needed
this._fuseNavigationService.storeNavigation('mainNavigation', this.navigations);
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) =>
            {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');

                // Change the navigation appearance
                this.navigationAppearance = this.isScreenSmall ? 'default' : 'dense';
            });
            const darModePrefrence=localStorage.getItem('dark')==='true';
            this.isDarkModeOn=darModePrefrence;
            this.applyDarkMode(this.isDarkModeOn);
            this._fuseConfigService.config.subscribe((darkMode:any)=>{
            this.isDarkModeOn=darkMode;
            this.applyDarkMode(this.isDarkModeOn);
            })
           
              if(this.isDarkModeOn){
                document.body.classList.add('dark');
              }
              else{
                document.body.classList.add('light');
              }

            //   Sidebar
            this._fuseConfigService.config$.subscribe(d => {
                console.log ('ddddddddddddddddddddd', d)
                this.toggleSidebar(d.layout)
            })
            console.log ('url of active component', window.location.pathname)
            switch (window.location.pathname) {
                case '/home':
                case 'home':
                    this.openModal('home');
                    break;
                case '/archivio':
                case 'archivio':
                    this.openModal('archvio');
                    break;
                case '/workspace':
                case '/workspace':
                    this.openModal('Workspace');
                    break;
                case '/report':
                case 'report':
                    this.openModal('Report');
                    break;
                case '/supporto':
                case 'supporto':
                    this.openModal('Supporto');
                    break;
                case 'foglio':
                case '/foglio':
                    this.openModal('Foglio');
                    
            }
    }
   
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    /**
     * Toggle the navigation appearance
     */
    toggleNavigationAppearance(): void
    {
        this.navigationAppearance = (this.navigationAppearance === 'default' ? 'dense' : 'default');
    }
    // dense 
    scheme: 'dark' | 'light';
    
    
  
   
    toggleDropdown(id: string): void {
      const dropdown = document.getElementById(id);
      if (dropdown) {
          dropdown.classList.toggle('hidden');
      }
  }
  
  toggleDarkMode(event: Event): void {
    this.isDarkModeOn = (event.target as HTMLInputElement).checked;
    // localStorage.setItem('dark',this.isDarkModeOn.toString());
    localStorage.setItem('dark', String(this.isDarkModeOn));
    const scheme = this.isDarkModeOn ? 'dark' : 'light';
    this.setScheme(scheme);
    this.applyDarkMode(this.isDarkModeOn);
  }
  checkDarkModOn():boolean{
   return this.isDarkModeOn;
  }
  
  setScheme(scheme: string): void {
    console.log(`Scheme set to: ${scheme}`);
    this._fuseConfigService.config = { scheme };
  }
  
  // isInDarkMode(darkmode:boolean){
  //   this.isDarkModeOn=true;
  //   // this.isDarkModeOn=darkmode;
  // }
  applyDarkMode(isDarkModeOn:boolean){
    const scheme=isDarkModeOn? 'dark' : 'light' ;
    this.setScheme(scheme)
    if(isDarkModeOn){
      document.body.classList.add('dark')
      document.body.classList.remove('light')
    }
    else{
      document.body.classList.add('light')
      document.body.classList.remove('dark')
    }
  }
//   Sidebar

    currentPath:any;
    isDarkMode:boolean=false;
    isHomeVisible: boolean = false;
    isArchivioVisible: boolean = true;
    isWorkspaceVisible: boolean = true;
    isReportVisible: boolean = true;
    isSupportoVisible: boolean = true;
    isFoglioVisible: boolean = true;
    isModalVisible = false;
    clicked: boolean = false;
    config: FuseConfig;
    layout: string;



    toggle: boolean = false;

    toggleSidebar(layout) {

        var sidebars = document.querySelectorAll(
            '.sidebar,.dashboard-right'
        );
        sidebars.forEach(function (sidebar) {
            console.log ('inside11')
            if (layout === 'dense') {
                if (!sidebar.classList.contains('active'))
                    sidebar.classList.add('active');
            }
            else 
                sidebar.classList.remove('active');
        });
        
    }
    
    closeModal(): void {
        this.isModalVisible = true;
    }

    openModal(navlink: string) {
        this.isModalVisible = false;

        if (navlink === 'home') {
            this.isHomeVisible = false;
            this.isArchivioVisible = true;
            this.isWorkspaceVisible = true;
            this.isReportVisible = true;
            this.isSupportoVisible = true;
            this.isFoglioVisible = true;
            this.router.navigate(['/home']);
        }

        if (navlink === 'archvio') {
            this.isHomeVisible = true;
            this.isArchivioVisible = false;
            this.isWorkspaceVisible = true;
            this.isReportVisible = true;
            this.isSupportoVisible = true;
            this.isFoglioVisible = true;
            this.router.navigate(['/archivio']);
        }

        if (navlink === 'Workspace') {
            this.isHomeVisible = true;
            this.isArchivioVisible = true;
            this.isWorkspaceVisible = false;
            this.isReportVisible = true;
            this.isSupportoVisible = true;
            this.isFoglioVisible = true;
            this.router.navigate(['/workspace']);
        }

        if (navlink === 'Report') {
            this.isHomeVisible = true;
            this.isArchivioVisible = true;
            this.isWorkspaceVisible = true;
            this.isReportVisible = false;
            this.isSupportoVisible = true;
            this.isFoglioVisible = true;
            this.router.navigate(['/report']);
        }

        if (navlink === 'Supporto') {
            this.isHomeVisible = true;
            this.isArchivioVisible = true;
            this.isWorkspaceVisible = true;
            this.isReportVisible = true;
            this.isSupportoVisible = false;
            this.isFoglioVisible = true;
            this.router.navigate(['/supporto']);
        }
        if (navlink === 'Foglio') {
            this.isHomeVisible = true;
            this.isArchivioVisible = true;
            this.isWorkspaceVisible = true;
            this.isReportVisible = true;
            this.isSupportoVisible = true;
            this.isFoglioVisible = false;
            this.router.navigate(['/foglio']);
        }
    }

    homeVisible() {
        this.isHomeVisible = true;
        this.isArchivioVisible = false;
        this.isWorkspaceVisible = true;
        this.isReportVisible = true;
        this.isSupportoVisible = true;
        this.isFoglioVisible = true;
    }

    archivioVisible() {
        this.isHomeVisible = true;
        this.isArchivioVisible = true;
        this.isWorkspaceVisible = false;
        this.isReportVisible = true;
        this.isSupportoVisible = true;
        this.isFoglioVisible = true;
    }

    workspaceVisible() {
        this.isHomeVisible = true;
        this.isArchivioVisible = true;
        this.isWorkspaceVisible = true;
        this.isReportVisible = true;
        this.isSupportoVisible = true;
        this.isFoglioVisible = false;
    }

    reportVisible() {
        this.isHomeVisible = true;
        this.isArchivioVisible = true;
        this.isWorkspaceVisible = true;
        this.isReportVisible = true;
        this.isSupportoVisible = false;
        this.isFoglioVisible = true;
    }

    foglioVisible() {
        this.isHomeVisible = true;
        this.isArchivioVisible = true;
        this.isWorkspaceVisible = true;
        this.isReportVisible = false;
        this.isSupportoVisible = true;
        this.isFoglioVisible = true;
    }

    supportoVisible() {
        this.isModalVisible = true;
    }

    activeHome() {
        this.isHomeVisible = false;
        this.isArchivioVisible = true;
        this.isWorkspaceVisible = true;
        this.isReportVisible = true;
        this.isSupportoVisible = true;
        this.isFoglioVisible = true;
    }

    activeArchivio() {
        this.isHomeVisible = true;
        this.isArchivioVisible = false;
        this.isWorkspaceVisible = true;
        this.isReportVisible = true;
        this.isSupportoVisible = true;
        this.isFoglioVisible = true;
    }

    activeWorkspace() {
        this.isHomeVisible = true;
        this.isArchivioVisible = true;
        this.isWorkspaceVisible = false;
        this.isReportVisible = true;
        this.isSupportoVisible = true;
        this.isFoglioVisible = true;
    }

    activeReport() {
        this.isHomeVisible = true;
        this.isArchivioVisible = true;
        this.isWorkspaceVisible = true;
        this.isReportVisible = false;
        this.isSupportoVisible = true;
        this.isFoglioVisible = true;
    }

    activeFoglio() {
        this.isHomeVisible = true;
        this.isArchivioVisible = true;
        this.isWorkspaceVisible = true;
        this.isReportVisible = true;
        this.isSupportoVisible = true;
        this.isFoglioVisible = false;
    }

    activeSupporto() {
        this.isHomeVisible = true;
        this.isArchivioVisible = true;
        this.isWorkspaceVisible = true;
        this.isReportVisible = true;
        this.isSupportoVisible = false;
    }

    navigateToFoglio() {
        this.router.navigate(['/foglio']);
    }

    navigateTo(route: string): void {
        switch (route) {
            case 'home':
                this.router.navigate(['home']);
                break;
            case 'archivio':
                this.router.navigate(['archivio']);
                break;
            case 'workspace':
                this.router.navigate(['workspace']);
                break;
            case 'foglio':
                this.router.navigate(['foglio']);
                break;
            case 'report':
                this.router.navigate(['report']);
                break;
            case 'supporto':
                this.router.navigate(['supporto']);
                break;
            default:
                console.error(`Unknown route: ${route}`);
        }
    }
    
      isActive(route: string): boolean {
        return this.currentPath === route;        
      }
    // LayOut 
    layoutType = 'classic';
    setLayout(): void
    {
        if (this.layoutType=== 'classic')
            this.layoutType = 'dense';
        else
            this.layoutType = 'classic';

        const layout = this.layoutType;
        console.log("inside layout", layout);
        
        // Clear the 'layout' query param to allow layout changes
        this.router.navigate([], {
            queryParams        : {
                layout: null,
            },
            queryParamsHandling: 'merge',
        }).then(() =>
        {
            // Set the config
            this._fuseConfigService.config = {layout};
            console.log(layout, "this is latest layout");
            
            
        });
    }
    setHoverClass(){
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>('mainNavigation');
        if (navigation) {
            navigation.nativeElement.classList.toggle('fuse-vertical-navigation-hover');
        }
    }
    setLayouts(){
        this.isHovered=! this.isHovered;    }
}
