import { Usuario } from "./usuario";

export class Pacientes extends Usuario
{
    obraSocial : string = '';
    imagenAdicional : string = '';

    constructor(id: string, nombre: string, apellido: string, edad: number, dni: number, email: string, password: string, imagenPerfil: string,
     imagenAdicional: string, obraSocial: string) 
    {
        super(id, nombre, apellido, edad, dni, email, password, imagenPerfil);
        this.imagenAdicional = imagenAdicional;
        this.obraSocial = obraSocial;
    }

    static override inicializar() : Pacientes
    {
        return new Pacientes('', '', '', 0, 0, '', '', 'empty', 'empty', '');
    }
}
