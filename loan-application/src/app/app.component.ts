import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Loan Application';
  xmlContent: string = '';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      console.log('Running in browser (window is defined)');
      this.loadAndTransformXML();
    } else {
      console.log('Not running in browser; skipping XML transformation.');
    }
    console.log('ngAfterViewInit completed');
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
        outputDiv.innerHTML = ''; // Clear previous content
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
