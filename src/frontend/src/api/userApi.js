import { apiFetch } from "./httpClient";

//Gewohnheitstier aus der Datenbank abrufen
export async function fetchAnimal(token) {
  return apiFetch('/api/users/animal', { token });
}

//Gewohnheitstier in der Datenbank setzen/aktualisieren
export async function setAnimal(token, animalType, animalMood) {
  return apiFetch('/api/users/animal', {
    method: 'PUT',
    token,
    body: { animal_type: animalType, animal_mood: animalMood },
  });
}