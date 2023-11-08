import { Usuario } from "./usuario";

export class Pacientes extends Usuario
{
    obraSocial : string = '';
    imagenAdicional : string = '';

    constructor() 
    {
        super();
    }
}
