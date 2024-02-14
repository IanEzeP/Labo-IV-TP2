import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/servicios/database.service';

@Component({
  selector: 'app-turnos-dia',
  templateUrl: './turnos-dia.component.html',
  styleUrls: ['./turnos-dia.component.css']
})
export class TurnosDiaComponent implements OnInit, OnDestroy{

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

      this.turnos = this.turnos.sort((a, b) => a.Fecha - b.Fecha);

      this.crearSeries();
    });
  }

  ngOnDestroy(): void 
  {
    this.observableTurnos.unsubscribe();
  }

  crearSeries()
  {
    let arrayDias : Array<any> = [];

    for (let i = 0; i < this.turnos.length; i++) {
      const element = this.turnos[i];
      
      if(arrayDias.includes(element.Dia))
      {
        this.series[arrayDias.indexOf(element.Dia)].y++;
      }
      else
      {
        arrayDias.push(element.Dia);
        this.series.push({ label: element.Dia, y: 1 });
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
    this.chart.chartContainerId = "chartTDias";

    this.chart.options.data[0].dataPoints = this.series; 
    
    this.chart.render();
  }

  chart : any;

  chartOptions = {
    title:{ text: "Cantidad de turnos por día" },
    animationEnabled: true,
    axisY: { title: "Turnos agendados"},
    data: [{        
      type: "column",
      dataPoints: [
      ]
    }]
  }	
}
