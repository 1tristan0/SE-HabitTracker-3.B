import { apiFetch } from "./httpClient";

//Gewohnheitstier aus der Datenbank abrufen
export async function fetchAnimal(token) {
  return apiFetch('/api/animal', { token });
}