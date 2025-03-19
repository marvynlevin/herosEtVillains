import {getAllHeroes, getHeroById, createHero, updateHero} from "@/services/hero.service";

export default {
    namespaced: true,
    state: {
        heroesAliases: [],
        heroesDetails: [],
        currentHero: null,
        loading: false,
        error: null,
    },
    mutations: {
        SET_HEROES_ALIASES(state, aliases) {
            state.heroesAliases = aliases;
        },
        SET_CURRENT_HERO(state, hero) {
            state.currentHero = hero;
        },
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        ADD_HERO(state, newHero) {
            state.heroesAliases.push(newHero);
        },
        SET_HERO_DETAILS(state, hero) {
            console.log(state.heroesDetails)
            const index = state.heroesDetails.findIndex(h => h._id === hero._id);
            if (index !== -1) {
                state.heroesDetails[index] = hero;
            } else {
                state.heroesDetails.push(hero);
            }
        },
    },
    actions: {
        async fetchHeroesAliases({commit}) {
            commit("SET_LOADING", true);
            try {
                const heroes = await getAllHeroes();
                commit("SET_HEROES_ALIASES", heroes);
            } catch (error) {
                commit("SET_ERROR", error.message);
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async fetchHeroById({commit}, {id, orgSecret}) {
            commit("SET_LOADING", true);
            try {
                const hero = await getHeroById(id, orgSecret);
                commit("SET_HERO_DETAILS", hero[0]);
                return hero[0];
            } catch (error) {
                commit("SET_ERROR", error.message);
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async createHero({commit}, heroData) {
            commit("SET_LOADING", true);
            try {
                const newHero = await createHero(heroData);
                commit("ADD_HERO", newHero);
                commit("SET_CURRENT_HERO", newHero);
                return newHero;
            } catch (error) {
                commit("SET_ERROR", error.message);
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async updateHero({commit, state}, {heroData, orgSecret}) {
            commit("SET_LOADING", true);
            try {
                const updatedHero = await updateHero(heroData, orgSecret);
                commit("SET_HERO_DETAILS", updatedHero);
                commit("SET_CURRENT_HERO", updatedHero);
            } catch (error) {
                commit("SET_ERROR", error.message);
            } finally {
                commit("SET_LOADING", false);
            }
        },
    },
    getters: {
        getHeroesAliases: (state) => state.heroesAliases,
        getCurrentHero: (state) => state.currentHero,
        isHeroLoading: (state) => state.loading,
        getHeroError: (state) => state.error,
        getHeroesDetails: (state) => state.heroesDetails,
    },
};
