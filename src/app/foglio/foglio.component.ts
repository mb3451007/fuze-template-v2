import { Component, ViewChild , AfterViewInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { SpreadsheetAllModule, SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedService } from 'app/shared.service';

@Component({
  selector: 'app-foglio',
  standalone: true,
  templateUrl: './foglio.component.html',
  styleUrl: './foglio.component.scss',
  imports        : [SpreadsheetAllModule], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
})
export class FoglioComponent implements AfterViewInit{
  constructor(private sharedService:SharedService,private elementRef:ElementRef,private renderer:Renderer2){}
  @ViewChild('spreadsheet', { static: false }) spreadsheet: SpreadsheetComponent;

  ngOnInit() {
    // Listen for fullscreen change event
    this.renderer.listen(document, 'fullscreenchange', (event) => {
      this.fullscreenChangeHandler();
    });
  }
  ngAfterViewInit(): void {
    console.log('view has been initialize')
  }

  addSheet(): void {
    this.spreadsheet.insertSheet([{}]);
    this.spreadsheet.goTo(`${this.spreadsheet.sheets.length - 1}A1`); 
  }

  toggleFullScreen(): void {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  onCreated(): void {
    const icons = document.getElementsByClassName('e-drop-icon') as HTMLCollectionOf<HTMLElement>;
    icons[0].style.display = "none";

    this.spreadsheet.addToolbarItems('Home', [{ type: 'Button' }, { template: '<button id="add-new-btn" class="new-add-button btn-hvr"><img src="assets/images/plusicon.png"></button>'}], 0);
    this.spreadsheet.addToolbarItems('Home', [{ type: 'Button' }, { template: '<button id="save-without-icon" class="new-save-button btn-hvr" (click)="saveSheetsWithOutIcon()"><img src="assets/images/saveicon2.svg"></button>'}], 4);
    this.spreadsheet.addToolbarItems('Home', [{ type: 'Button' }, { template: '<button id="full-screen" class="full-screen-button btn-hvr" (click)="fullScreen()"><img src="assets/images/full-screen.svg"></button>'}], 8);
    document.getElementById('add-new-btn')?.addEventListener('click', this.addNewSheet.bind(this));
    document.getElementById('save-without-icon')?.addEventListener('click', this.onsave.bind(this));
    document.getElementById('full-screen')?.addEventListener('click',this.fullScreen.bind(this))
    this.spreadsheet.hideToolbarItems('Home', [0, 4, 8]);
  }
  onsave(): void {
    this.spreadsheet.save({
      fileName: 'SpreadsheetData.xlsx'
    });   
  }
  fullScreen(): void {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().then(() => this.sharedService.Fullscreen(true));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => this.sharedService.Fullscreen(false));
      }
    }
  }
    
  addNewSheet(): void {
    this.spreadsheet.insertSheet(this.spreadsheet.sheets.length);
  }

  fullscreenChangeHandler() { 
    if (document.fullscreenElement) {
    this.sharedService.Fullscreen(true);
    } else {
      this.sharedService.Fullscreen(false);
    }
  }

  // Method to request fullscreen
  requestFullscreen() {
    let element = this.elementRef.nativeElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  // Method to exit fullscreen
  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }
}                                                                                                                                          
