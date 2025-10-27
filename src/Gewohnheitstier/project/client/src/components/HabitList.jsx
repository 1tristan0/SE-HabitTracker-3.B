// z. B. HabitList.jsx
async function handleCheck(habitId) {
  await fetch(`/api/habits/${habitId}/check`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ last_checked: new Date().toISOString() }),
  });
  await fetchHabits(); // oder lokalen State updaten
}

{habits.map(h => (
  <HabitCard
    key={h.id}
    habit={h}
    onDelete={handleDelete}
    onCheck={handleCheck}   
  />
))}