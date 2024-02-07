import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertasService } from 'src/app/servicios/alerta.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { DatabaseService } from 'src/app/servicios/database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})

export class LogsComponent implements OnInit, OnDestroy {


  observableLogs = Subscription.EMPTY;
  logs : Array<any> = [];
  totalEntries : number = 0;

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
      console.log(this.totalEntries);
    });
  }

  ngOnDestroy(): void 
  {
    this.observableLogs.unsubscribe();
  }

  //#region chart Logs
  chart : any;
  chartOptions = {
    theme: "light2",
    title: {
      text: "Ingresos de Usuarios al Sistema"
    },
    axisX: {
      valueFormatString: "DDD",
      intervalType: "day",
      interval: 1
    },
    axisY: {
      title: "Sesiones diarias",
    },
    toolTip: {
      shared: true
    },
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
    data: [{
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
    },
    {
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
    }]
  };

  //#endregion

}
