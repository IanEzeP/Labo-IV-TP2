import { Usuario } from "./usuario";

export class Especialistas extends Usuario
{
    especialidades : Array<string> = [];
    autorizado : boolean = false;

    constructor(id: string, nombre: string, apellido: string, edad: number, dni: number, email: string, password: string, imagenPerfil: string,
     especialidades: Array<string>, autorizado: boolean) 
    {
        super(id, nombre, apellido, edad, dni, email, password, imagenPerfil);
        this.especialidades = especialidades;
        this.autorizado = autorizado;
    }

    static override inicializar() : Especialistas
    {
        return new Especialistas('', '', '', 0, 0, '', '', 'empty', [], false);
    }

    cargarEspecialidad(especialidad: string)
    {
        let flag : boolean = true;
        for(let i = 0; i < this.especialidades.length; i++)
        {
            if(especialidad == this.especialidades[i])
            {
                flag = false;
                break;
            }
        }
        if(flag == true)
        {
            this.especialidades.push(especialidad);
        }
    }
}
