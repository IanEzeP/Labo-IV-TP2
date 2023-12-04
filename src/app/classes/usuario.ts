export class Usuario 
{
    id : string = '';
    nombre : string = '';
    apellido : string = '';
    edad : number = 0;
    dni : number = 0;
    email : string = '';
    password : string = '';
    imagenPerfil : string = '';

/* Vamos a usar esto cuando hagamos el form validator X
constructor () {}*/
    constructor(id: string, nombre: string, apellido: string, edad: number, dni: number, email: string, password: string, imagenPerfil: string) 
    {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.dni = dni;
        this.email = email;
        this.password = password;
        this.imagenPerfil = imagenPerfil;
    }

    inicializar()
    {
        this.id= '';
        this.nombre = '';
        this.apellido = '';
        this.email = '';
        this.password = '';
        this.imagenPerfil = '';
        this.edad = 0;
        this.dni = 0;
    }
    
    static inicializar() : Usuario
    {
        return new Usuario('', '', '', 0, 0, '', '', 'empty');
    }
}
