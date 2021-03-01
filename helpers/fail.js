
fallas2String = (warning) => {
    if (warning == 'F1') return 'Se excedió tiempo máximo entre pantallas';
    if (warning == 'F2') return 'Falla 2';
    if (warning == 'F3') return 'Falta de seguridad manual durante ejecución de maniobra';
    if (warning == 'F4') return 'Operador no ha podido cerrar las puertas';
    if (warning == 'F5') return 'Operador no ha podido abrir las puertas';
    if (warning == 'F6') return 'Falta de seguridad automática durante ejecución de maniobra';
    if (warning == 'F7') return 'Se encontraron señales EXS y EXD activas al mismo tiempo';
    if (warning == 'F8') return 'No se encontró EXD durante la normalización del equipo';
    if (warning == 'FE') return 'Se detecto sobre temperatura del motor';
    if (warning == 'P') return 'Falla P';
};

module.exports = {
    fallas2String
};