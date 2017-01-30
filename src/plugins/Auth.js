const localStorage = window.localStorage;

const AuthPlugin = {
  setToken(token) {
    localStorage.setItem('authToken', token);
  },

  destroyToken() {
    localStorage.removeItem('authToken');
  },

  getToken() {
    const token = localStorage.getItem('authToken');

    if (!token) {
      return null;
    }

    return token;
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
