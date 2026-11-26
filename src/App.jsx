import { useEffect, useState } from 'react';
import './App.css';
import {
  studio,
  rooms,
  members,
  trainers,
  sessions
} from './data/studioData.js';

// STATUS_LABELS: durum kodunu (next, planned...) ekranda görünen Türkçe yazıya çeviren sözlük.
const STATUS_LABELS = {
  next: 'Sıradaki',
  planned: 'Planlı',
  started: 'Başladı',
  past: 'Geçti'
};

const ICON_PATHS = {
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  door: (
    <>
      <path d="M6 21V4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21" />
      <path d="M3.5 21h17" />
      <path d="M14.5 12.5v.01" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 10h17M8.5 3v4M15.5 3v4" />
    </>
  ),
  arrow: <path d="M7 17 17 7M8.5 7H17v8.5" />
};

function Icon({ name }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2c.8 5.5 4.5 9.2 10 10-5.5.8-9.2 4.5-10 10-.8-5.5-4.5-9.2-10-10 5.5-.8 9.2-4.5 10-10Z" />
    </svg>
  );
}

function useNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  return now;
}

function toMinutes(time) {
  const [hours, minutes] = time.split('.').map(Number);
  return hours * 60 + minutes;
}

// Ders bitiş saati veride olmadığı için durum yalnızca başlangıç saatine göre belirlenir.
function getSchedule(now) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const sorted = [...sessions].sort(
    (a, b) => toMinutes(a.time) - toMinutes(b.time)
  );
  const nextIndex = sorted.findIndex(
    (session) => toMinutes(session.time) > nowMinutes
  );
  const lastStartedIndex =
    nextIndex === -1 ? sorted.length - 1 : nextIndex - 1;

  const items = sorted.map((session, index) => {
    let status = 'past';
    if (index === nextIndex) status = 'next';
    else if (nextIndex !== -1 && index > nextIndex) status = 'planned';
    else if (index === lastStartedIndex) status = 'started';
    return { ...session, status };
  });

  const featured =
    nextIndex === -1 ? items[items.length - 1] : items[nextIndex];

  return { items, featured };
}

function initial(name) {
  return name.charAt(0).toLocaleUpperCase('tr-TR');
}

function Landscape() {
  return (
    <svg
      className="landscape"
      viewBox="0 0 600 360"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8b9c8" />
          <stop offset="0.55" stopColor="#e9c4b6" />
          <stop offset="1" stopColor="#f6d6c0" />
        </linearGradient>
        <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff4ea" />
          <stop offset="0.6" stopColor="#fbdcc5" />
          <stop offset="1" stopColor="#f6c4a6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6c6c0" />
          <stop offset="1" stopColor="#bfaebd" />
        </linearGradient>
        <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4e8e3" />
          <stop offset="1" stopColor="#e7d6d2" />
        </linearGradient>
      </defs>
      <rect width="600" height="360" fill="url(#sky)" />
      <circle cx="398" cy="206" r="78" fill="url(#sun)" />
      <circle cx="398" cy="206" r="34" fill="#fff1e4" />
      <path
        d="M0 214c70-20 128-30 196-22s120 20 196 10 150-18 208-6v40H0Z"
        fill="#d6b5b4"
      />
      <rect y="226" width="600" height="134" fill="url(#water)" />
      <ellipse cx="398" cy="252" rx="64" ry="5" fill="#fbe3d2" opacity="0.8" />
      <ellipse cx="398" cy="270" rx="38" ry="3" fill="#fbe3d2" opacity="0.55" />
      <path
        d="M0 300c90-26 190-30 290-16s170 22 310 4v72H0Z"
        fill="url(#sand)"
      />
    </svg>
  );
}

function Gauge({ value, total }) {
  const percent = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div className="gauge">
      <svg viewBox="0 0 120 104" aria-hidden="true">
        <defs>
          <linearGradient id="gauge-fill" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#f9c9ac" />
            <stop offset="1" stopColor="#ef9a72" />
          </linearGradient>
        </defs>
        <path
          className="gauge-track"
          d="M26.06 93.94A48 48 0 1 1 93.94 93.94"
          pathLength="100"
        />
        <path
          className="gauge-value"
          d="M26.06 93.94A48 48 0 1 1 93.94 93.94"
          pathLength="100"
          strokeDasharray={`${percent} 100`}
        />
      </svg>
      <p className="gauge-label">
        <strong>%{percent}</strong>
        <span>
          {value}/{total} eğitmen
        </span>
      </p>
    </div>
  );
}

export default function App() {
  const now = useNow();
  const { items, featured } = getSchedule(now);
  const dayMonth = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long'
  }).format(now);
  const weekday = new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long'
  }).format(now);

  const assignedTrainers = new Set(sessions.map((s) => s.trainer));
  const usedRooms = new Set(sessions.map((s) => s.room));
  const first = items[0];
  const last = items[items.length - 1];
  const visibleMembers = members.slice(0, 5);

  return (
    <div className="page">
      <div className="frame">
        <header className="topbar">
          <div className="brand pill">
            <LogoMark />
            <span>{studio.name}</span>
          </div>

          <div className="account pill">
            <span className="today">
              <Icon name="calendar" />
              <time dateTime={new Intl.DateTimeFormat('sv-SE').format(now)}>
                {dayMonth}
                <span className="weekday"> {weekday}</span>
              </time>
            </span>
            <span className="avatar avatar-dark" aria-hidden="true">Y</span>
            <span className="account-name">Yönetici</span>
          </div>
        </header>

        <main className="grid">
          <h1 className="visually-hidden">{studio.name} Yönetim Paneli</h1>

          <section className="panel panel-left" aria-label="Bugünün dersleri">
            <div className="hero">
              <Landscape />

              {featured && (
                <article className="feature-card">
                  <div className="feature-head">
                    <h2>{featured.lesson}</h2>
                    <span className={`badge badge-${featured.status}`}>
                      {featured.status === 'next'
                        ? STATUS_LABELS.next
                        : 'Son ders'}
                    </span>
                  </div>
                  <p className="feature-room">{featured.room}</p>
                  <dl className="feature-tiles">
                    <div>
                      <dt>
                        <Icon name="clock" />
                        <span className="visually-hidden">Saat</span>
                      </dt>
                      <dd>{featured.time}</dd>
                    </div>
                    <div>
                      <dt>
                        <Icon name="user" />
                        <span className="visually-hidden">Eğitmen</span>
                      </dt>
                      <dd>{featured.trainer}</dd>
                    </div>
                  </dl>
                </article>
              )}

              <a className="hero-link" href="#program">
                <span className="hero-link-icon">
                  <Icon name="arrow" />
                </span>
                Tüm program
              </a>
            </div>

            <div id="program" className="schedule">
              <div className="section-head">
                <h2>Bugünün Ders Programı</h2>
                <span className="count">{items.length} ders</span>
              </div>

              <ol className="session-list">
                {items.map((session) => (
                  <li
                    key={session.id}
                    className={`session session-${session.status}`}
                  >
                    <time className="session-time">{session.time}</time>
                    <div className="session-body">
                      <strong>{session.lesson}</strong>
                      <span className="meta">
                        <span>
                          <Icon name="door" />
                          {session.room}
                        </span>
                        <span>
                          <Icon name="user" />
                          {session.trainer}
                        </span>
                      </span>
                    </div>
                    <span className={`badge badge-${session.status}`}>
                      {STATUS_LABELS[session.status]}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="panel panel-right" aria-label="Stüdyo özeti">
            <div className="headline">
              <p className="display">
                Bugün stüdyoda{' '}
                <span className="outlined">{items.length} ders</span> var
              </p>
              {first && (
                <p className="lede">
                  İlk ders saat {first.time}, son ders saat {last.time}.
                  Programda {usedRooms.size} salon ve {assignedTrainers.size}{' '}
                  eğitmen yer alıyor.
                </p>
              )}
            </div>

            <div id="ekip" className="team">
              <article className="card members-card">
                <div className="avatar-stack" aria-hidden="true">
                  {visibleMembers.map((name, index) => (
                    <span key={name} className={`avatar tone-${index % 3}`}>
                      {initial(name)}
                    </span>
                  ))}
                  {members.length > visibleMembers.length && (
                    <span className="avatar avatar-more">
                      +{members.length - visibleMembers.length}
                    </span>
                  )}
                </div>
                <h2>
                  <span className="figure">{members.length}</span> kayıtlı üye
                </h2>
                <ul className="chips">
                  {members.map((name) => (
                    <li key={name} className="chip">
                      {name}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="card trainers-card">
                <h2>Bugün derste olan eğitmenler</h2>
                <Gauge value={assignedTrainers.size} total={trainers.length} />
                <ul className="chips">
                  {trainers.map((name) => {
                    const busy = assignedTrainers.has(name);
                    return (
                      <li
                        key={name}
                        className={`chip ${busy ? 'chip-busy' : 'chip-free'}`}
                      >
                        {name}
                        {!busy && <span className="chip-note"> · boşta</span>}
                      </li>
                    );
                  })}
                </ul>
              </article>
            </div>
          </section>

          <section id="salonlar" className="panel panel-wide">
            <div className="section-head">
              <h2>Salonlar</h2>
              <span className="count">{rooms.length} salon</span>
            </div>

            <ul className="room-list">
              {/* map: dizideki her eleman için aynı JSX'i üretir. Burada her salon için bir <li>. */}
              {rooms.map((room) => {
                // filter: tüm derslerden sadece bu salondakileri seçer. s = o anki ders (session).
                const roomSessions = items.filter((s) => s.room === room.name);
                return (
                  <li key={room.name} className="room">
                    <h3>{room.name}</h3>
                    <ul className="chips">
                      {room.lessons.map((lesson) => (
                        <li key={lesson} className="chip chip-outline">
                          {lesson}
                        </li>
                      ))}
                    </ul>
                    <div className="room-today">
                      {roomSessions.length === 0 ? (
                        <p>Bugün bu salonda ders yok.</p>
                      ) : (
                        // map((s) => ...): salondaki her ders için bir <p> üretir; s = sıradaki ders.
                        roomSessions.map((s) => (
                          <p key={s.id}>
                            <Icon name="clock" />
                            <span>
                              {s.time} · {s.lesson} · {s.trainer}
                            </span>
                            <span className={`badge badge-${s.status}`}>
                              {/* Örn. s.status = 'next' ise ekranda 'Sıradaki' yazar. */}
                              {STATUS_LABELS[s.status]}
                            </span>
                          </p>
                        ))
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
