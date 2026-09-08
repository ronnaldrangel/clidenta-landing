'use client';

import { useRef, useState } from 'react';
import { ArrowUpRight, Check, ChevronRight, Clock3, FlaskConical, Search, Stethoscope, Users, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { days, doctors, type Appointment } from './demo-data';

type Module = 'agenda' | 'patients' | 'services' | 'laboratory';
type LabStatus = 'En proceso' | 'Listo para recibir' | 'Recibido';
type LabOrder = { id: string; patient: string; work: string; lab: string; date: string; status: LabStatus };
const statusSteps: LabStatus[] = ['En proceso', 'Listo para recibir', 'Recibido'];
const services = [
  { id: 'consultation', name: 'Consulta general', category: 'Diagnóstico', price: 80, duration: 60, description: 'Primera visita o revisión de seguimiento. Un espacio para conocer al paciente y organizar los siguientes pasos.', includes: ['Registro de la consulta', 'Evaluación del motivo de visita', 'Planificación del seguimiento'], color: 'blue' },
  { id: 'cleaning', name: 'Limpieza dental', category: 'Prevención', price: 120, duration: 60, description: 'Una cita de cuidado preventivo que puedes organizar desde la agenda del consultorio.', includes: ['Cita de cuidado preventivo', 'Registro de la atención', 'Programación del siguiente control'], color: 'sage' },
  { id: 'orthodontics', name: 'Control de ortodoncia', category: 'Ortodoncia', price: 100, duration: 60, description: 'Seguimiento de pacientes en tratamiento de ortodoncia, con la información de cada control en un mismo lugar.', includes: ['Seguimiento del tratamiento', 'Notas de la consulta', 'Coordinación del próximo control'], color: 'lilac' },
  { id: 'crown', name: 'Corona de porcelana', category: 'Rehabilitación', price: 850, duration: 60, description: 'Coordina la cita del paciente y el trabajo del laboratorio dentro de la misma práctica.', includes: ['Registro del servicio', 'Coordinación con laboratorio', 'Seguimiento de la cita'], color: 'sand' },
];
const initialOrders: LabOrder[] = [
  { id: 'LAB-001', patient: 'Rosa Delgado', work: 'Corona de porcelana', lab: 'Laboratorio Norte · ejemplo', date: '10 de septiembre', status: 'En proceso' },
  { id: 'LAB-002', patient: 'Andrea Coronel', work: 'Retenedor superior', lab: 'Dental Studio · ejemplo', date: '9 de septiembre', status: 'Listo para recibir' },
  { id: 'LAB-003', patient: 'Facundo Amayo', work: 'Férula de descarga', lab: 'Laboratorio Norte · ejemplo', date: '8 de septiembre', status: 'Recibido' },
];
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const initials = (name: string) => name.split(' ').map(part => part[0]).slice(0, 2).join('');

export default function DemoModules({ activeModule, appointments, onNotice }: {
  activeModule: Module;
  appointments: Appointment[];
  onNotice: (notice: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [labFilter, setLabFilter] = useState('Todos');
  const [orders, setOrders] = useState(initialOrders);
  const [detail, setDetail] = useState<{ type: 'patient' | 'service' | 'lab'; id: string } | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const patientNames = Array.from(new Set(appointments.map(item => item.patient))).sort((a, b) => a.localeCompare(b, 'es'));
  const filteredPatients = patientNames.filter(name => normalize(name).includes(normalize(query.trim())));
  const filteredServices = services.filter(service => category === 'Todos' || service.category === category);
  const filteredOrders = orders.filter(order => labFilter === 'Todos' || order.status === labFilter);
  const selectedService = detail?.type === 'service' ? services.find(service => service.id === detail.id) : undefined;
  const selectedOrder = detail?.type === 'lab' ? orders.find(order => order.id === detail.id) : undefined;
  const patientAppointments = detail?.type === 'patient'
    ? appointments.filter(item => item.patient === detail.id).sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
    : [];

  function openDetail(type: 'patient' | 'service' | 'lab', id: string, button: HTMLButtonElement) {
    trigger.current = button;
    setDetail({ type, id });
  }

  function updateOrder(order: LabOrder) {
    const nextStatus = statusSteps[(statusSteps.indexOf(order.status) + 1) % statusSteps.length];
    setOrders(current => current.map(item => item.id === order.id ? { ...item, status: nextStatus } : item));
    // Keep the updated row visible, including the element that regains focus.
    setLabFilter('Todos');
    onNotice(`${order.id}: ${order.work} de ${order.patient}. Estado de ejemplo: ${nextStatus.toLowerCase()}.`);
  }

  return (
    <>
      {activeModule === 'patients' ? (
        <section className="demo-module-panel" aria-label="Pacientes de ejemplo">
          <div className="demo-module-toolbar">
            <label className="demo-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Buscar paciente</span><input type="search" placeholder="Buscar paciente…" value={query} onChange={event => setQuery(event.target.value)} /></label>
            <span className="demo-results" role="status">{filteredPatients.length} {filteredPatients.length === 1 ? 'paciente' : 'pacientes'}</span>
          </div>
          <div className="demo-table-heading" aria-hidden="true"><span>PACIENTE</span><span>ESTA SEMANA</span><span /></div>
          <div className="demo-patient-list">
            {filteredPatients.map((name, index) => {
              const count = appointments.filter(item => item.patient === name).length;
              return (
                <button className="demo-patient-row" type="button" key={name} aria-label={`Abrir ficha de ${name}`} onClick={event => openDetail('patient', name, event.currentTarget)}>
                  <span className="demo-patient-person"><span className={`review-avatar review-avatar-${index % 2 ? 'blue' : 'sage'}`} aria-hidden="true">{initials(name)}</span><span><strong>{name}</strong><small>Paciente de ejemplo</small></span></span>
                  <span className="demo-patient-count">{count} {count === 1 ? 'cita' : 'citas'}</span><ChevronRight size={16} aria-hidden="true" />
                </button>
              );
            })}
            {!filteredPatients.length ? <div className="demo-module-empty"><Users size={28} aria-hidden="true" /><p>No encontramos a ese paciente.</p><button type="button" onClick={() => setQuery('')}>Ver todos los pacientes</button></div> : null}
          </div>
          <div className="demo-module-foot">Abre una ficha para ver sus citas y el profesional que lo atiende.</div>
        </section>
      ) : null}

      {activeModule === 'services' ? (
        <section className="demo-module-panel" aria-label="Servicios de ejemplo">
          <div className="demo-module-toolbar"><label className="demo-module-select">Especialidad<select value={category} onChange={event => setCategory(event.target.value)}><option>Todos</option>{services.map(service => <option key={service.id}>{service.category}</option>)}</select></label><span className="demo-results" role="status">{filteredServices.length} {filteredServices.length === 1 ? 'servicio' : 'servicios'}</span></div>
          <div className="demo-service-grid">
            {filteredServices.map(service => (
              <button className="demo-service-card" type="button" key={service.id} aria-label={`Ver servicio ${service.name}`} onClick={event => openDetail('service', service.id, event.currentTarget)}>
                <span className="demo-service-top"><span className={`demo-service-icon review-avatar-${service.color}`}><Stethoscope size={20} aria-hidden="true" /></span><ArrowUpRight size={16} aria-hidden="true" /></span>
                <span className="demo-service-category">{service.category}</span><strong>{service.name}</strong>
                <span className="demo-service-bottom"><span><Clock3 size={12} aria-hidden="true" /> {service.duration} min</span><span>S/ {service.price}</span></span>
              </button>
            ))}
          </div>
          <div className="demo-module-foot">Catálogo de muestra. Precios y duraciones ficticios.</div>
        </section>
      ) : null}

      {activeModule === 'laboratory' ? (
        <section className="demo-module-panel" aria-label="Trabajos de laboratorio de ejemplo">
          <div className="demo-lab-summary">{statusSteps.map((status, index) => <button type="button" aria-pressed={labFilter === status} key={status} onClick={() => setLabFilter(labFilter === status ? 'Todos' : status)}><span className={`demo-lab-dot demo-lab-dot-${index}`} /><strong>{orders.filter(order => order.status === status).length}</strong><span>{status}</span></button>)}</div>
          <div className="demo-module-toolbar"><label className="demo-module-select">Estado<select value={labFilter} onChange={event => setLabFilter(event.target.value)}><option>Todos</option>{statusSteps.map(status => <option key={status}>{status}</option>)}</select></label><span className="demo-results" role="status">{filteredOrders.length} {filteredOrders.length === 1 ? 'trabajo' : 'trabajos'}</span></div>
          <div className="demo-lab-list">{filteredOrders.map(order => (
            <button type="button" className="demo-lab-row" key={order.id} aria-label={`Abrir trabajo ${order.id}, ${order.patient}`} onClick={event => openDetail('lab', order.id, event.currentTarget)}>
              <span className="demo-lab-icon"><FlaskConical size={20} aria-hidden="true" /></span>
              <span className="demo-lab-info"><small>{order.id} · {order.patient}</small><strong>{order.work}</strong><span>Entrega prevista: {order.date}</span></span>
              <span className={`demo-lab-status demo-lab-status-${statusSteps.indexOf(order.status)}`}>{order.status}</span><ChevronRight size={16} aria-hidden="true" />
            </button>
          ))}</div>
          {!filteredOrders.length ? <div className="demo-module-empty"><FlaskConical size={28} aria-hidden="true" /><p>No hay trabajos con este estado.</p><button type="button" onClick={() => setLabFilter('Todos')}>Ver todos los trabajos</button></div> : null}
          <div className="demo-module-foot">Selecciona un trabajo para ver su detalle y actualizar el estado.</div>
        </section>
      ) : null}

      <Dialog open={detail !== null} onOpenChange={open => { if (!open) setDetail(null); }}>
        <DialogContent className="demo-dialog" showCloseButton={false} onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus(); }}>
          <DialogClose className="demo-dialog-close demo-icon-button" aria-label="Cerrar"><X size={20} /></DialogClose>
          {detail?.type === 'patient' ? (
            <>
              <span className="demo-dialog-eyebrow">FICHA DEL PACIENTE · DEMO</span>
              <div className="demo-patient-detail-avatar" aria-hidden="true">{initials(detail.id)}</div>
              <DialogTitle className="demo-dialog-title">{detail.id}</DialogTitle>
              <DialogDescription>Paciente ficticio. Sus citas se actualizan con los cambios que hagas en la agenda.</DialogDescription>
              <div className="demo-detail-section-label">CITAS DE ESTA SEMANA <span>{patientAppointments.length}</span></div>
              <div className="demo-patient-appointments">{patientAppointments.map(item => <div key={item.id}><div><strong>{days[item.day]} {7 + item.day} · {item.time}</strong><span className={item.confirmed ? 'demo-text-confirmed' : 'demo-text-pending'}>{item.confirmed ? 'Confirmada' : 'Por confirmar'}</span></div><p>{item.treatment}</p><small>{doctors[item.doctor]}</small></div>)}</div>
            </>
          ) : selectedService ? (
            <>
              <span className="demo-dialog-eyebrow">CATÁLOGO DE SERVICIOS · DEMO</span>
              <DialogTitle className="demo-dialog-title">{selectedService.name}</DialogTitle>
              <DialogDescription>{selectedService.description}</DialogDescription>
              <div className="demo-service-detail-metrics"><div><span>Duración de ejemplo</span><strong>{selectedService.duration} minutos</strong></div><div><span>Precio de ejemplo</span><strong>S/ {selectedService.price}</strong></div></div>
              <div className="demo-detail-section-label">ORGANIZA DESDE CLIDENTA</div>
              <ul className="demo-service-includes">{selectedService.includes.map(item => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul>
              <p className="demo-detail-note">Información ficticia para explorar el catálogo. Cada consultorio define sus propios servicios.</p>
            </>
          ) : selectedOrder ? (
            <>
              <span className="demo-dialog-eyebrow">{selectedOrder.id} · LABORATORIO DE EJEMPLO</span>
              <DialogTitle className="demo-dialog-title">{selectedOrder.work}</DialogTitle>
              <DialogDescription>Trabajo para {selectedOrder.patient}. Sigue su avance hasta recibirlo en el consultorio.</DialogDescription>
              <ol className="demo-lab-progress" aria-label="Progreso del trabajo">{statusSteps.map((status, index) => <li key={status} aria-current={selectedOrder.status === status ? 'step' : undefined} className={index <= statusSteps.indexOf(selectedOrder.status) ? 'is-complete' : ''}><span>{index < statusSteps.indexOf(selectedOrder.status) ? <Check size={12} aria-hidden="true" /> : index + 1}</span>{status}</li>)}</ol>
              <dl className="demo-details"><div><dt>Paciente</dt><dd>{selectedOrder.patient}</dd></div><div><dt>Laboratorio</dt><dd>{selectedOrder.lab}</dd></div><div><dt>Entrega prevista</dt><dd>{selectedOrder.date} de 2026</dd></div></dl>
              <p className="demo-lab-live-status" role="status">Estado actual: {selectedOrder.status.toLowerCase()}.</p>
              <button type="button" className="demo-primary" onClick={() => updateOrder(selectedOrder)}><Check size={16} aria-hidden="true" />{selectedOrder.status === 'En proceso' ? 'Marcar como listo' : selectedOrder.status === 'Listo para recibir' ? 'Marcar como recibido' : 'Reiniciar este ejemplo'}</button>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
