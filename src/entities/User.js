import { db } from '@/api/localClient'

const store = db.entities.User

export const User = {
  ...store,
  me: () => db.auth.me(),
  login: () => db.auth.login(),
  logout: (redirectUrl) => db.auth.logout(redirectUrl),
  loginWithRedirect: (returnUrl) => db.auth.redirectToLogin(returnUrl),
  updateMyUserData: (data) => db.auth.updateMyUserData(data),
}

export default User
