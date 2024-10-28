import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import styles from './DashboardPaciente.module.css'; // Agrega estilos personalizados

const DashboardPaciente = () => {
    const header = (
        <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
    );

    return (
        <div className={styles.dashboardContainer}>
            <div className="grid">
                {/* 1. Card para Datos del Paciente */}
                <div className="col-12 py-6 md:col-4">
                    <Card title="Datos del Paciente" subTitle="Información general del paciente" header={header} className={`md:h-28rem ${styles.cardHover}`}>
                        <p>Aquí se muestra la información básica del paciente, como nombre, edad, y otros datos personales.</p>
                    </Card>
                </div>

                {/* 2. Card para Dentista a Cargo */}
                <div className="col-12 py-6 md:col-4">
                    <Card title="Dentista a Cargo" subTitle="Información del dentista responsable" header={header} className={`md:h-28rem ${styles.cardHover}`}>
                        <p>Detalles sobre el dentista a cargo del paciente.</p>
                    </Card>
                </div>

                {/* 3. Card para Historial Médico */}
                <div className="col-12 py-6 md:col-4">
                    <Card title="Historial Médico" subTitle="Información médica del paciente" header={header} className={`md:h-28rem ${styles.cardHover}`}>
                        <p>Acceso al historial médico del paciente.</p>
                    </Card>
                </div>
 
                {/* 4. Card para Historial Odontológico */}
                <div className="col-12 py-2 md:col-4">
                    <Card title="Historial Odontológico" subTitle="Información odontológica del paciente" header={header} className={`md:h-28rem ${styles.cardHover}`}>
                        <p>Acceso al historial odontológico del paciente.</p>
                    </Card>
                </div>

                {/* 5. Card para Radiografías */}
                <div className="col-12 py-2 md:col-4">
                    <Card title="Radiografías" subTitle="Imágenes de radiografías del paciente" header={header} className={`md:h-28rem ${styles.cardHover}`}>
                        <p>Acceso a las radiografías del paciente.</p>
                    </Card>
                </div>

                {/* 6. Card para Tratamiento */}
                <div className="col-12 py-2 md:col-4">
                    <Card title="Tratamiento" subTitle="Plan de tratamiento del paciente" header={header} className={`md:h-28rem ${styles.cardHover}`}>
                        <p>Acceso al plan de tratamiento del paciente.</p>
                    </Card>
                </div>

                {/* 7. Card para Pago */}
                <div className="col-12 py-6 md:col-4">
                    <Card title="Historial Pagos" subTitle="Información de pagos del paciente" header={header} className={`md:h-28rem ${styles.cardHover}`}>
                        <p>Acceso al historial de pagos del paciente.</p>
                    </Card>
                </div>

                {/* 8. Card para Citas */}
                <div className="col-12 py-6 md:col-4">
                    <Card title="Citas" subTitle="Historial de citas del paciente" header={header} className={`md:h-28rem ${styles.cardHover}`}>
                        <p>Acceso al historial de citas del paciente.</p>
                    </Card>
                </div>

                {/* 9. Card para Carta Compromiso */}
                <div className="col-12 py-6 md:col-4">
                    <Card title="Carta Compromiso" subTitle="Carta compromiso del paciente" header={header} className={`md:h-28rem ${styles.cardHover}`}>
                        <p>Acceso a la carta compromiso del paciente.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPaciente;
