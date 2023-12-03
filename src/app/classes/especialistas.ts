import { Usuario } from "./usuario";

export class Especialistas extends Usuario
{
    especialidades : Array<string> = [];
    autorizado : boolean = false;
    constructor() 
    {
        super();
    }
}
