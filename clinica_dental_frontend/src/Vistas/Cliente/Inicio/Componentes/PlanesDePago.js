import React from 'react'; 
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const planes = [
  {
    title: "Plan Básico",
    cobertura: [
      "Limpieza Dental Profesional",
      "Examen Dental Completo",
      "Radiografías Básicas (1 vez al año)",
    ],
    duracion: "12 meses",
    costo: "Q300/mes",
    beneficios: [
      "10% de descuento en tratamientos adicionales (Rellenos, extracciones, etc.)",
      "Prioridad en la Agenda De Citas",
    ],
  },
  {
    title: "Plan Avanzado",
    cobertura: [
      "Todo lo que incluye el plan básico",
      "Blanqueamiento Dental",
      "Sellado Dental Preventivo",
      "Radiografías Avanzadas (Panorámicas)",
    ],
    duracion: "12 meses",
    costo: "Q500/mes",
    beneficios: [
      "15% de descuento en tratamientos adicionales",
      "Revisión ortodóntica anual gratis",
      "Atención prioritaria en emergencias dentales",
    ],
  },
  {
    title: "Plan Premium",
    cobertura: [
      "Todo lo incluido en el plan avanzado",
      "Ortodoncia (Brackets o alineadores transparentes)",
      "Implantes dentales (1 implante al año)",
      "Tratamientos de endodoncia sin costo adicional",
    ],
    duracion: "12 meses",
    costo: "Q1000/mes",
    beneficios: [
      "20% de descuento en cualquier tratamiento adicional",
      "Atención personalizada con un especialista",
      "Revisión semestral gratuita con escaneo digital 3D de la boca",
    ],
  },
];

export default function AdvancedDemo() {
  return (
    <div className="card flex justify-content-center flex-wrap">
      {planes.map((plan, index) => (
        <div key={index} className="p-mb-3" style={{ flex: '1 1 30%', padding: '1rem' }}>  
          <Card 
            title={plan.title} 
            subTitle={plan.costo} 
            className="h-full"  
            style={{ height: '100%', minHeight: '400px' }}  
            footer={
              <div style={{ textAlign: 'center' }}>  
                <Button label="Elegir Plan" icon="pi pi-check" />
              </div>
            }
          >
            <div style={{ marginBottom: 'auto' }}>  
              <p><strong>Duración:</strong> {plan.duracion}</p>
              <h4>Cobertura:</h4>
              <ul>
                {plan.cobertura.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <h4>Beneficios:</h4>
              <ul>
                {plan.beneficios.map((beneficio, i) => (
                  <li key={i}>{beneficio}</li>
                ))}
              </ul>
              {/* Solo aplica espacio extra para Card 1 y Card 2 */}
              {(index === 0 ) && <div style={{ height: '50px' }}></div>}
              {(index === 1) && <div style={{ height: '30px' }}></div>}
              {(index === 2) && <div style={{ height: '8px' }}></div>}
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
