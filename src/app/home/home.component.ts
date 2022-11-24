import { ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import * as Highcharts from 'highcharts';

import { dataList } from './../apiData';
import { MatDialog } from '@angular/material/dialog';
import { NewsComponent } from './news/news.component';
import { News } from './news/news.interface';

export interface NewsClassisfication {
  Title?: string;
  News?: string;
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
  worstNews: News = {};
  companyESG_flag: string = 'green';

  Environment_flag: string = 'green';
  Social_flag: string = 'green';
  Governance_flag: string = 'green';

  Environment_Environment_Flag: string = 'green';

  Social_Customers_Flag: string = 'green';
  Social_Human_Flag: string = 'green';
  Social_Labour_Flag: string = 'green';

  Governance_Governance_Flag: string = 'green';

  companyInfo: string = '';
  filteredOptions: any;
  showChart: boolean = false;
  result: NewsClassisfication[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  dataSource = this.result;
  selectedCompany: NewsClassisfication = { name: '' };
  myControl = new FormControl<string | NewsClassisfication>('');
  options: NewsClassisfication[] = this.rawDataList
    .filter((item: any) => item.ESG_RELEVANT)
    .filter(
      (
        value: NewsClassisfication,
        index: number,
        self: NewsClassisfication[]
      ) => index === self.findIndex((t) => t.name === value.name)
    )
    .map((item: NewsClassisfication) => {
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
    });

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
      text: 'Controversy State',
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
    // 'Title',
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
      text: 'Classification %',
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
        name: 'Controversy State',
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

  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );
  }

  onCompanySelect(event: Event, company: NewsClassisfication) {
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
    let newsList: NewsClassisfication[];

    this.companyInfo = '';
    this.companyESG_flag = this._getFlag(this.result);
    this.Environment_flag = this._getFlag(
      this.result.filter((item) => item.PILLAR == 'Environment')
    );
    this.Social_flag = this._getFlag(
      this.result.filter((item) => item.PILLAR == 'Social')
    );
    this.Governance_flag = this._getFlag(
      this.result.filter((item) => item.PILLAR == 'Governance')
    );

    this.Environment_Environment_Flag = this._getFlag(
      this.result
        .filter((item) => item.PILLAR == 'Environment')
        .filter((item) => item.SUB_PILLAR == 'Environment')
    );

    this.Social_Customers_Flag = this._getFlag(
      this.result
        .filter((item) => item.PILLAR == 'Social')
        .filter((item) => item.SUB_PILLAR == 'Customers')
    );
    this.Social_Human_Flag = this._getFlag(
      this.result
        .filter((item) => item.PILLAR == 'Social')
        .filter((item) => item.SUB_PILLAR == 'Human rights and community')
    );
    this.Social_Labour_Flag = this._getFlag(
      this.result
        .filter((item) => item.PILLAR == 'Social')
        .filter((item) => item.SUB_PILLAR == 'Labour rights and supply chain')
    );

    this.Governance_Governance_Flag = this._getFlag(
      this.result
        .filter((item) => item.PILLAR == 'Governance')
        .filter((item) => item.SUB_PILLAR == 'Governance')
    );

    this.Environment_Environment_Flag = newsList = this.rawDataList.filter(
      (item: NewsClassisfication) =>
        item.FLAG?.toLocaleLowerCase() ==
        this.companyESG_flag.toLocaleLowerCase()
    );

    this.worstNews = { title: newsList[0].Title, data: newsList[0].News };
    this.companyInfo = `Company <b>${this.selectedCompany.name} </b>  has scored  ESG Flag  <span style="background-color:${this.companyESG_flag}"> ${this.companyESG_flag} </span>`;
  }

  _getFlag(list: NewsClassisfication[]) {
    let flag = 'green';

    list.forEach((item) => {
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
    this.result = this.rawDataList.filter((item: NewsClassisfication) => {
      if (this.selectedCompany.name == 'Other' && item.name == null) {
        return true;
      } else {
        return item.name == this.selectedCompany.name;
      }
    });
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

  displayFn(Company: NewsClassisfication): string {
    return Company && Company.name ? Company.name : '';
  }

  private _filter(name: string): NewsClassisfication[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  openDialog(): void {
    if (this.worstNews.data) {
      const dialogRef = this.dialog.open(NewsComponent, {
        width: '250px',
        // data: { title: this.worstNews.title, data: this.worstNews.data },
        data: {
          title: this.worstNews.title,
          data: this.worstNews.data,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
    }
  }
}
