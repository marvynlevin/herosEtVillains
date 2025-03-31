<template>
	<ion-page>
		<ion-content class="ion-padding">
			<ion-card>
				<ion-card-header>
					<ion-card-title>Authentification</ion-card-title>
				</ion-card-header>
				<ion-card-content>
					<form @submit.prevent="handleLogin">
						<ion-item>
							<ion-input
									v-model="login"
									label="Login"
									type="text"
									required
									:error="!!error"
							></ion-input>
						</ion-item>
						<p v-if="error" style="color: red;">{{ error }}</p>
						<ion-item>
							<ion-input
									v-model="password"
									label="Mot de passe"
									type="password"
									required
									:error="!!error"
							></ion-input>
						</ion-item>
						<p v-if="error" style="color: red;">{{ error }}</p>
						<ion-button
								type="submit"
								expand="full"
								:loading="loading"
								:disabled="!login || !password"
						>
							<span v-if="loading">Chargement...</span>
							<span v-else>Se connecter</span>
						</ion-button>
						<ion-alert
								v-if="error"
								:is-open="!!error"
								@didDismiss="error = null"
								header="Erreur"
								:message="error"
								:buttons="['OK']"
						></ion-alert>
					</form>
				</ion-card-content>
				<ion-card-content>
					<ion-button color="secondary" @click="goToUpdateHero">Modifier mon héro</ion-button>
				</ion-card-content>
			</ion-card>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {useRouter} from 'vue-router';
import {
	IonPage,
	IonContent,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonItem,
	IonInput,
	IonButton,
	IonAlert,
	IonSpinner
} from '@ionic/vue';
import AuthService from '@/services/auth.service';

export default defineComponent({
	name: 'UserAuthComponent',
	components: {
		IonPage,
		IonContent,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonItem,
		IonInput,
		IonButton,
		IonAlert,
		IonSpinner
	},
	setup() {
		const router = useRouter();
		const login = ref('');
		const password = ref('');
		const error = ref<string | null>(null);
		const loading = ref(false);
		const user = ref<any>(null);

		const handleLogin = async () => {
			loading.value = true;
			error.value = null;
			try {
				const response: any = await AuthService.login(login.value, password.value);
				console.log(response);

				if (response) {
					user.value = response;
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

		return {
			login,
			password,
			error,
			loading,
			user,
			handleLogin,
			goToUpdateHero,
		};
	},
});
</script>
