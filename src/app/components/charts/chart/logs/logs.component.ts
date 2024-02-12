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

  series : Array<any> = [];

  constructor (private firestore: AngularFirestore, private data: DatabaseService, private alertas: AlertasService, private auth: AuthService) {}

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
            if(this.series[j])
            {
              this.series[j].Sessions++;
            }
            else
            {
              this.series.push({ User: auxLogs[i].Usuario, Date: auxLogs[i].FullDate, Sessions: 1});
            }
            auxLogs[i] = null;
          }
        }
        
      }

      if(this.series[j])
      {
        j++;
      }
    };
    console.log(this.series);

    this.graficarSeries();
  }

  graficarSeries()
  {
    let arrayUnUser : any = [];

    this.series.forEach(unaSerie => {
      if(unaSerie.User == "Keanu Reeves")
      {
        let dataPoint = { x: new Date(unaSerie.Date.toDateString()), y: unaSerie.Sessions }
        arrayUnUser.push(dataPoint);
      }
    });
    this.smt = {
      type: "line",
      //name: `${this.series[0].User}`,
      name: `Keanu Reeves`,
      showInLegend: true,
      yValueFormatString: "#.###",
      dataPoints: arrayUnUser,
    };

    console.log(this.smt);

    
  }
  getChartInstance(chart : Object)
  {
    this.chart = chart;
    this.updateChart();
  }

  updateChart()
  {
    this.chart = new CanvasJSChart();
    this.chart.chartContainerId = "chartLogs";
    this.chart.options = { title: "Ingresos de Usuarios al Sistema",
    theme: "light2",
    axisY: { 
      valueFormatString: "DDD",
      intervalType: "day",
      interval: 1,
      },
    axisX: { title: "Sesiones Diarias" },
    toolTip: { shared: true },
    data: [this.smt, this.example1],
    };
  }
  chart : any;

  example1 = {
    type:"line",
    name: "User1",
    showInLegend: true,
    yValueFormatString: "#.###",
    dataPoints: [		
      { x: new Date(2021, 0, 1), y: 0 },
      { x: new Date(2021, 0, 2), y: 5 },
      { x: new Date(2021, 0, 3), y: 6 },
      { x: new Date(2021, 0, 4), y: 3 },
      { x: new Date(2021, 0, 5), y: 1 },
      { x: new Date(2021, 0, 6), y: 4 },
      { x: new Date(2021, 0, 7), y: 0 },
    ]
  };
  example2 = {
    type: "line",
    name: "User2",
    showInLegend: true,
    yValueFormatString: "#.###",
    dataPoints: [
      { x: new Date(2021, 0, 1), y: 4 },
      { x: new Date(2021, 0, 2), y: 1 },
      { x: new Date(2021, 0, 3), y: 3 },
      { x: new Date(2021, 0, 4), y: 4 },
      { x: new Date(2021, 0, 5), y: 2 },
      { x: new Date(2021, 0, 6), y: 6 },
      { x: new Date(2021, 0, 7), y: 1 },
    ]
  };
  smt : any = {};
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
    //En data tengo que ser capaz de generar (TODO...) una serie (llaves {} con datos) por cada usuario, 
    //y cada dataPoints debe tener la fecha (X) y la cantidad de sesiones ese día (Y) de un usuario

    //Se renderiza primero el grafico y no la tercer serie
    data: [
    this.smt,
    this.example1,
    this.example2
    ]
  };

  //#endregion

}
