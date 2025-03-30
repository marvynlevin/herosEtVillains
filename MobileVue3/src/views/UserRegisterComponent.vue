<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Inscription</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<ion-card>
				<ion-card-content>
					<ion-item>
						<ion-label position="floating">Login</ion-label>
						<ion-input v-model="login" type="text" :rules="loginRules"></ion-input>
					</ion-item>
					<ion-item>
						<ion-label position="floating">Mot de passe</ion-label>
						<ion-input v-model="password" type="password" :rules="passwordRules"></ion-input>
					</ion-item>
					<ion-item>
						<ion-label position="floating">Nom du héro</ion-label>
						<ion-input v-model="hero" type="text" :rules="heroRules"></ion-input>
					</ion-item>
					<vue-recaptcha
							ref="recaptcha"
							:sitekey="captchaSiteKey"
							@verify="onCaptchaVerified"
							@expired="onCaptchaExpired"
							@error="onCaptchaError"
					/>
					<ion-button
							expand="full"
							@click="handleRegister"
							:loading="loading"
							:disabled="!formValid || !captchaVerified"
					>
						<span v-if="loading">Chargement...</span>
						<span v-else>S'inscrire</span>
					</ion-button>
					<ion-alert
							v-if="error"
							color="danger"
							:message="error"
							:dismissible="true"
							@ionDismiss="error = null"
					></ion-alert>
				</ion-card-content>
			</ion-card>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue';
import {useRouter} from 'vue-router';
import {AuthService} from '@/services/auth.service';
import {VueRecaptcha} from 'vue-recaptcha';
import config from '@/commons/config';
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonCard,
	IonCardContent,
	IonItem,
	IonLabel,
	IonInput,
	IonButton,
	IonAlert,
} from '@ionic/vue';

const router = useRouter();

const login = ref('');
const password = ref('');
const hero = ref('');
const error = ref<string | null>(null);
const loading = ref(false);
const captchaToken = ref<string | null>(null);
const captchaVerified = ref(false);
const captchaSiteKey = config.captchaSiteKey;
const formValid = ref(false);

const loginRules = computed(() => [
	(v: string) => !!v || 'Login est requis',
	(v: string) => v.length >= 2 || 'Login doit contenir au moins 2 caractères',
]);

const passwordRules = computed(() => [
	(v: string) => !!v || 'Mot de passe est requis',
	(v: string) => v.length >= 2 || 'Mot de passe doit contenir au moins 2 caractères',
]);

const heroRules = computed(() => [
	(v: string) => !!v || 'Nom du héro est requis',
	(v: string) => v.length >= 2 || 'Nom du héro doit contenir au moins 2 caractères',
]);

watch([login, password, hero], ([newLogin, newPassword, newHero]) => {
	formValid.value = loginRules.value.every(rule => rule(newLogin) === true) &&
			passwordRules.value.every(rule => rule(newPassword) === true) &&
			heroRules.value.every(rule => rule(newHero) === true);
});

const handleRegister = async () => {
	loading.value = true;
	error.value = null;
	try {
		const response = await AuthService.register(login.value, password.value, hero.value, captchaToken.value);
		if (response) {
			await router.push({name: 'Login'});
		} else {
			error.value = 'Erreur d\'inscription inconnue';
		}
	} catch (err: any) {
		error.value = err.message || 'Erreur d\'inscription inconnue';
	} finally {
		loading.value = false;
	}
};

const onCaptchaVerified = (response: string) => {
	captchaToken.value = response;
	captchaVerified.value = true;
};

const onCaptchaExpired = () => {
	captchaToken.value = null;
	captchaVerified.value = false;
	// @ts-ignore
	recaptcha.value.reset();
};

const onCaptchaError = () => {
	captchaToken.value = null;
	captchaVerified.value = false;
};
</script>