import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as Highcharts from 'highcharts';

import { dataList } from './../apiData';

export interface Company {
  Title?: string;
  COMPANY_NAME?: string;
  ESG_RELEVANT?: Number;
  PERFORMANCE_INDICATOR?: string;
  SCALE?: string;
  NATURE_OF_HARM?: string;
  PILLAR?: string;
  SUB_PILLAR?: string;
  CONTROVERSY_ASSESSMENT?: string;
  STATUS?: string;
  INVOLVED?: string;
  FLAG?: string;
  name: string;
  FLAG_SCORE?: number;
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
  rawDataList: any = dataList;

  companyESG_flag: string = 'green';
  companyInfo: string = '';
  filteredOptions: any;
  showChart: boolean = false;
  result: Company[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  dataSource = this.result;
  selectedCompany: Company = { name: '' };
  myControl = new FormControl<string | Company>('');
  options: Company[] = this.rawDataList
    .map((item: Company) => {
      if (item.name == null) {
        item.name = 'Other';
      }
      if (item.COMPANY_NAME == null) {
        item.COMPANY_NAME = 'Other';
      }
      if (item.FLAG == null) {
        item.FLAG = 'Green';
        item.FLAG_SCORE = 9.0;
      }

      return item;
    })
    .filter(
      (value: Company, index: number, self: Company[]) =>
        index === self.findIndex((t) => t.name === value.name)
    );

  columnChartOptions = {
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
  column1ChartOptions = {
    chart: {
      renderTo: 'container',
      type: 'column',
      margin: [50, 50, 100, 80],
    },
    title: {
      text: 'Controversy',
    },
    xAxis: {
      categories: ['Red', 'Orange', 'Yellow', 'Green'],
    },
    yAxis: {
      min: 0,
      title: {
        text: 'No of Controversy',
      },
    },
    legend: {
      enabled: true,
    },
    series: [],
  } as any;

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

  pieChartOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    title: {
      text: 'ESG classification',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
      },
    },
    series: [
      {
        name: 'Controversy',
        colorByPoint: true,
        data: [
          {
            name: 'Red',
            y: 20,
            color: 'red',
          },
          {
            name: 'Orange',
            y: 15,
            color: 'orange',
          },
          {
            name: 'Yellow',
            y: 10,
            color: 'yellow',
          },
          {
            name: 'Green',
            y: 30,
            color: 'green',
          },
        ],
      },
    ],
  } as any;

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
    this._createInfo();
    // this.columnChartOptions.series =
    //   this._createColumnChart() as Highcharts.SeriesOptionsType[];
    this.column1ChartOptions.series = this._createColumn1Chart() as any[];
    this.pieChartOptions.series = this._createPieChart() as any[];

    this.changeDetectorRefs.detectChanges();

    setTimeout(() => {
      this.showChart = true;
    }, 0);
  }

  _createInfo() {
    this.companyInfo = '';
    this.companyESG_flag = this._getFlag();
    this.companyInfo = `<b>${this.selectedCompany.name} </b>  ESG Flag is ${this.companyESG_flag}`;
  }

  _getFlag() {
    let flag = 'green';

    this.result.forEach((item) => {
      if (item.FLAG?.toLowerCase() == 'red') {
        flag = 'red';
      } else if (
        item.FLAG?.toLowerCase() == 'orange' &&
        (flag == 'green' || flag == 'yellow')
      ) {
        flag = 'orange';
      } else if (item.FLAG?.toLowerCase() == 'yellow' && flag == 'green') {
        flag = 'yellow';
      }
    });

    return flag;
  }
  _createTable() {
    this.result = this.rawDataList.filter(
      (item: Company) => item.name == this.selectedCompany.name
    );
    this.dataSource = this.result;
  }

  _createColumnChart() {
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
  _createColumn1Chart() {
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
        name: 'Controversy',
        data: [
          { y: red, color: 'red' },
          { y: orange, color: 'orange' },
          { y: yellow, color: 'yellow' },
          { y: green, color: 'green' },
        ],
      },
    ];
  }

  _createPieChart() {
    let red: Number = this.result.filter(
      (x) => x.FLAG?.toLocaleLowerCase() == 'red'
    ).length;
    let orange: Number = this.result.filter(
      (x) => x.FLAG?.toLocaleLowerCase() == 'orange'
    ).length;
    let green: Number = this.result.filter(
      (x) => x.FLAG?.toLocaleLowerCase() == 'green'
    ).length;
    let yellow: Number = this.result.filter(
      (x) => x.FLAG?.toLocaleLowerCase() == 'yellow'
    ).length;
    return [
      {
        name: 'Controversy',
        colorByPoint: true,
        data: [
          {
            name: 'Red',
            y: red,
            color: 'red',
          },
          {
            name: 'Orange',
            y: orange,
            color: 'orange',
          },
          {
            name: 'Yellow',
            y: yellow,
            color: 'yellow',
          },
          {
            name: 'Green',
            y: green,
            color: 'green',
          },
        ],
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
