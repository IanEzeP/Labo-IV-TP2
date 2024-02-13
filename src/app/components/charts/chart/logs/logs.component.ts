import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { Subscription } from 'rxjs';
import { CanvasJSChart } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})

export class LogsComponent implements OnInit, OnDestroy {

  observableLogs = Subscription.EMPTY;
  logs : Array<any> = [];
  totalEntries : number = 0;

  logueos : Array<any> = [];
  series : Array<any> = [];
  usuarios : Array<any> = [];

  constructor (private data: DatabaseService, private alertas: AlertasService) {}

  ngOnInit(): void 
  {
    this.observableLogs = this.data.getCollectionObservable('Logs').subscribe((next : any) =>
    {
      this.logs = [];
      let result : Array<any> = next;

      result.forEach(log =>
      {
        let date = new Date(log.Date.seconds * 1000);
        let newLog = {
          Usuario: log.User,
          Fecha: date.toLocaleDateString(),
          Hora: `${date.getHours()}:${date.getMinutes()}`,
          Seconds: Date.parse(date.toString()),
          FullDate: date
        }
        this.logs.push(newLog);
      });
      
      this.logs = this.logs.sort((a, b) => b.Seconds - a.Seconds);
      console.log(this.logs);
      this.totalEntries = this.logs.length;

      this.crearSeries();
    });
  }

  ngOnDestroy(): void 
  {
    this.observableLogs.unsubscribe();
  }

  crearSeries()
  {
    let auxLogs = Array().concat(this.logs);
    let j = 0;
    for(let y = 0; y < this.totalEntries; y++)
    {
      for(let i = 0; i < auxLogs.length; i++)
      {
        if(auxLogs[i])
        {
          if(this.logs[y].Usuario == auxLogs[i].Usuario && this.logs[y].Fecha == auxLogs[i].Fecha)
          {  
            if(this.logueos[j])
            {
              this.logueos[j].Sessions++;
            }
            else
            {
              this.logueos.push({ User: auxLogs[i].Usuario, Date: auxLogs[i].FullDate, Sessions: 1});
            }
            auxLogs[i] = null;
          }
        } 
      }

      if(this.logueos[j])
      {
        j++;
      }
    };
    console.log(this.logueos);

    this.usuarios = this.crearListaNombres();

    this.graficarSeries();
  }

  crearListaNombres()
  {
    let arrayNombres : Array<string> = [];

    this.logueos.forEach(logueo => {

    if(arrayNombres.indexOf(logueo.User) == -1)
    {
      arrayNombres.push(logueo.User);
    }
    });
    console.log(arrayNombres);
    return arrayNombres;
  }

  graficarSeries()
  {
    let arrayData : any = [];
    let unaSerie : any = {};

    this.usuarios.forEach(unUsuario => {

      arrayData = [];
      this.logueos.forEach(unLogueo => {
        
        if(unLogueo.User == unUsuario)
        {
          let dataPoint = { x: new Date(unLogueo.Date.toDateString()), y: unLogueo.Sessions }
          arrayData.push(dataPoint);
        }
      });

      unaSerie = {
        type: "line",
        name: unUsuario,
        showInLegend: true,
        yValueFormatString: "#.###",
        dataPoints: arrayData,
      };
      
      this.series.push(unaSerie);
    });

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
    console.log("update chart");
    this.chart.chartContainerId = "chartLogs";

    this.chart.options.data = this.series; //Asignar Array con cada serie.
    
    this.chart.render();
  }

  chart : any;

  example1 = {
    type:"line",
    name: "User1",
    showInLegend: true,
    yValueFormatString: "#.###",
    dataPoints: [		
      { x: new Date(2024, 1, 5), y: 0 },
      { x: new Date(2024, 1, 6), y: 5 },
      { x: new Date(2024, 1, 7), y: 6 },
      { x: new Date(2024, 1, 8), y: 3 },
      { x: new Date(2024, 1, 9), y: 1 },
      { x: new Date(2024, 1, 11), y: 4 },
      { x: new Date(2024, 1, 12), y: 0 },
    ]
  };

  //#region chart Logs
  chartOptions = {
    theme: "light2",
    title: { text: "Ingresos de Usuarios al Sistema" },
    axisX: {
      valueFormatString: "DDD",
      intervalType: "day",
      interval: 1
    },
    axisY: { title: "Sesiones diarias", },
    toolTip: { shared: true },
    legend: {
      cursor: "pointer",
      itemclick: function(e: any){
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else{
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }
    },

    data: []
  };

  //#endregion

}
