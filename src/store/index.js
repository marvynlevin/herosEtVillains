import Vue from "vue";
import Vuex from "vuex";

import hero from './hero.store';
import team from './team.store';
import org from './org.store';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    hero: hero,
    team: team,
    org: org,
  },
});
