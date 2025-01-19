import { CanActivateFn } from '@angular/router';

export const guardiaGuard: CanActivateFn = (route, state) => {
  const ruolo = localStorage.getItem("ruolo");
  const email = localStorage.getItem("email");

  return ruolo !== null && ruolo === 'admin' && email !== null;
};
