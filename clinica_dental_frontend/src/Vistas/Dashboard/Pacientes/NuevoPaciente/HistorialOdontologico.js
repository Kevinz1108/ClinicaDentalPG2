import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import styles from './AgregarPaciente.module.css';

const HistorialOdontologico = ({ formData, handleChange }) => {
    const diagnostico = formData.historialOdontologico || {
        dientes: 'Presentes',
        notas_dientes: '',
        caries: 'No',
        notas_caries: '',
        encias: 'Saludables',
        notas_encias: '',
        maloclusiones: 'Clase I',
        notas_maloclusiones: '',
        lesiones: 'Ninguna',
        notas_lesiones: '',
        hueso_maxilar: 'Sano',
        notas_hueso_maxilar: '',
    };

    const dientesOptions = [
        { label: 'Presentes', value: 'Presentes' },
        { label: 'Ausentes', value: 'Ausentes' },
        { label: 'Restaurados', value: 'Restaurados' }
    ];

    const cariesOptions = [
        { label: 'Si', value: 'Si' },
        { label: 'No', value: 'No' }
    ];

    const enciasOptions = [
        { label: 'Saludables', value: 'Saludables' },
        { label: 'Inflamadas', value: 'Inflamadas' },
        { label: 'Recesión Gingival', value: 'Recesión Gingival' }
    ];

    const maloclusionesOptions = [
        { label: 'Clase I', value: 'Clase I' },
        { label: 'Clase II', value: 'Clase II' },
        { label: 'Clase III', value: 'Clase III' }
    ];

    const lesionesOptions = [
        { label: 'Ninguna', value: 'Ninguna' },
        { label: 'Úlceras', value: 'Úlceras' },
        { label: 'Herpes', value: 'Herpes' }
    ];

    const huesoMaxilarOptions = [
        { label: 'Sano', value: 'Sano' },
        { label: 'Reabsorción', value: 'Reabsorción' },
        { label: 'Otro', value: 'Otro' }
    ];

    return (
        <div className="card p-4" style={{ maxWidth: '95%', margin: 'auto', background: 'white', borderRadius: '1rem' }}>
            <div className={styles.grid}>
                <div className={styles.field}>
                    <label htmlFor="dientes">Dientes Presentes, Ausentes o Restaurados</label>
                    <Dropdown
                        id="dientes"
                        value={diagnostico.dientes}
                        options={dientesOptions}
                        onChange={(e) => handleChange({ target: { name: 'dientes', value: e.value } })}
                    />
                    <InputText
                        name="notas_dientes"
                        placeholder="Notas"
                        value={diagnostico.notas_dientes}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="caries">Caries Visibles</label>
                    <Dropdown
                        id="caries"
                        value={diagnostico.caries}
                        options={cariesOptions}
                        onChange={(e) => handleChange({ target: { name: 'caries', value: e.value } })}
                    />
                    <InputText
                        name="notas_caries"
                        placeholder="Notas"
                        value={diagnostico.notas_caries}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="encias">Estado de las Encías</label>
                    <Dropdown
                        id="encias"
                        value={diagnostico.encias}
                        options={enciasOptions}
                        onChange={(e) => handleChange({ target: { name: 'encias', value: e.value } })}
                    />
                    <InputText
                        name="notas_encias"
                        placeholder="Notas"
                        value={diagnostico.notas_encias}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="maloclusiones">Maloclusiones</label>
                    <Dropdown
                        id="maloclusiones"
                        value={diagnostico.maloclusiones}
                        options={maloclusionesOptions}
                        onChange={(e) => handleChange({ target: { name: 'maloclusiones', value: e.value } })}
                    />
                    <InputText
                        name="notas_maloclusiones"
                        placeholder="Notas"
                        value={diagnostico.notas_maloclusiones}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="lesiones">Lesiones en la Mucosa Bucal</label>
                    <Dropdown
                        id="lesiones"
                        value={diagnostico.lesiones}
                        options={lesionesOptions}
                        onChange={(e) => handleChange({ target: { name: 'lesiones', value: e.value } })}
                    />
                    <InputText
                        name="notas_lesiones"
                        placeholder="Notas"
                        value={diagnostico.notas_lesiones}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="hueso_maxilar">Estado del Hueso Maxilar</label>
                    <Dropdown
                        id="hueso_maxilar"
                        value={diagnostico.hueso_maxilar}
                        options={huesoMaxilarOptions}
                        onChange={(e) => handleChange({ target: { name: 'hueso_maxilar', value: e.value } })}
                    />
                    <InputText
                        name="notas_hueso_maxilar"
                        placeholder="Notas"
                        value={diagnostico.notas_hueso_maxilar}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default HistorialOdontologico;
