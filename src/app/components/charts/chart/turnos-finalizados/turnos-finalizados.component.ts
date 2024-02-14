import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/servicios/database.service';
import { GenerateFilesService } from 'src/app/servicios/generate-files.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-turnos-finalizados',
  templateUrl: './turnos-finalizados.component.html',
  styleUrls: ['./turnos-finalizados.component.css']
})
export class TurnosFinalizadosComponent implements OnInit, OnDestroy{

  observableTurnos = Subscription.EMPTY;
  turnos : Array<any> = [];
  arrayTurnosValidos : Array<any> = [];
  series : Array<any> = [];

  fechaDesde : Date = new Date();
  fechaHasta : Date = new Date();

  @ViewChild('chartContainer') chartContainer! : ElementRef;

  constructor(private data : DatabaseService, private file : GenerateFilesService) {}

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
        turno.Estado == 'Finalizado')
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
      const element = this.arrayTurnosValidos[i];
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
    title:{ text: "Cantidad de turnos finalizados por especialista" },
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

  public onPdfDownload()
  {
    html2canvas(this.chartContainer.nativeElement).then((canvas: { toDataURL: (arg0: string) => any; }) => 
    {
      let image : string = canvas.toDataURL('image/png');
      let fecha = new Date().toLocaleDateString();
      this.file.downloadPdfChart('Turnos finalizados en período de tiempo', 'turnos-especialista-finalizados_' + fecha, image);
    });
  }
}
