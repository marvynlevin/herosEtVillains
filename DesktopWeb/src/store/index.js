import Vue from "vue";
import Vuex from "vuex";

import hero from './hero.store';
import team from './team.store';
import org from './org.store';
import error from './error.store'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {hero, team, org, error},
});
