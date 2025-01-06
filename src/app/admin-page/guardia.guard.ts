import { CanActivateFn } from '@angular/router';

export const guardiaGuard: CanActivateFn = (route, state) => {
  const ruolo = localStorage.getItem("ruolo");

  return ruolo !== null && ruolo === 'admin';
};
