<template>
	<v-container>
		<v-card>
			<v-card-title>Modifier les informations de mon héro</v-card-title>
			<v-card-text>
				<v-form @submit.prevent="updateHero">
					<v-text-field v-model="hero.alias" label="Alias" required></v-text-field>
					<v-text-field v-model="hero.firstname" label="Prnom" required></v-text-field>
					<v-text-field v-model="hero.lastname" label="Nom" required></v-text-field>
					<v-text-field v-model="hero.power" label="Pouvoir" required></v-text-field>
					<v-btn type="submit" color="primary" :loading="loading">Modifier</v-btn>
				</v-form>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>
import {AuthService} from "@/services/auth.service";
import {getHeroById, updateAuthHero} from "@/services/hero.service";

export default {
	name: "HeroAuthUpdateComponent",
	data() {
		return {
			hero: {
				alias: '',
				firstname: '',
				lastname: '',
				power: '',
			},
			loading: false,
			error: null,
		};
	},
	async mounted() {
		try {
			const user = await AuthService.getUser(localStorage.getItem('login'));
			const hero = await getHeroById(user.data.heroId);
			this.hero = hero;
		} catch (error) {
			this.error = error.message;
		}
	},
	methods: {
		async updateHero() {
			this.loading = true;
			try {
				await updateAuthHero(this.hero);
				this.$router.push({name: 'Home'});
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
		},
	},
};
</script>