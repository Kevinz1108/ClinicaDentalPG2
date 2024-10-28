// src/Vistas/Dashboard/Pacientes/ubicaciones.js

export const departamentos = [
    { label: 'Alta Verapaz', value: 'Alta Verapaz' },
    { label: 'Baja Verapaz', value: 'Baja Verapaz' },
    { label: 'Chimaltenango', value: 'Chimaltenango' },
    { label: 'Chiquimula', value: 'Chiquimula' },
    { label: 'El Progreso', value: 'El Progreso' },
    { label: 'Escuintla', value: 'Escuintla' },
    { label: 'Guatemala', value: 'Guatemala' },
    { label: 'Huehuetenango', value: 'Huehuetenango' },
    { label: 'Izabal', value: 'Izabal' },
    { label: 'Jalapa', value: 'Jalapa' },
    { label: 'Jutiapa', value: 'Jutiapa' },
    { label: 'Petén', value: 'Petén' },
    { label: 'Quetzaltenango', value: 'Quetzaltenango' },
    { label: 'Quiché', value: 'Quiché' },
    { label: 'Retalhuleu', value: 'Retalhuleu' },
    { label: 'Sacatepéquez', value: 'Sacatepéquez' },
    { label: 'San Marcos', value: 'San Marcos' },
    { label: 'Santa Rosa', value: 'Santa Rosa' },
    { label: 'Sololá', value: 'Sololá' },
    { label: 'Suchitepéquez', value: 'Suchitepéquez' },
    { label: 'Totonicapán', value: 'Totonicapán' },
    { label: 'Zacapa', value: 'Zacapa' },
];

export const municipiosPorDepartamento = {
    'Alta Verapaz': [
        'Cobán', 'San Pedro Carchá', 'San Juan Chamelco', 'Tactic', 
        'Tucurú', 'San Miguel Tucurú', 'Santa Cruz Verapaz', 'San Cristóbal Verapaz', 
        'Panzós', 'Senahú', 'Cahabón', 'Santa Catalina La Tinta', 'Fray Bartolomé de las Casas', 
        'Chisec', 'Raxruhá', 'Santa María Cahabón'
    ].map((mun) => ({ label: mun, value: mun })),

    'Baja Verapaz': [
        'Salamá', 'San Miguel Chicaj', 'Rabinal', 'Cubulco', 
        'Granados', 'El Chol', 'Purulhá'
    ].map((mun) => ({ label: mun, value: mun })),

    'Chimaltenango': [
        'Chimaltenango', 'San José Poaquil', 'San Martín Jilotepeque', 
        'Comalapa', 'Santa Apolonia', 'Tecpán Guatemala', 'Patzún', 
        'Pochuta', 'Patzicía', 'Santa Cruz Balanyá', 'Acatenango', 
        'Yepocapa', 'Parramos', 'Zaragoza', 'El Tejar'
    ].map((mun) => ({ label: mun, value: mun })),

    'Chiquimula': [
        'Chiquimula', 'San José La Arada', 'San Juan Ermita', 'Jocotán', 
        'Camotán', 'Olopa', 'Esquipulas', 'Concepción Las Minas', 'Quetzaltepeque'
    ].map((mun) => ({ label: mun, value: mun })),

    'El Progreso': [
        'Guastatoya', 'San Agustín Acasaguastlán', 'San Cristóbal Acasaguastlán', 
        'El Jícaro', 'Morazán', 'Sanarate', 'Sansare'
    ].map((mun) => ({ label: mun, value: mun })),

    'Escuintla': [
        'Escuintla', 'Santa Lucía Cotzumalguapa', 'La Democracia', 
        'Siquinalá', 'La Gomera', 'Guanagazapa', 'Puerto San José', 
        'Iztapa', 'Palín', 'San Vicente Pacaya', 'Nueva Concepción'
    ].map((mun) => ({ label: mun, value: mun })),

    'Guatemala': [
        'Guatemala', 'Mixco', 'Villa Nueva', 'San Miguel Petapa', 
        'Villa Canales', 'San José Pinula', 'Santa Catarina Pinula', 
        'Fraijanes', 'Amatitlán', 'San Juan Sacatepéquez', 'San Pedro Ayampuc', 
        'San Raymundo', 'Chuarrancho'
    ].map((mun) => ({ label: mun, value: mun })),

    'Huehuetenango': [
        'Huehuetenango', 'Chiantla', 'Malacatancito', 'Cuilco', 'San Sebastián Huehuetenango', 
        'San Juan Ixcoy', 'San Pedro Soloma', 'Santa Eulalia', 'San Mateo Ixtatán', 
        'Colotenango', 'San Rafael Petzal', 'San Gaspar Ixchil', 'Santiago Chimaltenango'
    ].map((mun) => ({ label: mun, value: mun })),

    'Izabal': [
        'Puerto Barrios', 'Livingston', 'El Estor', 'Morales', 
        'Los Amates'
    ].map((mun) => ({ label: mun, value: mun })),

    'Jalapa': [
        'Jalapa', 'San Pedro Pinula', 'San Luis Jilotepeque', 'San Manuel Chaparrón', 
        'San Carlos Alzatate', 'Monjas', 'Mataquescuintla'
    ].map((mun) => ({ label: mun, value: mun })),

    'Petén': [
        'Flores', 'San Benito', 'San Andrés', 'La Libertad', 'San Francisco', 
        'Santa Ana', 'San Luis', 'Poptún', 'Melchor de Mencos'
    ].map((mun) => ({ label: mun, value: mun })),

    'Quetzaltenango': [
        'Quetzaltenango', 'Salcajá', 'Olintepeque', 'San Carlos Sija', 
        'Sibilia', 'Cabricán', 'Almolonga', 'Zunil', 'Colomba'
    ].map((mun) => ({ label: mun, value: mun })),

    'San Marcos': [
        'San Marcos', 'San Pedro Sacatepéquez', 'San Antonio Sacatepéquez', 
        'Comitancillo', 'Concepción Tutuapa', 'Tacaná', 'San Pablo', 'El Tumbador'
    ].map((mun) => ({ label: mun, value: mun })),

    'Sololá': [
        'Sololá', 'Panajachel', 'Santa Catarina Palopó', 'San Antonio Palopó', 
        'San Lucas Tolimán', 'Santa Cruz La Laguna', 'San Pablo La Laguna'
    ].map((mun) => ({ label: mun, value: mun })),

    'Zacapa': [
        'Zacapa', 'La Unión', 'Gualán', 'Teculután', 
        'Estanzuela', 'Río Hondo', 'Usumatlán', 'Cabañas', 'San Diego'
    ].map((mun) => ({ label: mun, value: mun })),
'Sacatepéquez': [
    { label: 'Antigua Guatemala', value: 'Antigua Guatemala' },
    { label: 'Ciudad Vieja', value: 'Ciudad Vieja' },
    { label: 'Jocotenango', value: 'Jocotenango' },
    { label: 'Pastores', value: 'Pastores' },
    { label: 'Sumpango', value: 'Sumpango' },
    { label: 'Santo Domingo Xenacoj', value: 'Santo Domingo Xenacoj' },
    { label: 'Santiago Sacatepéquez', value: 'Santiago Sacatepéquez' },
    { label: 'San Bartolomé Milpas Altas', value: 'San Bartolomé Milpas Altas' },
    { label: 'San Lucas Sacatepéquez', value: 'San Lucas Sacatepéquez' },
    { label: 'Santa Lucía Milpas Altas', value: 'Santa Lucía Milpas Altas' },
    { label: 'Magdalena Milpas Altas', value: 'Magdalena Milpas Altas' },
    { label: 'Santa María de Jesús', value: 'Santa María de Jesús' },
    { label: 'San Juan Alotenango', value: 'San Juan Alotenango' },
    { label: 'San Antonio Aguas Calientes', value: 'San Antonio Aguas Calientes' },
    { label: 'Santa Catarina Barahona', value: 'Santa Catarina Barahona' }
]
};
