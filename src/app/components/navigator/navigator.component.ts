import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/servicios/database.service';
import { AuthService } from 'src/app/servicios/auth.service';
@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent {
  constructor(private data: DatabaseService, public auth: AuthService) {}
}
