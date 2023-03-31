/* Vue */
import Vue from "vue";
// import router from "./router";
import store from "./store";

//import moment
import moment from "moment";

//Register date filter as a global function
Vue.filter("myDate", function (created) {
  return moment(created).format("D MMM YYYY");
});

Vue.config.productionTip = false;

/* App sass */
// import "./assets/style/app.scss";

/* App component */
import App from "./App";

import vuetify from "./plugins/vuetify";

/* eslint-disable no-new */
new Vue({
  el: "#app",

  // Attach the Vue instance to the window,
  // so it's available globally.
  created: function () {
    window.Vue = this;
  },

  // router,
  store,
  vuetify,
  render: (h) => h(App),
});
