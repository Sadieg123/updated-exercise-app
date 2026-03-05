import { useState, useEffect, useRef } from "react";


// ─── RepetitionExercise Component ─────────────────────────────────────────────
function RepetitionExercise({ name, goal }) {
  const [count, setCount] = useState(0);

  const handleReset = () => setCount(0);
  const handleUndo = () => setCount((c) => Math.max(0, c - 1));
  const handleComplete = () => setCount((c) => c + 1);

  const remaining = goal ? Math.max(0, goal - count) : null;
  const progress = goal ? Math.min(1, count / goal) : 0;

  return (
    <div style={styles.exerciseScreen}>
      <h1 style={styles.exerciseTitle}>{name}</h1>

      {goal && (
        <div style={styles.progressRing}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="76" fill="none" stroke="#2a2a2a" strokeWidth="10" />
            <circle
              cx="90"
              cy="90"
              r="76"
              fill="none"
              stroke="#e8ff3c"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 76}`}
              strokeDashoffset={`${2 * Math.PI * 76 * (1 - progress)}`}
              transform="rotate(-90 90 90)"
            />
          </svg>

          <div style={styles.ringCenter}>
            <span style={styles.bigCount}>{count}</span>
            <span style={styles.ringLabel}>reps done</span>
          </div>
        </div>
      )}

      {remaining !== null && (
        <p style={styles.remainingText}>{remaining} reps remaining</p>
      )}

      <div style={styles.btnGroup}>
        <button style={styles.primaryBtn} onClick={handleComplete}>
          Complete Rep
        </button>

        <button style={styles.secondaryBtn} onClick={handleUndo}>
          Undo
        </button>

        <button style={styles.ghostBtn} onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}


// ─── DurationExercise Component ───────────────────────────────────────────────
function DurationExercise({ name, goalSeconds }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleReset = () => {
    setRunning(false);
    setElapsed(0);
  };

  const pad = (n) => String(n).padStart(2, "0");

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  const goal = goalSeconds || 60;
  const progress = Math.min(1, elapsed / goal);

  const remaining = Math.max(0, goal - elapsed);
  const remMins = Math.floor(remaining / 60);
  const remSecs = remaining % 60;

  return (
    <div style={styles.exerciseScreen}>
      <h1 style={styles.exerciseTitle}>{name}</h1>

      <div style={styles.progressRing}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="76" fill="none" stroke="#2a2a2a" strokeWidth="10" />

          <circle
            cx="90"
            cy="90"
            r="76"
            fill="none"
            stroke="#e8ff3c"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 76}`}
            strokeDashoffset={`${2 * Math.PI * 76 * (1 - progress)}`}
            transform="rotate(-90 90 90)"
          />
        </svg>

        <div style={styles.ringCenter}>
          <span style={styles.bigCount}>
            {pad(mins)}:{pad(secs)}
          </span>
          <span style={styles.ringLabel}>elapsed</span>
        </div>
      </div>

      <p style={styles.remainingText}>
        {pad(remMins)}:{pad(remSecs)} remaining
      </p>

      <div style={styles.btnGroup}>
        {!running ? (
          <button style={styles.primaryBtn} onClick={() => setRunning(true)}>
            Start
          </button>
        ) : (
          <button style={styles.primaryBtn} onClick={() => setRunning(false)}>
            Pause
          </button>
        )}

        <button style={styles.ghostBtn} onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}


// ─── WeightExercise Component ─────────────────────────────────────────────
function WeightExercise({ name }) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState([]);

  const addSet = () => {
    if (!weight || !reps) return;

    setSets([
      ...sets,
      { weight: Number(weight), reps: Number(reps) }
    ]);

    setWeight("");
    setReps("");
  };

  const resetSets = () => setSets([]);

  return (
    <div style={styles.exerciseScreen}>
      <h1 style={styles.exerciseTitle}>{name}</h1>

      <div style={styles.weightInputs}>
        <input
          style={styles.input}
          placeholder="Weight (lbs)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
      </div>

      <button style={styles.primaryBtn} onClick={addSet}>
        Add Set
      </button>

      <div style={styles.setList}>
        {sets.map((set, i) => (
          <div key={i} style={styles.setItem}>
            Set {i + 1}: {set.weight} lbs × {set.reps} reps
          </div>
        ))}
      </div>

      <button style={styles.ghostBtn} onClick={resetSets}>
        Reset Workout
      </button>
    </div>
  );
}


// ─── Exercise Menu ─────────────────────────────────────────────────────────────
const exercises = [
  { name: "Push Ups", type: "rep", goal: 20 },
  { name: "Running", type: "duration", goalSeconds: 2700 },
  { name: "Plank", type: "duration", goalSeconds: 60 },
  { name: "Sit Ups", type: "rep", goal: 30 },
  { name: "Jumping Jacks", type: "rep", goal: 50 },
  { name: "Cool Down Run", type: "duration", goalSeconds: 600 },

  // NEW EXERCISES
  { name: "Bench Press", type: "weight" },
  { name: "Deadlift", type: "weight" }
];


// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleBack = () => setSelected(null);

  if (selected) {
    const ex = exercises.find((e) => e.name === selected);

    return (
      <div style={styles.app}>

        <button style={styles.backBtn} onClick={handleBack}>
          ← Back
        </button>

        {ex.type === "rep" && (
          <RepetitionExercise name={ex.name} goal={ex.goal} />
        )}

        {ex.type === "duration" && (
          <DurationExercise name={ex.name} goalSeconds={ex.goalSeconds} />
        )}

        {ex.type === "weight" && (
          <WeightExercise name={ex.name} />
        )}

      </div>
    );
  }

  return (
    <div style={styles.app}>

      {/* Header */}
      <div style={styles.header}>

        <button
          style={styles.menuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span style={styles.menuLine} />
          <span style={styles.menuLine} />
          <span style={styles.menuLine} />
        </button>

        {menuOpen && (
          <div style={styles.dropdown}>
            <p style={styles.dropItem}>Profile</p>
            <p style={styles.dropItem}>History</p>
            <p style={styles.dropItem}>Settings</p>
          </div>
        )}

      </div>

      <h1 style={styles.welcomeTitle}>Welcome!</h1>

      {/* Search */}
      <div style={styles.searchWrap}>
        <input
          style={styles.searchInput}
          placeholder="Search exercises…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <span style={styles.searchIcon}>🔍</span>
      </div>

      {/* Exercise List */}
      <div style={styles.list}>

        {filtered.map((ex) => (

          <button
            key={ex.name}
            style={styles.exerciseCard}
            onClick={() => setSelected(ex.name)}
          >

            <div style={styles.cardIcon}>

              {ex.type === "rep" && "💪"}
              {ex.type === "duration" && "⏱"}
              {ex.type === "weight" && "🏋️"}

            </div>

            <div style={styles.cardText}>
              <span style={styles.cardName}>{ex.name}</span>

              <span style={styles.cardGoal}>
                {ex.type === "rep" && `${ex.goal} reps`}

                {ex.type === "duration" &&
                  `${Math.floor(ex.goalSeconds / 60)} min`}

                {ex.type === "weight" && "Track sets"}
              </span>
            </div>

            <span style={styles.chevron}>›</span>

          </button>
        ))}

      </div>

    </div>
  );
}


// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = {

  app: {
    background: "#f7f7f7",        
    minHeight: "100vh",
    maxWidth: 430,
    margin: "0 auto",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    color: "#111",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
  },

  header: {
    padding: "20px 24px 0",
    position: "relative",
    width: "100%",
  },

  menuBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },

  menuLine: {
    width: 26,
    height: 2,
    background: "#111",
  },

  dropdown: {
    position: "absolute",
    top: 60,
    left: 24,
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: 12,
  },

  dropItem: {
    padding: "10px 20px",
    color: "#111",
  },

  welcomeTitle: {
    textAlign: "center",
    fontSize: 36,
    margin: "16px 0",
  },

  searchWrap: {
    margin: "10px 24px",
    background: "#fff",
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    border: "1px solid #ccc",
  },

  searchInput: {
    flex: 1,
    background: "none",
    border: "none",
    color: "#111",
    padding: "14px 0",
  },

  searchIcon: {
    fontSize: 18,
  },

  list: {
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    width: "100%",
  },

  exerciseCard: {
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    gap: 16,
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },

  cardIcon: {
    width: 52,
    height: 52,
    background: "#e8ff3c",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
  },

  cardText: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  cardName: {
    fontSize: 17,
    fontWeight: 600,
  },

  cardGoal: {
    fontSize: 14,
    color: "#555",
  },

  chevron: {
    fontSize: 22,
    color: "#888",
  },

  exerciseScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 32px",
    gap: 20,
    width: "100%",
    boxSizing: "border-box",
  },

  exerciseTitle: {
    fontSize: 32,
    color: "#111",
  },

  progressRing: {
    position: "relative",
    width: 180,
    height: 180,
  },

  ringCenter: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  bigCount: {
    fontSize: 36,
    fontWeight: 800,
    color: "#111",
  },

  ringLabel: {
    fontSize: 12,
    color: "#555",
  },

  remainingText: {
    fontSize: 15,
    color: "#555",
  },

  btnGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    width: "100%",
  },

  primaryBtn: {
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 50,
    padding: "16px 0",
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
  },

  secondaryBtn: {
    background: "#fff",
    border: "1px solid #111",
    borderRadius: 50,
    padding: "14px 0",
    color: "#111",
    width: "100%",
  },

  ghostBtn: {
    background: "transparent",
    border: "none",
    color: "#555",
  },

  backBtn: {
    background: "none",
    border: "none",
    color: "#111",
    fontSize: 16,
    cursor: "pointer",
    padding: "20px",
  },

  weightInputs: {
    display: "flex",
    gap: 10,
    width: "100%",
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "#fff",
    color: "#111",
  },

  setList: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  setItem: {
    background: "#fff",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ccc",
  }

};