export class Usuario 
{
    id : string = '';
    nombre : string = '';
    apellido : string = '';
    edad : number = 0;
    dni : number = 0;
    mail : string = '';
    password : string = '';
    imagenPerfil : string = '';

    constructor () {}
/* Vamos a usar esto cuando hagamos el form validator
    constructor(id: string, nombre: string, apellido: string, edad: number, dni: number, mail: string, password: string, imagenPerfil: string) 
    {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.dni = dni;
        this.mail = mail;
        this.password = password;
        this.imagenPerfil = imagenPerfil;
    }

    inicializar()
    {
        this.id= '';
        this.nombre = '';
        this.apellido = '';
        this.mail = '';
        this.password = '';
        this.imagenPerfil = '';
        this.edad = 0;
        this.dni = 0;
    }*/
}
