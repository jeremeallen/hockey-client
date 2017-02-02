const localStorage = window.localStorage;

const AuthPlugin = {
  setToken(token) {
    localStorage.setItem('authToken', token);
  },

  destroyToken() {
    localStorage.removeItem('authToken');
  },

  getToken() {
    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user).token;
  },

  loggedIn() {
    if (this.getToken()) {
      return true;
    }

    return false;
  },
};

export default function (Vue) {
  const VueObject = Vue;
  VueObject.auth = AuthPlugin;

  Object.defineProperties(VueObject.prototype, {
    $auth: {
      get() {
        return VueObject.auth;
      },
    },
  });
}
