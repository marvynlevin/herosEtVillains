<template>
	<v-container class="fill-height d-flex justify-center align-center">
		<v-card class="elevation-12" width="400">
			<v-toolbar dark color="primary">
				<v-toolbar-title>Authentification</v-toolbar-title>
			</v-toolbar>
			<v-card-text>
				<v-form @submit.prevent="handleLogin">
					<v-text-field
							v-model="login"
							label="Login"
							type="text"
							required
							:rules="loginRules"
					></v-text-field>
					<v-text-field
							v-model="password"
							label="Mot de passe"
							type="password"
							required
							:rules="passwordRules"
					></v-text-field>
					<v-btn
							type="submit"
							color="primary"
							class="mr-4"
							:loading="loading"
							:disabled="!formValid"
					>
						<span v-if="loading">Chargement...</span>
						<span v-else>Se connecter</span>
					</v-btn>
					<v-alert
							v-if="error"
							type="error"
							dismissible
							@input="error = null"
					>
						{{ error }}
					</v-alert>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-btn color="secondary" @click="goToUpdateHero">Modifier mon héro</v-btn>
			</v-card-actions>
		</v-card>
	</v-container>
</template>

<script>
import {AuthService} from '@/services/auth.service';

export default {
	name: 'UserAuthComponent',
	data() {
		return {
			login: '',
			password: '',
			error: null,
			loading: false,
			user: null,
			loginRules: [
				v => !!v || 'Login est requis',
				v => v.length >= 2 || 'Login doit contenir au moins 2 caractères',
			],
			passwordRules: [
				v => !!v || 'Mot de passe est requis',
				v => v.length >= 2 || 'Mot de passe doit contenir au moins 2 caractères',
			],
			formValid: false,
		};
	},
	watch: {
		login(newVal) {
			this.formValid = this.loginRules.every(rule => rule(newVal) === true) && this.passwordRules.every(rule => rule(this.password) === true);
		},
		password(newVal) {
			this.formValid = this.loginRules.every(rule => rule(this.login) === true) && this.passwordRules.every(rule => rule(newVal) === true);
		}
	},
	methods: {
		async handleLogin() {
			this.loading = true;
			this.error = null;
			try {
				const response = await AuthService.login(this.login, this.password);
				console.log(response);

				if (response) {
					this.user = response;
					localStorage.setItem('xsrfToken', response.xsrfToken);

					await this.$router.push({name: 'Home'});
				} else {
					this.error = response || 'Erreur de connexion inconnue';
				}
			} catch (error) {
				this.error = error.message || 'Erreur de connexion inconnue';
			} finally {
				this.loading = false;
			}
		},
		goToUpdateHero() {
			this.$router.push({name: 'HeroAuthUpdate'});
		}
	},
};
</script>