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

  constructor (private firestore: AngularFirestore, private data: DatabaseService, private alertas: AlertasService, private auth: AuthService) {}

  ngOnInit(): void 
  {
    this.observableLogs = this.data.getCollectionObservable('Logs').subscribe((next : any) =>
    {
      this.logs = [];
      let result : Array<any> = next;

      result.forEach(log =>
      {
        console.log(log.Date.seconds);
        let date = new Date(log.Date.seconds * 1000);
        let newLog = {
          Usuario: log.User,
          Fecha: date.toLocaleDateString(),
          Hora: `${date.getHours()}:${date.getMinutes()}`,
          Seconds: Date.parse(date.toString())
        }
        console.log(newLog);
        this.logs.push(newLog);
      });
      
      this.logs = this.logs.sort((a, b) => b.Seconds - a.Seconds);
    });
  }

  ngOnDestroy(): void 
  {
    this.observableLogs.unsubscribe();
  }


}
