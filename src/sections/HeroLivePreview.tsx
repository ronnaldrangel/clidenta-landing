'use client';

import { useRef, useState, type FormEvent } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, FlaskConical, MousePointer2, Plus, ShieldCheck, Stethoscope, Users, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import DemoModules from './DemoModules';
import { days, doctors, hours, patients, treatments, initialAppointments } from './demo-data';
import type { Appointment } from './demo-data';

type Module = 'agenda' | 'patients' | 'services' | 'laboratory';
const modules = [
  { id: 'agenda', label: 'Agenda', icon: CalendarDays, title: 'Tu semana, en orden.', description: 'Un espacio para cada paciente.' },
  { id: 'patients', label: 'Pacientes', icon: Users, title: 'Cada paciente, presente.', description: 'Su información, siempre a mano.' },
  { id: 'services', label: 'Servicios', icon: Stethoscope, title: 'Tu consulta, a tu medida.', description: 'Tratamientos claros para todo tu equipo.' },
  { id: 'laboratory', label: 'Laboratorio', icon: FlaskConical, title: 'Cada trabajo, a tiempo.', description: 'Sigue tus pedidos de principio a fin.' },
] as const;

export default function HeroLivePreview() {
  const [activeModule, setActiveModule] = useState<Module>('agenda');
  const currentModule = modules.find(item => item.id === activeModule)!;
  const [appointments, setAppointments] = useState(initialAppointments);
  const [day, setDay] = useState(0);
  const [view, setView] = useState<'week' | 'day'>('week');
  const [doctor, setDoctor] = useState('all');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState('Selecciona una cita para ver sus detalles.');
  const [error, setError] = useState('');
  const trigger = useRef<HTMLButtonElement | null>(null);
  const dayHeading = useRef<HTMLSpanElement | null>(null);
  const selected = appointments.find(item => item.id === selectedId);
  const filtered = appointments.filter(item => doctor === 'all' || item.doctor === Number(doctor));
  const daily = filtered.filter(item => item.day === day).sort((a, b) => a.time.localeCompare(b.time));

  function changeModule(module: Module) {
    setActiveModule(module);
    const hints = { agenda: 'Selecciona una cita para ver sus detalles.', patients: 'Busca un paciente y explora su ficha.', services: 'Filtra los tratamientos y consulta sus detalles.', laboratory: 'Abre un trabajo para actualizar su estado.' };
    setNotice(hints[module]);
  }

  function openCreate(button: HTMLButtonElement) {
    trigger.current = button;
    setError('');
    setCreating(true);
  }

  function addAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = {
      id: Math.max(...appointments.map(item => item.id)) + 1,
      patient: String(data.get('patient')), treatment: String(data.get('treatment')),
      day: Number(data.get('day')), time: String(data.get('time')),
      doctor: Number(data.get('doctor')), confirmed: false,
    };
    if (appointments.some(item => item.day === next.day && item.time === next.time && item.doctor === next.doctor)) {
      setError('Este doctor ya tiene una cita a esa hora. Elige otro horario o profesional.');
      return;
    }
    setAppointments(current => [...current, next]);
    setDay(next.day);
    setDoctor('all');
    setCreating(false);
    setNotice(`Cita de ejemplo creada: ${next.patient}, ${days[next.day].toLowerCase()} a las ${next.time}.`);
  }

  function appointmentButton(item: Appointment, compact = false) {
    return (
      <button key={item.id} type="button" className={`demo-appointment demo-color-${item.doctor} ${compact ? 'demo-appointment-list' : ''}`}
        onClick={event => { trigger.current = event.currentTarget; setSelectedId(item.id); }}
        aria-label={`Ver cita de ${item.patient}, ${days[item.day]} a las ${item.time}`}>
        <span className="demo-appointment-name">{item.patient}</span>
        <span>{item.treatment}</span>
        <span className="demo-appointment-time">{item.time} <span aria-label={item.confirmed ? 'Confirmada' : 'Por confirmar'}>{item.confirmed ? <Check size={12} aria-hidden="true" /> : '· Por confirmar'}</span></span>
      </button>
    );
  }

  return (
    <div className="demo-wrap">
      <div className="demo-invitation"><MousePointer2 size={14} aria-hidden="true" /> Tu consultorio, a un clic <span>Prueba la demo</span></div>
      <div className="demo-window">
        <div className="demo-browser-bar">
          <div className="demo-window-lights" aria-hidden="true"><i /><i /><i /></div>
          <span className="demo-address">app.clidenta.net</span>
          <span className="demo-label">Demo interactiva</span>
        </div>
        <div className="demo-app">
          <aside className="demo-sidebar" aria-label="Resumen de la agenda de ejemplo">
            <div className="demo-sidebar-brand">Tu consultorio<span>Todo en su lugar.</span></div>
            <nav className="demo-module-nav" aria-label="Módulos de la demo">{modules.map(module => <button type="button" key={module.id} aria-pressed={activeModule === module.id} onClick={() => changeModule(module.id)}><module.icon size={17} aria-hidden="true" />{module.label}</button>)}</nav>
            <div className="demo-team-label">TU EQUIPO</div>
            {doctors.map((name, index) => <div className="demo-team-member" key={name}><span className={`demo-team-dot demo-color-${index}`} />{name}</div>)}
            <div className="demo-sidebar-summary"><span className="demo-summary-number">{appointments.length}</span><span>citas esta semana</span><div><ShieldCheck size={15} aria-hidden="true" /> Datos de ejemplo</div></div>
          </aside>
          <div className="demo-workspace">
            <nav className="demo-mobile-nav" aria-label="Módulos de la demo">{modules.map(module => <button type="button" key={module.id} aria-pressed={activeModule === module.id} onClick={() => changeModule(module.id)}><module.icon size={16} aria-hidden="true" /><span>{module.label}</span></button>)}</nav>
            <div className="demo-app-heading"><div><h2>{currentModule.title}</h2><p>{currentModule.description}</p></div>{activeModule === 'agenda' ? <button type="button" className="demo-primary" onClick={event => openCreate(event.currentTarget)}><Plus size={16} aria-hidden="true" /> Nueva cita</button> : <span className="demo-module-badge">Datos de ejemplo</span>}</div>
            <div className="demo-calendar" hidden={activeModule !== 'agenda'}>
              <div className="demo-toolbar">
                <div className="demo-month"><CalendarDays size={16} aria-hidden="true" /><span>Septiembre <strong>2026</strong></span></div>
                <div className="demo-view-toggle" aria-label="Vista de la agenda"><button type="button" aria-pressed={view === 'week'} onClick={() => setView('week')}>Semana</button><button type="button" aria-pressed={view === 'day'} onClick={() => setView('day')}>Día</button></div>
                <label className="demo-doctor-filter"><Users size={15} aria-hidden="true" /><span className="sr-only">Filtrar por doctor</span><select value={doctor} onChange={event => setDoctor(event.target.value)}><option value="all">Todos los doctores</option>{doctors.map((name, index) => <option key={name} value={index}>{name}</option>)}</select></label>
              </div>
              <div className="demo-day-strip" aria-label="Días de la semana de ejemplo">{days.map((name, index) => <button key={name} type="button" aria-pressed={day === index} onClick={() => setDay(index)}><span>{name.slice(0, 3)}</span><strong>{7 + index}</strong></button>)}</div>
              <div className={`demo-week ${view === 'day' ? 'demo-hidden' : ''}`}>
                <div className="demo-week-header"><span aria-hidden="true" /><div className="demo-week-days">{days.map((name, index) => <button key={name} type="button" aria-label={`Ver ${name} ${7 + index} de septiembre`} aria-pressed={day === index} onClick={() => { setDay(index); setView('day'); requestAnimationFrame(() => dayHeading.current?.focus()); }}><span>{name}</span><strong>{7 + index}</strong></button>)}</div></div>
                {hours.map(time => <div className="demo-hour-row" key={time}><time>{time}</time><div className="demo-hour-cells">{days.map((_, index) => <div className={`demo-calendar-cell ${day === index ? 'demo-cell-selected' : ''}`} key={index}>{filtered.filter(item => item.day === index && item.time === time).map(item => appointmentButton(item))}</div>)}</div></div>)}
              </div>
              <div className={`demo-day-view ${view === 'day' ? 'demo-day-visible' : ''}`}>
                <div className="demo-day-heading"><button type="button" className="demo-icon-button" aria-label="Día anterior" disabled={day === 0} onClick={() => setDay(current => current - 1)}><ChevronLeft size={18} /></button><span ref={dayHeading} tabIndex={-1}>{days[day]}, {7 + day} de septiembre</span><button type="button" className="demo-icon-button" aria-label="Día siguiente" disabled={day === 4} onClick={() => setDay(current => current + 1)}><ChevronRight size={18} /></button></div>
                <div className="demo-day-appointments">{daily.length ? daily.map(item => <div className="demo-day-row" key={item.id}><time>{item.time}</time>{appointmentButton(item, true)}</div>) : <p className="demo-empty">Sin citas para este profesional. Puedes añadir una cita de ejemplo.</p>}</div>
              </div>
              <div className="demo-calendar-foot"><span><Check size={11} aria-hidden="true" /> Confirmada</span><span><Clock3 size={10} aria-hidden="true" /> Por confirmar</span><span>{filtered.length} citas en la semana</span></div>
            </div>
            <DemoModules activeModule={activeModule} appointments={appointments} onNotice={setNotice} />
          </div>
        </div>
        <div className="demo-status" role="status"><MousePointer2 size={14} aria-hidden="true" /><span>{notice}</span></div>
      </div>
      <p className="demo-disclaimer">Explora con datos ficticios. Los cambios solo duran durante esta visita.</p>

      <Dialog open={selectedId !== null || creating} onOpenChange={open => { if (!open) { setSelectedId(null); setCreating(false); } }}>
        <DialogContent className="demo-dialog" showCloseButton={false} onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus(); }}>
          <DialogClose className="demo-dialog-close demo-icon-button" aria-label="Cerrar"><X size={20} /></DialogClose>
          {creating ? <>
            <span className="demo-dialog-eyebrow">PRUEBA CLIDENTA</span>
            <DialogTitle className="demo-dialog-title">Un lugar en tu agenda.</DialogTitle>
            <DialogDescription>Elige los datos de ejemplo y mira cómo aparece la cita.</DialogDescription>
            <form onSubmit={addAppointment} className="demo-form">
              <label>Paciente<select name="patient">{patients.map(name => <option key={name}>{name}</option>)}</select></label>
              <label>Tratamiento<select name="treatment">{treatments.map(name => <option key={name}>{name}</option>)}</select></label>
              <label>Profesional<select name="doctor" defaultValue={doctor === 'all' ? '0' : doctor}>{doctors.map((name, index) => <option key={name} value={index}>{name}</option>)}</select></label>
              <div className="demo-form-row"><label>Día<select name="day" defaultValue={day}>{days.map((name, index) => <option key={name} value={index}>{name} {7 + index}</option>)}</select></label><label>Hora<select name="time" defaultValue="11:00">{hours.map(time => <option key={time}>{time}</option>)}</select></label></div>
              {error ? <p className="demo-form-error" role="alert">{error}</p> : null}
              <button className="demo-primary" type="submit"><Plus size={16} aria-hidden="true" /> Crear cita de ejemplo</button>
            </form>
          </> : selected ? <>
            <span className="demo-dialog-eyebrow">DETALLE DE LA CITA · DEMO</span>
            <DialogTitle className="demo-dialog-title">{selected.patient}</DialogTitle>
            <DialogDescription>{selected.treatment}</DialogDescription>
            <div className={`demo-detail-status ${selected.confirmed ? 'is-confirmed' : ''}`}>{selected.confirmed ? <Check size={15} aria-hidden="true" /> : <Clock3 size={15} aria-hidden="true" />}{selected.confirmed ? 'Cita confirmada' : 'Pendiente de confirmación'}</div>
            <dl className="demo-details"><div><dt>Fecha</dt><dd>{days[selected.day]}, {7 + selected.day} de septiembre</dd></div><div><dt>Hora</dt><dd>{selected.time} · 60 minutos</dd></div><div><dt>Profesional</dt><dd>{doctors[selected.doctor]}</dd></div></dl>
            {!selected.confirmed ? <button type="button" className="demo-primary" onClick={() => { setAppointments(current => current.map(item => item.id === selected.id ? { ...item, confirmed: true } : item)); setNotice(`Cita de ejemplo de ${selected.patient} confirmada.`); }}><Check size={16} aria-hidden="true" /> Confirmar cita de ejemplo</button> : <p className="demo-confirmed-note" role="status">Todo listo. Esta cita está confirmada en la demo.</p>}
          </> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
