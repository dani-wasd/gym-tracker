import { MUSCLE_GROUPS, type MuscleGroup } from "./definitions";

/* ---------- what gets stored with a workout ---------- */

export interface LoggedSet {
  reps: number;
  /** Null means bodyweight. */
  weightKg: number | null;
}

export interface LoggedExercise {
  exerciseId: string;
  /** May be empty: "I did this" without the numbers. */
  sets: LoggedSet[];
}

export const EXERCISE_LIMITS = {
  EXERCISES_PER_WORKOUT: 20,
  SETS_PER_EXERCISE: 12,
  MAX_REPS: 200,
  MAX_WEIGHT_KG: 1000,
};

/* ---------- the catalogue ---------- */

export interface Exercise {
  /** Stored in the database — never rename an id, only add new ones. */
  id: string;
  name: string;
  primary: MuscleGroup;
  secondary: MuscleGroup[];
}

const exercise = (
  id: string,
  name: string,
  primary: MuscleGroup,
  ...secondary: MuscleGroup[]
): Exercise => ({ id, name, primary, secondary });

export const EXERCISES: Exercise[] = [
  // Chest
  exercise("bench-press", "Bench press", "Chest", "Triceps", "Shoulders"),
  exercise("incline-bench-press", "Incline bench press", "Chest", "Shoulders", "Triceps"),
  exercise("dumbbell-bench-press", "Dumbbell bench press", "Chest", "Triceps", "Shoulders"),
  exercise("incline-dumbbell-press", "Incline dumbbell press", "Chest", "Shoulders", "Triceps"),
  exercise("chest-fly", "Chest fly", "Chest"),
  exercise("cable-crossover", "Cable crossover", "Chest"),
  exercise("push-up", "Push-up", "Chest", "Triceps", "Shoulders"),
  exercise("chest-dip", "Dip", "Chest", "Triceps", "Shoulders"),

  // Lats
  exercise("pull-up", "Pull-up", "Lats", "Biceps", "Upper Back"),
  exercise("chin-up", "Chin-up", "Lats", "Biceps"),
  exercise("lat-pulldown", "Lat pulldown", "Lats", "Biceps"),
  exercise("straight-arm-pulldown", "Straight-arm pulldown", "Lats"),

  // Upper back
  exercise("barbell-row", "Barbell row", "Upper Back", "Lats", "Biceps"),
  exercise("dumbbell-row", "Dumbbell row", "Upper Back", "Lats", "Biceps"),
  exercise("seated-cable-row", "Seated cable row", "Upper Back", "Lats", "Biceps"),
  exercise("t-bar-row", "T-bar row", "Upper Back", "Lats", "Biceps"),
  exercise("face-pull", "Face pull", "Upper Back", "Shoulders"),

  // Traps
  exercise("shrug", "Shrug", "Traps"),
  exercise("farmers-carry", "Farmer's carry", "Traps", "Forearms"),

  // Shoulders
  exercise("overhead-press", "Overhead press", "Shoulders", "Triceps"),
  exercise("dumbbell-shoulder-press", "Dumbbell shoulder press", "Shoulders", "Triceps"),
  exercise("arnold-press", "Arnold press", "Shoulders", "Triceps"),
  exercise("lateral-raise", "Lateral raise", "Shoulders"),
  exercise("front-raise", "Front raise", "Shoulders"),
  exercise("rear-delt-fly", "Rear delt fly", "Shoulders", "Upper Back"),
  exercise("upright-row", "Upright row", "Shoulders", "Traps"),

  // Biceps
  exercise("barbell-curl", "Barbell curl", "Biceps", "Forearms"),
  exercise("dumbbell-curl", "Dumbbell curl", "Biceps", "Forearms"),
  exercise("hammer-curl", "Hammer curl", "Biceps", "Forearms"),
  exercise("preacher-curl", "Preacher curl", "Biceps"),
  exercise("cable-curl", "Cable curl", "Biceps"),

  // Triceps
  exercise("triceps-pushdown", "Triceps pushdown", "Triceps"),
  exercise("skull-crusher", "Skull crusher", "Triceps"),
  exercise("overhead-triceps-extension", "Overhead triceps extension", "Triceps"),
  exercise("close-grip-bench-press", "Close-grip bench press", "Triceps", "Chest"),
  exercise("bench-dip", "Bench dip", "Triceps", "Chest"),

  // Forearms
  exercise("wrist-curl", "Wrist curl", "Forearms"),
  exercise("reverse-curl", "Reverse curl", "Forearms", "Biceps"),
  exercise("dead-hang", "Dead hang", "Forearms", "Lats"),

  // Abs
  exercise("plank", "Plank", "Abs"),
  exercise("crunch", "Crunch", "Abs"),
  exercise("hanging-leg-raise", "Hanging leg raise", "Abs"),
  exercise("cable-crunch", "Cable crunch", "Abs"),
  exercise("russian-twist", "Russian twist", "Abs"),
  exercise("ab-wheel", "Ab wheel rollout", "Abs", "Lower Back"),

  // Lower back
  exercise("deadlift", "Deadlift", "Lower Back", "Hamstrings", "Glutes", "Traps"),
  exercise("back-extension", "Back extension", "Lower Back", "Glutes", "Hamstrings"),
  exercise("good-morning", "Good morning", "Lower Back", "Hamstrings"),

  // Glutes
  exercise("hip-thrust", "Hip thrust", "Glutes", "Hamstrings"),
  exercise("glute-bridge", "Glute bridge", "Glutes", "Hamstrings"),
  exercise("cable-kickback", "Cable kickback", "Glutes"),
  exercise("hip-abduction", "Hip abduction", "Glutes"),

  // Quads
  exercise("back-squat", "Back squat", "Quads", "Glutes", "Lower Back"),
  exercise("front-squat", "Front squat", "Quads", "Glutes"),
  exercise("leg-press", "Leg press", "Quads", "Glutes"),
  exercise("leg-extension", "Leg extension", "Quads"),
  exercise("lunge", "Lunge", "Quads", "Glutes"),
  exercise("bulgarian-split-squat", "Bulgarian split squat", "Quads", "Glutes"),
  exercise("goblet-squat", "Goblet squat", "Quads", "Glutes"),

  // Hamstrings
  exercise("romanian-deadlift", "Romanian deadlift", "Hamstrings", "Glutes", "Lower Back"),
  exercise("leg-curl", "Leg curl", "Hamstrings"),
  exercise("nordic-curl", "Nordic curl", "Hamstrings"),

  // Calves
  exercise("standing-calf-raise", "Standing calf raise", "Calves"),
  exercise("seated-calf-raise", "Seated calf raise", "Calves"),

  // Cardio
  exercise("treadmill-run", "Treadmill run", "Cardio"),
  exercise("stationary-bike", "Stationary bike", "Cardio"),
  exercise("rowing-machine", "Rowing machine", "Cardio", "Upper Back"),
  exercise("stair-climber", "Stair climber", "Cardio", "Glutes"),
  exercise("jump-rope", "Jump rope", "Cardio", "Calves"),
];

const EXERCISES_BY_ID = new Map(EXERCISES.map((entry) => [entry.id, entry]));

export function exerciseById(id: string): Exercise | undefined {
  return EXERCISES_BY_ID.get(id);
}

/** Every muscle the given exercises work, primary or secondary, in list order. */
export function musclesOf(exerciseIds: readonly string[]): MuscleGroup[] {
  const worked = new Set(
    exerciseIds.flatMap((id) => {
      const found = exerciseById(id);
      return found ? [found.primary, ...found.secondary] : [];
    }),
  );
  return MUSCLE_GROUPS.filter((muscle) => worked.has(muscle));
}

/** Exercises matching a muscle filter (primary muscle) and a search string. */
export function findExercises(muscle: MuscleGroup | null, search: string): Exercise[] {
  const needle = search.trim().toLowerCase();
  return EXERCISES.filter(
    (entry) =>
      (muscle === null || entry.primary === muscle) &&
      (needle === "" || entry.name.toLowerCase().includes(needle)),
  );
}

/* ---------- reading sets back ---------- */

const describeSet = ({ reps, weightKg }: LoggedSet) =>
  weightKg === null ? `${reps}` : `${reps} @ ${weightKg} kg`;

/**
 * Sets in gym shorthand: "3 × 8 @ 60 kg" when they're all the same,
 * "8 @ 60 kg, 6 @ 70 kg" when they differ. Empty when no sets were noted.
 */
export function describeSets(sets: LoggedSet[]): string {
  if (sets.length === 0) return "";

  const [first, ...rest] = sets;
  const allSame = rest.every(
    (set) => set.reps === first.reps && set.weightKg === first.weightKg,
  );
  if (allSame) {
    return first.weightKg === null
      ? `${sets.length} × ${first.reps}`
      : `${sets.length} × ${describeSet(first)}`;
  }
  return sets.map(describeSet).join(", ");
}
