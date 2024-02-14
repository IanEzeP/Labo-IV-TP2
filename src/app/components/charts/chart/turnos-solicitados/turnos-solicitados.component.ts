import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/servicios/database.service';

@Component({
  selector: 'app-turnos-solicitados',
  templateUrl: './turnos-solicitados.component.html',
  styleUrls: ['./turnos-solicitados.component.css']
})
export class TurnosSolicitadosComponent implements OnInit, OnDestroy{
  
  observableTurnos = Subscription.EMPTY;
  turnos : Array<any> = [];
  arrayTurnosValidos : Array<any> = [];
  series : Array<any> = [];

  fechaDesde : Date = new Date();
  fechaHasta : Date = new Date();

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
    });
  }

  ngOnDestroy(): void 
  {
    this.observableTurnos.unsubscribe();
  }

  cambioFecha()
  {
    this.arrayTurnosValidos = [];
    let fechaStart = Date.parse(this.fechaDesde.toString());
    let fechaFinish = Date.parse(this.fechaHasta.toString());
    
    if(fechaStart && fechaFinish)
    {
      if(fechaStart > fechaFinish) 
      {
        fechaFinish = fechaStart;
      }

      this.turnos.forEach(turno => {

        if((turno.Fecha.seconds * 1000) >= fechaStart &&
        (turno.Fecha.seconds * 1000) <= fechaFinish &&
        (turno.Estado == 'Pendiente' || turno.Estado == 'Aceptado'))
        {
          this.arrayTurnosValidos.push(turno);
        }
      });

      console.log(this.arrayTurnosValidos);

      if(this.arrayTurnosValidos.length > 0)
      {
        this.crearSeries();
      }
    }
  }

  crearSeries()
  {
    this.series = [];
    let arrayEspec : Array<any> = [];

    for (let i = 0; i < this.arrayTurnosValidos.length; i++) 
    {
      const element = this.turnos[i];
      const nombre = this.data.getNameById(element.idEspecialista, 'Especialistas');
      
      if(arrayEspec.includes(nombre))
      {
        this.series[arrayEspec.indexOf(nombre)].y++;
      }
      else
      {
        arrayEspec.push(nombre);
        this.series.push({ label: nombre, y: 1 });
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
    this.chart.chartContainerId = "chartTEspecialista";

    this.chart.options.data[0].dataPoints = this.series; 
    
    this.chart.render();
  }

  chart : any;

  chartOptions = {
    title:{ text: "Cantidad de turnos por especialista" },
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
