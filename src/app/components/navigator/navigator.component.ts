import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { LoadingService } from 'src/app/servicios/loading.service';
@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent {
  constructor(private data: DatabaseService, public auth: AuthService, public loading: LoadingService) {}
}
