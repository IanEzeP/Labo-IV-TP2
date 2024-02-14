import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable'
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class GenerateFilesService {

  constructor() {}

  historiaClinicaToExcel(data : Array<any>)
  {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Historias clínicas');
    
    XLSX.writeFile(workbook, data[0].Paciente + "_historia.xlsx", { bookType: 'xlsx', type: 'array' });
  }

  datosUsuariosToExcel(data : Array<any>)
  {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users data');
    
    XLSX.writeFile(workbook, "Usuarios_data.xlsx", { bookType: 'xlsx', type: 'array' });
  }

  historiaClinicaToPDF(data : Array<any>)
  {
    const pdf = new jsPDF();

    const pageSize = pdf.internal.pageSize;
    const pageWidth = pageSize.getWidth();
    const pageHeight = pageSize.getHeight();

    const logoWidth = 40;
    const logoHeight = 40;
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = (pageHeight - logoHeight) / 6;

    let paciente : string = "Historial clinico de " + data[0].Paciente;
    let fecha : string = "Emisión: " + new Date().toLocaleDateString();

    pdf.setFont("courier", "bold");
    pdf.setFontSize(20);
    pdf.text("Clínica On Line", pageWidth / 2, 100, { align: 'center' });
    pdf.text(paciente, pageWidth / 2, 130, { align: 'center' });
    pdf.text(fecha, pageWidth / 2, 160, { align: 'center' });

    let foto = "../../../assets/Logo.png"; 

    pdf.addImage(foto, "png", logoX, logoY, logoWidth, logoHeight);

    pdf.addPage();

    const clavesUnicas = new Set<string>();

    for (let i = 0; i < data.length; i++) 
    {
      const objeto = data[i];
    
      for (const clave in objeto)
      {
        if (objeto.hasOwnProperty(clave)) 
        {
          clavesUnicas.add(clave);    
        }
      }
    }
    const columns = Array.from(clavesUnicas);

    let filas : any[] = [];

    for (var i = 0; i < data.length; i++) 
    {
      filas.push(Object.values(data[i]));
    }

    autoTable(pdf, { 
      columns:  columns,
      body: filas,
      theme: 'grid',
      styles: { fontSize: 8 },
    })

    pdf.save(data[0].Paciente + '_' + data[0].Especialidad + ".pdf"); 
  }

  downloadPdfChart(title : string, filename : string, chart : string)
  {
    const pdf = new jsPDF();

    const pageSize = pdf.internal.pageSize;
    const pageWidth = pageSize.getWidth();
    const pageHeight = pageSize.getHeight();

    const logoWidth = 40;
    const logoHeight = 40;
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = (pageHeight - logoHeight) / 6;

    let fecha : string = "Emisión: " + new Date().toLocaleDateString();
   
    pdf.setFont("courier", "bold");
    pdf.setFontSize(20);
    pdf.text(title, pageWidth / 2, 100, { align: "center" });
    pdf.text(fecha, pageWidth / 2, 130, { align: 'center' });
   
    let foto = "../../../assets/Logo.png"; 

    pdf.addImage(foto, "png", logoX, logoY, logoWidth, logoHeight);

    pdf.addPage();

    pdf.addImage(chart, 'JPEG', 0, 0, (pageWidth - 15), (pageHeight / 2.5));

    pdf.save(filename + '.pdf');
  }
}