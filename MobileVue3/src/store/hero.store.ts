import {defineStore} from 'pinia';
import {getAllHeroes, getHeroById, createHero, updateHero, Hero, HeroAlias} from "@/services/hero.service";
import {useErrorStore} from './error.store';

interface HeroState {
    heroesAliases: HeroAlias[];
    heroesDetails: Hero[];
    currentHero: Hero | null;
    loading: boolean;
}

export const useHeroStore = defineStore('hero', {
    state: (): HeroState => ({
        heroesAliases: [],
        heroesDetails: [],
        currentHero: null,
        loading: false,
    }),
    actions: {
        async fetchHeroesAliases() {
            this.loading = true;
            try {
                this.heroesAliases = (await getAllHeroes()).data;
            } catch (error: any) {
                useErrorStore().setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async fetchHeroById({id, orgSecret}: { id: string; orgSecret: string }) {
            this.loading = true;
            try {
                const hero = await getHeroById(id, orgSecret);
                if (hero && hero.data.length > 0) {
                    this.setHeroDetails(hero.data[0]);
                    return hero.data[0];
                }
                return null;
            } catch (error: any) {
                useErrorStore().setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async createHero(heroData: Hero) {
            this.loading = true;
            try {
                const newHero = (await createHero(heroData)).data;
                this.heroesAliases.push(newHero);
                this.currentHero = newHero;
                return newHero;
            } catch (error: any) {
                useErrorStore().setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async updateHero({heroData, orgSecret}: { heroData: Hero; orgSecret: string }) {
            this.loading = true;
            try {
                const updatedHero = (await updateHero(heroData, orgSecret)).data;
                this.setHeroDetails(updatedHero);
                this.currentHero = updatedHero;
            } catch (error: any) {
                useErrorStore().setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        setHeroDetails(hero: Hero) {
            const index = this.heroesDetails.findIndex(h => h._id === hero._id);
            if (index !== -1) {
                this.heroesDetails[index] = hero;
            } else {
                this.heroesDetails.push(hero);
            }
        },
    },
    getters: {
        getHeroesAliases: (state) => state.heroesAliases,
        getCurrentHero: (state) => state.currentHero,
        isHeroLoading: (state) => state.loading,
        getHeroesDetails: (state) => state.heroesDetails,
    },
});