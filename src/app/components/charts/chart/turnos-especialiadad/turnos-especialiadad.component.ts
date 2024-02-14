import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/servicios/database.service';

@Component({
  selector: 'app-turnos-especialiadad',
  templateUrl: './turnos-especialiadad.component.html',
  styleUrls: ['./turnos-especialiadad.component.css']
})
export class TurnosEspecialiadadComponent implements OnInit, OnDestroy {

  observableTurnos = Subscription.EMPTY;
  turnos : Array<any> = [];
  series : Array<any> = [];

  constructor(private data : DatabaseService) {}

  ngOnInit(): void 
  {
    this.observableTurnos = this.data.getCollectionObservable("Turnos").subscribe((next : any) => 
    {
      this.turnos = [];
      let result : Array<any> = next;

      result.forEach(turno => 
      {
        this.turnos.push(turno);
      });

      this.crearSeries();
    });
  }

  ngOnDestroy(): void 
  {
    this.observableTurnos.unsubscribe();
  }

  crearSeries()
  {
    let arrayEspecialidades : Array<any> = [];

    for (let i = 0; i < this.turnos.length; i++) {
      const element = this.turnos[i];
      
      if(arrayEspecialidades.includes(element.Especialidad))
      {
        this.series[arrayEspecialidades.indexOf(element.Especialidad)].y++;
      }
      else
      {
        arrayEspecialidades.push(element.Especialidad);
        this.series.push({ label: element.Especialidad, y: 1 });
      }
    }

    console.log(this.series);

    this.updateChart();
  }

  getChartInstance(chart : Object)
  {
    this.chart = chart;
    this.updateChart();
  }

  updateChart()
  {
    this.chart.chartContainerId = "chartTEspecialidad";

    this.chart.options.data[0].dataPoints = this.series; 
    
    this.chart.render();
  }

  chart : any;

  chartOptions = {
    title:{ text: "Cantidad de turnos por especialidad" },
    animationEnabled: true,
    axisY: {
      title: "Turnos",
      interval: 1
    },
    data: [{        
      type: "bar",
      dataPoints: [
      ]
    }]
  }	
}
