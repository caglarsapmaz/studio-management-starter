
import './App.css';
import {
  studio,
  rooms,
  members,
  trainers,
  sessions
} from './data/studioData.js';

export default function App() {
  return (
    <main className="dashboard">
      <header>
        <p>{studio.name}</p>
        <h1>Yönetim Paneli</h1>
      </header>

      <section className="stats" aria-label="Stüdyo özeti">
        <article>
          <strong>{rooms.length}</strong>
          <p>Salon</p>
        </article>

        <article>
          <strong>{members.length}</strong>
          <p>Üye</p>
        </article>

        <article>
          <strong>{trainers.length}</strong>
          <p>Eğitmen</p>
        </article>
      </section>

      <section className="schedule">
        <h2>Bugünün Ders Programı</h2>

        <table>
          <thead>
            <tr>
              <th>Saat</th>
              <th>Ders</th>
              <th>Salon</th>
              <th>Eğitmen</th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td>{session.time}</td>
                <td>{session.lesson}</td>
                <td>{session.room}</td>
                <td>{session.trainer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
