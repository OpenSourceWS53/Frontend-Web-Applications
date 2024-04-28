import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Component, OnInit, ViewChild } from "@angular/core";
import { NgApexchartsModule } from "ng-apexcharts";
import { ChartComponent, ApexNonAxisChartSeries, ApexResponsive, ApexChart } from "ng-apexcharts";
import { MatCardModule } from '@angular/material/card';
import { CropsService } from "../../services/crops.service";
import { MatDialog } from '@angular/material/dialog';
import { ControlsToCropService } from "../../services/controls-to-crop.service";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-crops-statistics',
  templateUrl: './crops-statistics.component.html',
  styleUrls: ['./crops-statistics.component.css']
})
export class CropsStatisticsComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public controlChartOptions: Partial<ChartOptions>; // Nuevas opciones para el gráfico de controles
  public mostRegisteredCrop: string = '';
  public mostControlledCrop: string = '';

  constructor(private cropService: CropsService, private controlsService: ControlsToCropService) { // Inyecta ControlsToCropService
    this.chartOptions = {
      series: [],
      chart: {
        width: 500,
        type: "pie"
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };


    this.controlChartOptions = {
      series: [],
      chart: {
        width: 500,
        type: "pie" // Cambiado de "pie" a "bar"
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  private getAllCrops() {
    this.cropService.getAll().subscribe((response: any) => {
      const counts = response.reduce((acc: { [key: string]: number }, crop: any) => {
        acc[crop.name] = (acc[crop.name] || 0) + 1;
        return acc;
      }, {});

      this.chartOptions.labels = Object.keys(counts);
      this.chartOptions.series = Object.values(counts);

      let maxCount = Math.max(...this.chartOptions.series);
      let index = this.chartOptions.series.indexOf(maxCount);
      this.mostRegisteredCrop = this.chartOptions.labels[index];
    });
  };

  private getAllControls() {
    this.controlsService.getAll().subscribe((response: any) => {
      const counts = response.reduce((acc: { [key: string]: number }, control: any) => {
        acc[control.cropId] = (acc[control.cropId] || 0) + 1;
        return acc;
      }, {});

      this.controlChartOptions.labels = Object.keys(counts);
      this.controlChartOptions.series = Object.values(counts);

      let maxCount = Math.max(...this.controlChartOptions.series);
      let index = this.controlChartOptions.series.indexOf(maxCount);
      this.mostControlledCrop = this.controlChartOptions.labels[index];
    });
  };

  ngOnInit() {
    this.getAllCrops();
    this.getAllControls();
  }
}

@NgModule({
  declarations: [CropsStatisticsComponent],
  imports: [BrowserModule, NgApexchartsModule, MatCardModule],
  providers: [CropsService, ControlsToCropService],
  bootstrap: [CropsStatisticsComponent]
})
export class AppModule { }
