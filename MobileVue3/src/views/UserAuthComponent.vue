<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Authentification</ion-title>
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
					<ion-button expand="full" @click="handleLogin" :loading="loading" :disabled="!formValid">
						<span v-if="loading">Chargement...</span>
						<span v-else>Se connecter</span>
					</ion-button>
					<ion-alert v-if="error" color="danger" :message="error" :dismissible="true"
										 @ionDismiss="error = null"></ion-alert>
				</ion-card-content>
				<ion-card-actions>
					<ion-button expand="full" @click="goToUpdateHero">Modifier mon héros</ion-button>
				</ion-card-actions>
			</ion-card>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue';
import {useRouter} from 'vue-router';
import {AuthService} from '@/services/auth.service';
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
	IonCardActions,
} from '@ionic/vue';

const router = useRouter();

const login = ref('');
const password = ref('');
const error = ref<string | null>(null);
const loading = ref(false);
const formValid = ref(false);

const loginRules = computed(() => [
	(v: string) => !!v || 'Login est requis',
	(v: string) => v.length >= 2 || 'Login doit contenir au moins 2 caractères',
]);

const passwordRules = computed(() => [
	(v: string) => !!v || 'Mot de passe est requis',
	(v: string) => v.length >= 2 || 'Mot de passe doit contenir au moins 2 caractères',
]);

watch([login, password], ([newLogin, newPassword]) => {
	formValid.value = loginRules.value.every(rule => rule(newLogin) === true) && passwordRules.value.every(rule => rule(newPassword) === true);
});

const handleLogin = async () => {
	loading.value = true;
	error.value = null;
	try {
		const response = await AuthService.login(login.value, password.value);

		if (response) {
			localStorage.setItem('xsrfToken', response.xsrfToken);
			await router.push({name: 'Home'});
		} else {
			error.value = 'Erreur de connexion inconnue';
		}
	} catch (err: any) {
		error.value = err.message || 'Erreur de connexion inconnue';
	} finally {
		loading.value = false;
	}
};

const goToUpdateHero = () => {
	router.push({name: 'HeroAuthUpdate'});
};
</script>