import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as Highcharts from 'highcharts';

// import * as companyinfo from 'testdata.json';

// const companyinfo: any = require('testdata.json');

export interface Company {
  Title?: string;
  ESG_RELEVANT?: Number;
  PERFORMANCE_INDICATOR?: Number;
  SCALE?: Number;
  NATURE_OF_HARM?: Number;
  PILLAR?: string;
  SUB_PILLAR?: string;
  CONTROVERSY_ASSESSMENT?: 4;
  STATUS?: Number;
  INVOLVED?: Number;
  FLAG?: string;
  name: string;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  filteredOptions: any;
  showChart: boolean = false;
  result: Company[] = [];
  testData: any = [
    {
      Title: 'Home Depot workers petition to form 1st store-wide union',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Discrimination and workforce diversity',
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Medium',
      COMPANY_NAME: 'AP',
      PILLAR: 'Social',
      SUB_PILLAR: 'Labour rights and supply chain',
      CONTROVERSY_ASSESSMENT: 4.0,
      STATUS: 'Ongoing',
      INVOLVED: 'Direct',
      FLAG: 'Yellow',
      FLAG_SCORE: 4.0,
      name: 'AP',
    },
    {
      Title:
        'S/African court freezes pension payment for graft-accused lottery chief',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Governance Structures',
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Serious',
      COMPANY_NAME: 'APA-Johannesburg (South Africa',
      PILLAR: 'Governance',
      SUB_PILLAR: 'Governance',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Concluded',
      INVOLVED: 'Direct',
      FLAG: 'Yellow',
      FLAG_SCORE: 3.0,
      name: 'APA-Johannesburg (South Africa',
    },
    {
      Title:
        'CT\u00e2\u20ac\u2122s big hospital systems are buying up private practices and small hospitals. What does that mean?',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: null,
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Medium',
      COMPANY_NAME: 'Yale New Haven',
      PILLAR: 'Governance',
      SUB_PILLAR: 'Governance',
      CONTROVERSY_ASSESSMENT: 4.0,
      STATUS: 'Concluded',
      INVOLVED: 'Indirect',
      FLAG: 'Green',
      FLAG_SCORE: 7.0,
      name: 'Yale New Haven',
    },
    {
      Title:
        'Here are the Trump properties at the center of the New York attorney general\u00e2\u20ac\u2122s lawsuit against the former President and his family',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Governance Structures',
      SCALE: 'Minor',
      NATURE_OF_HARM: 'Medium',
      COMPANY_NAME: 'CNN',
      PILLAR: 'Governance',
      SUB_PILLAR: 'Governance',
      CONTROVERSY_ASSESSMENT: 6.0,
      STATUS: 'Ongoing',
      INVOLVED: 'Direct',
      FLAG: 'Green',
      FLAG_SCORE: 6.0,
      name: 'CNN',
    },
    {
      Title: 'Louisiana regulators approve 475 MW Entergy solar plan',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Water stress',
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Medium',
      COMPANY_NAME: 'MW for Entergy',
      PILLAR: 'Environment',
      SUB_PILLAR: 'Environment',
      CONTROVERSY_ASSESSMENT: 4.0,
      STATUS: 'Concluded',
      INVOLVED: 'Direct',
      FLAG: 'Green',
      FLAG_SCORE: 6.0,
      name: 'MW for Entergy',
    },
    {
      Title:
        "DeSANTIS DEFIANT: Gov Shreds Vineyard Lawsuit, 'Migrants Treated Horribly by Biden'",
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Collective bargaining and Union',
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Serious',
      COMPANY_NAME: 'The New York Post',
      PILLAR: 'Social',
      SUB_PILLAR: 'Labour rights and supply chain',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Ongoing',
      INVOLVED: 'Indirect',
      FLAG: 'Yellow',
      FLAG_SCORE: 2.0,
      name: 'The New York Post',
    },
    {
      Title: 'Hyundai, Kia Sued in Rash of Car Thefts',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Other-customers',
      SCALE: 'Very severe',
      NATURE_OF_HARM: 'Medium',
      COMPANY_NAME: 'Kia',
      PILLAR: 'Social',
      SUB_PILLAR: 'Customers',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Partially concluded',
      INVOLVED: 'Indirect',
      FLAG: 'Yellow',
      FLAG_SCORE: 3.0,
      name: 'Kia',
    },
    {
      Title: 'Strike: ASUU to Appeal Court Order, File Stay of Execution',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Health and safety',
      SCALE: 'Moderate',
      NATURE_OF_HARM: 'Minimal',
      COMPANY_NAME: 'The Academic Staff Union of Universities',
      PILLAR: 'Social',
      SUB_PILLAR: 'Labour rights and supply chain',
      CONTROVERSY_ASSESSMENT: 6.0,
      STATUS: 'Concluded',
      INVOLVED: 'Direct',
      FLAG: 'Green',
      FLAG_SCORE: 8.0,
      name: 'The Academic Staff Union of Universities',
    },
    {
      Title:
        'LMD penalizes Importer-Company of Spare-Parts for violation of rules',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Privacy and data security',
      SCALE: 'Moderate',
      NATURE_OF_HARM: 'Medium',
      COMPANY_NAME: 'ATV',
      PILLAR: 'Social',
      SUB_PILLAR: 'Customers',
      CONTROVERSY_ASSESSMENT: 6.0,
      STATUS: 'Concluded',
      INVOLVED: 'Indirect',
      FLAG: 'Green',
      FLAG_SCORE: 9.0,
      name: 'ATV',
    },
    {
      Title:
        'Philadelphia, residents file separate lawsuits against owners of building that partially collapsed',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Privacy and data security',
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Serious',
      COMPANY_NAME: 'WPVI',
      PILLAR: 'Social',
      SUB_PILLAR: 'Customers',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Ongoing',
      INVOLVED: 'Indirect',
      FLAG: 'Yellow',
      FLAG_SCORE: 2.0,
      name: 'WPVI',
    },
    {
      Title:
        'Optus cyber attack: Massive data breach affects millions of customers\u00e2\u20ac\u2122 personal information',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Marketing and advertising',
      SCALE: 'Very severe',
      NATURE_OF_HARM: 'Serious',
      COMPANY_NAME: 'Optus',
      PILLAR: 'Social',
      SUB_PILLAR: 'Customers',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Partially concluded',
      INVOLVED: 'Indirect',
      FLAG: 'Yellow',
      FLAG_SCORE: 3.0,
      name: 'Optus',
    },
    {
      Title: 'Telco giant Optus hit by cyberattack',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Marketing and advertising',
      SCALE: 'Very severe',
      NATURE_OF_HARM: 'Serious',
      COMPANY_NAME: 'Optus',
      PILLAR: 'Social',
      SUB_PILLAR: 'Customers',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Concluded',
      INVOLVED: 'Direct',
      FLAG: 'Yellow',
      FLAG_SCORE: 3.0,
      name: 'Optus',
    },
    {
      Title:
        'App Tracking Transparency workaround sees Meta face class action lawsuit',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Marketing and advertising',
      SCALE: 'Very severe',
      NATURE_OF_HARM: 'Serious',
      COMPANY_NAME: 'Meta',
      PILLAR: 'Social',
      SUB_PILLAR: 'Customers',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Ongoing',
      INVOLVED: 'Indirect',
      FLAG: 'Yellow',
      FLAG_SCORE: 2.0,
      name: 'Meta',
    },
    {
      Title:
        'La Porte ISD employee caught on camera berating high school student',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Collective bargaining and Union',
      SCALE: 'Minor',
      NATURE_OF_HARM: 'Medium',
      COMPANY_NAME: 'La Porte',
      PILLAR: 'Social',
      SUB_PILLAR: 'Labour rights and supply chain',
      CONTROVERSY_ASSESSMENT: 6.0,
      STATUS: 'Partially concluded',
      INVOLVED: 'Indirect',
      FLAG: 'Green',
      FLAG_SCORE: 8.0,
      name: 'La Porte',
    },
    {
      Title:
        "Employees strike due to 'poor working conditions' at Fresno County Sunnyside Convalescent Hospital",
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Discrimination and workforce diversity',
      SCALE: 'Very severe',
      NATURE_OF_HARM: 'Serious',
      COMPANY_NAME: 'the Sunnyside Convalescent Hospital',
      PILLAR: 'Social',
      SUB_PILLAR: 'Labour rights and supply chain',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Ongoing',
      INVOLVED: 'Indirect',
      FLAG: 'Yellow',
      FLAG_SCORE: 2.0,
      name: 'the Sunnyside Convalescent Hospital',
    },
    {
      Title: 'American Airlines Discloses Customer Data Breach',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Health and safety',
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Serious',
      COMPANY_NAME: 'American Airlines',
      PILLAR: 'Social',
      SUB_PILLAR: 'Labour rights and supply chain',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Concluded',
      INVOLVED: 'Indirect',
      FLAG: 'Yellow',
      FLAG_SCORE: 4.0,
      name: 'American Airlines',
    },
    {
      Title: '9/22/2006: CR Airways Rebrands as Hong Kong Airlines',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Health and safety',
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Serious',
      COMPANY_NAME: 'Hong Kong Airlines',
      PILLAR: 'Social',
      SUB_PILLAR: 'Labour rights and supply chain',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Ongoing',
      INVOLVED: 'Direct',
      FLAG: 'Orange',
      FLAG_SCORE: 1.0,
      name: 'Hong Kong Airlines',
    },
    {
      Title:
        'Nigeria: Swiss-Based AOG Funded Joint Accounts With Nigerian Politicians, Others',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Governance Structures',
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Serious',
      COMPANY_NAME: 'Suisse Secrets',
      PILLAR: 'Governance',
      SUB_PILLAR: 'Governance',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Concluded',
      INVOLVED: 'Indirect',
      FLAG: 'Yellow',
      FLAG_SCORE: 4.0,
      name: 'Suisse Secrets',
    },
    {
      Title:
        'Tether: Bitcoin inflation probe takes new turn; can USDT withstand the pressure',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Governance Structures',
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Serious',
      COMPANY_NAME: 'Bitfinex',
      PILLAR: 'Governance',
      SUB_PILLAR: 'Governance',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Ongoing',
      INVOLVED: 'Direct',
      FLAG: 'Orange',
      FLAG_SCORE: 1.0,
      name: 'Bitfinex',
    },
    {
      Title: 'Facebook sued over illegal collection of user data',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Marketing and advertising',
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Serious',
      COMPANY_NAME: 'AppleInsider',
      PILLAR: 'Social',
      SUB_PILLAR: 'Customers',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Concluded',
      INVOLVED: 'Indirect',
      FLAG: 'Yellow',
      FLAG_SCORE: 4.0,
      name: 'AppleInsider',
    },
    {
      Title: 'Facebook sued over illegal collection of user data',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Marketing and advertising',
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Serious',
      COMPANY_NAME: 'Trump',
      PILLAR: 'Social',
      SUB_PILLAR: 'Customers',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Concluded',
      INVOLVED: 'Indirect',
      FLAG: 'Yellow',
      FLAG_SCORE: 4.0,
      name: 'Trump',
    },
    {
      Title:
        'Tether: Bitcoin inflation probe takes new turn; can USDT withstand the pressure',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: 'Governance Structures',
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Serious',
      COMPANY_NAME: 'Trump',
      PILLAR: 'Governance',
      SUB_PILLAR: 'Governance',
      CONTROVERSY_ASSESSMENT: 1.0,
      STATUS: 'Ongoing',
      INVOLVED: 'Direct',
      FLAG: 'Orange',
      FLAG_SCORE: 1.0,
      name: 'Trump',
    },
    {
      Title:
        'CT\u00e2\u20ac\u2122s big hospital systems are buying up private practices and small hospitals. What does that mean?',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: null,
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Medium',
      COMPANY_NAME: 'Trump',
      PILLAR: 'Social',
      SUB_PILLAR: 'Customers',
      CONTROVERSY_ASSESSMENT: 4.0,
      STATUS: 'Ongoing',
      INVOLVED: 'Indirect',
      FLAG: 'Green',
      FLAG_SCORE: 7.0,
      name: 'Trump',
    },
    {
      Title:
        'CT\u00e2\u20ac\u2122s big hospital systems are buying up private practices and small hospitals. What does that mean?',
      ESG_RELEVANT: 1,
      PERFORMANCE_INDICATOR: null,
      SCALE: 'Severe',
      NATURE_OF_HARM: 'Medium',
      COMPANY_NAME: 'Trump',
      PILLAR: 'Governance',
      SUB_PILLAR: 'Governance',
      CONTROVERSY_ASSESSMENT: 4.0,
      STATUS: 'Ongoing',
      INVOLVED: 'Indirect',
      FLAG: 'Green',
      FLAG_SCORE: 7.0,
      name: 'Trump',
    },
  ];

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Controversy chart',
    },

    xAxis: {
      categories: ['Total'],
      title: {
        useHTML: true,
        text: 'Controvery flag',
      },
      crosshair: true,
    },
    yAxis: {
      title: {
        useHTML: true,
        text: 'Number of controvery',
      },
    },
    // tooltip: {
    //   headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    //   pointFormat:
    //     '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
    //     '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
    //   footerFormat: '</table>',
    //   shared: true,
    //   useHTML: true,
    // },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [] as Highcharts.SeriesOptionsType[],
  };

  displayedColumns: string[] = [
    // 'name',
    // 'ESG_RELEVANT',
    'PILLAR',
    'SUB_PILLAR',
    'PERFORMANCE_INDICATOR',
    'NATURE_OF_HARM',
    'SCALE',
    'CONTROVERSY_ASSESSMENT',
    'STATUS',
    'INVOLVED',
    'FLAG',
  ];
  dataSource = this.result;
  selectedCompany: Company = { name: '' };
  myControl = new FormControl<string | Company>('');
  options: Company[] = this.testData;

  constructor(private changeDetectorRefs: ChangeDetectorRef) {}

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );
  }

  onCompanySelect(event: Event, company: Company) {
    this.showChart = false;
    this.result = [];
    this.selectedCompany = company;
    this._createTable();
    this.chartOptions.series =
      this._createChart() as Highcharts.SeriesOptionsType[];

    this.dataSource = this.result;
    this.changeDetectorRefs.detectChanges();

    setTimeout(() => {
      this.showChart = true;
    }, 0);
  }

  _createTable() {
    this.result = this.testData.filter(
      (item: Company) => item.name == this.selectedCompany.name
    );
  }

  _createChart() {
    let list: Highcharts.SeriesOptionsType[] = [];
    let red = this.result.filter(
      (x) => x.FLAG?.toLocaleLowerCase() == 'red'
    ).length;
    let orange = this.result.filter(
      (x) => x.FLAG?.toLocaleLowerCase() == 'orange'
    ).length;
    let green = this.result.filter(
      (x) => x.FLAG?.toLocaleLowerCase() == 'green'
    ).length;
    let yellow = this.result.filter(
      (x) => x.FLAG?.toLocaleLowerCase() == 'yellow'
    ).length;

    return [
      {
        type: 'column',
        name: 'Red',
        data: [red],
      },
      {
        type: 'column',
        name: 'Orange',
        data: [orange],
      },
      {
        type: 'column',
        name: 'Yellow',
        data: [yellow],
      },
      {
        type: 'column',
        name: 'Green',
        data: [green],
      },
    ];
  }

  displayFn(Company: Company): string {
    return Company && Company.name ? Company.name : '';
  }

  private _filter(name: string): Company[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
}
