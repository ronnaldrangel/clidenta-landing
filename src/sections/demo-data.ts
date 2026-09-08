export const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
export const doctors = ['Dra. Valeria Ríos', 'Dr. Mateo Salazar', 'Dra. Camila Torres'];
export const hours = ['09:00', '10:00', '11:00', '12:00'];
export const patients = ['Lucía Fernández', 'Andrés Castro', 'María Chávez', 'Pedro Rojas'];
export const treatments = ['Consulta general', 'Limpieza dental', 'Control de ortodoncia'];
export type Appointment = { id: number; patient: string; treatment: string; day: number; time: string; doctor: number; confirmed: boolean };
export const initialAppointments: Appointment[] = [
  { id: 1, patient: 'Andrés Castro', treatment: 'Control de ortodoncia', day: 0, time: '09:00', doctor: 0, confirmed: false },
  { id: 2, patient: 'Lucía Fernández', treatment: 'Limpieza dental', day: 0, time: '10:00', doctor: 1, confirmed: true },
  { id: 3, patient: 'María Chávez', treatment: 'Consulta general', day: 0, time: '12:00', doctor: 2, confirmed: true },
  { id: 4, patient: 'Luis Vargas', treatment: 'Consulta general', day: 1, time: '10:00', doctor: 1, confirmed: true },
  { id: 5, patient: 'Rosa Delgado', treatment: 'Control de ortodoncia', day: 2, time: '09:00', doctor: 0, confirmed: true },
  { id: 6, patient: 'Andrea Coronel', treatment: 'Limpieza dental', day: 2, time: '11:00', doctor: 2, confirmed: false },
  { id: 7, patient: 'Luis Vargas', treatment: 'Consulta general', day: 3, time: '10:00', doctor: 0, confirmed: true },
  { id: 8, patient: 'Facundo Amayo', treatment: 'Limpieza dental', day: 3, time: '12:00', doctor: 2, confirmed: true },
  { id: 9, patient: 'Pedro Rojas', treatment: 'Control de ortodoncia', day: 4, time: '09:00', doctor: 1, confirmed: false },
  { id: 10, patient: 'Andrés Castro', treatment: 'Consulta general', day: 4, time: '11:00', doctor: 2, confirmed: true },
];
