import { Component, Inject, PLATFORM_ID, AfterViewInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { LoanListComponent } from './loan-list.component';
import { LoanFormComponent } from './loan-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, LoanListComponent, LoanFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Loan Application';
  showLoanForm = false;

  @ViewChild(LoanListComponent) loanListComponent!: LoanListComponent;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      console.log('Running in browser (window is defined)');
      // Optionally, if you still want to load XML/XSLT transformation:
      // this.loadAndTransformXML();
    } else {
      console.log('Not running in browser; skipping XML transformation.');
    }
    console.log('ngAfterViewInit completed');
  }

  openLoanForm() {
    this.showLoanForm = true;
  }

  onFormClosed(refresh: boolean) {
    this.showLoanForm = false;
    if (refresh && this.loanListComponent) {
      console.log('Refreshing loan list...');
      this.loanListComponent.refresh();
    }
  }

  loadAndTransformXML() {
    console.log('Loading and transforming XML...');
    Promise.all([
      firstValueFrom(this.http.get('xml/loanApplication.xml', { responseType: 'text' })),
      firstValueFrom(this.http.get('xslt/loanApplication.xslt', { responseType: 'text' }))
    ]).then(([xmlString, xsltString]) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, 'text/xml');
      const xslt = parser.parseFromString(xsltString, 'text/xml');
      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xslt);
      const resultDocument = xsltProcessor.transformToFragment(xml, document);
      
      const outputDiv = document.getElementById('xslt-output');
      if (outputDiv) {
        outputDiv.innerHTML = '';
        outputDiv.appendChild(resultDocument);
      } else {
        console.error('Element with id "xslt-output" not found.');
      }
      console.log('Transformed XML:', resultDocument);
    }).catch(error => {
      console.error('Error loading or transforming XML:', error);
    });
  }
}
