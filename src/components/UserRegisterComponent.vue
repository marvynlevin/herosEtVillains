<template>
	<v-container class="fill-height d-flex justify-center align-center">
		<v-card class="elevation-12" width="400">
			<v-toolbar dark color="primary">
				<v-toolbar-title>Inscription</v-toolbar-title>
			</v-toolbar>
			<v-card-text>
				<v-form @submit.prevent="handleRegister">
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
					<v-text-field
							v-model="hero"
							label="Nom du héro"
							type="text"
							required
							:rules="heroRules"
					></v-text-field>
					<vue-recaptcha
							ref="recaptcha"
							:sitekey="captchaSiteKey"
							@verify="onCaptchaVerified"
							@expired="onCaptchaExpired"
							@error="onCaptchaError"
					/>
					<v-btn
							type="submit"
							color="primary"
							class="mr-4"
							:loading="loading"
							:disabled="!formValid || !captchaVerified"
					>
						<span v-if="loading">Chargement...</span>
						<span v-else>S'inscrire</span>
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
		</v-card>
	</v-container>
</template>

<script>
import {AuthService} from '@/services/auth.service';
import {VueRecaptcha} from 'vue-recaptcha';
import config from '@/commons/config';

export default {
	name: 'UserRegisterComponent',
	components: {
		VueRecaptcha,
	},
	data() {
		return {
			login: '',
			password: '',
			hero: '',
			error: null,
			loading: false,
			captchaToken: null,
			captchaVerified: false,
			captchaSiteKey: config.captchaSiteKey,
			loginRules: [
				v => !!v || 'Login est requis',
				v => v.length >= 2 || 'Login doit contenir au moins 2 caractères',
			],
			passwordRules: [
				v => !!v || 'Mot de passe est requis',
				v => v.length >= 2 || 'Mot de passe doit contenir au moins 2 caractères',
			],
			heroRules: [
				v => !!v || 'Nom du héro est requis',
				v => v.length >= 2 || 'Nom du héro doit contenir au moins 2 caractères',
			],
			formValid: false,
		};
	},
	watch: {
		login(newVal) {
			this.formValid = this.loginRules.every(rule => rule(newVal) === true) && this.passwordRules.every(rule => rule(this.password) === true) && this.heroRules.every(rule => rule(this.hero) === true);
		},
		password(newVal) {
			this.formValid = this.loginRules.every(rule => rule(this.login) === true) && this.passwordRules.every(rule => rule(newVal) === true) && this.heroRules.every(rule => rule(this.hero) === true);
		},
		hero(newVal) {
			this.formValid = this.loginRules.every(rule => rule(this.login) === true) && this.passwordRules.every(rule => rule(this.password) === true) && this.heroRules.every(rule => rule(newVal) === true);
		}
	},
	methods: {
		async handleRegister() {
			this.loading = true;
			this.error = null;
			try {
				const response = await AuthService.register(this.login, this.password, this.hero, this.captchaToken);
				if (response) {
					await this.$router.push({name: 'Login'});
				} else {
					this.error = response || 'Erreur d\'inscription inconnue';
				}
			} catch (error) {
				this.error = error.message || 'Erreur d\'inscription inconnue';
			} finally {
				this.loading = false;
			}
		},
		onCaptchaVerified(response) {
			this.captchaToken = response;
			this.captchaVerified = true;
		},
		onCaptchaExpired() {
			this.captchaToken = null;
			this.captchaVerified = false;
			this.$refs.recaptcha.reset();
		},
		onCaptchaError() {
			this.captchaToken = null;
			this.captchaVerified = false;
		},
	},
};
</script>