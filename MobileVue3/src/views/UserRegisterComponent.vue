<template>
	<ion-page>
		<ion-content class="ion-padding">
			<ion-card>
				<ion-card-header>
					<ion-card-title>Inscription</ion-card-title>
				</ion-card-header>
				<ion-card-content>
					<form @submit.prevent="handleRegister">
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
						<ion-item>
							<ion-input
									v-model="hero"
									label="Nom du héro"
									type="text"
									required
									:error="!!error"
							></ion-input>
						</ion-item>
						<p v-if="error" style="color: red;">{{ error }}</p>
						<ChallengeV2
								ref="recaptcha"
								:sitekey="captchaSiteKey"
								@verify="onCaptchaVerified"
								@expired="onCaptchaExpired"
								@error="onCaptchaError"
						/>
						<!--						<p v-if="captchaError" style="color: red;">{{ captchaError }}</p>-->

						<ion-button
								type="submit"
								expand="full"
								:loading="loading"
								:disabled="!login || !password || !hero || !captchaVerified"
						>
							<span v-if="loading">Chargement...</span>
							<span v-else>S'inscrire</span>
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
			</ion-card>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import {defineComponent, ref, computed} from 'vue';
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
	IonSpinner,
	IonIcon
} from '@ionic/vue';
import AuthService from '@/services/auth.service';
import {ChallengeV2} from 'vue-recaptcha';
import config from '@/commons/config';

export default defineComponent({
	name: 'UserRegisterComponent',
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
		IonSpinner,
		IonIcon,
		ChallengeV2
	},
	setup() {
		const router = useRouter();
		const login = ref('');
		const password = ref('');
		const hero = ref('');
		const error = ref<string | null>(null);
		const loading = ref(false);
		const captchaToken = ref<string | null>(null);
		const captchaVerified = ref(false);
		const captchaError = ref<string | null>(null); // Added
		const captchaSiteKey = config.captchaSiteKey;
		const loginRules = [
			(v: string) => !!v || 'Login est requis',
			(v: string) => v.length >= 2 || 'Login doit contenir au moins 2 caractères',
		];
		const passwordRules = [
			(v: string) => !!v || 'Mot de passe est requis',
			(v: string) => v.length >= 2 || 'Mot de passe doit contenir au moins 2 caractères',
		];
		const heroRules = [
			(v: string) => !!v || 'Nom du héro est requis',
			(v: string) => v.length >= 2 || 'Nom du héro doit contenir au moins 2 caractères',
		];

		const formValid = computed(() => {
			return login.value.length >= 2 && password.value.length >= 2 && hero.value.length >= 2;
		});

		const handleRegister = async () => {
			loading.value = true;
			error.value = null;
			try {
				if (!captchaVerified.value) {
					error.value = 'Veuillez vérifier que vous n\'êtes pas un robot.';
					return;
				}
				const response: any = await AuthService.register(login.value, password.value, hero.value, captchaToken.value!);
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
			captchaError.value = null;
		};

		const onCaptchaExpired = () => {
			captchaToken.value = null;
			captchaVerified.value = false;
			captchaError.value = 'Le CAPTCHA a expiré. Veuillez réessayer.';
		};

		const onCaptchaError = () => {
			captchaToken.value = null;
			captchaVerified.value = false;
			captchaError.value = 'Erreur CAPTCHA. Veuillez réessayer.';
		};

		return {
			login,
			password,
			hero,
			error,
			loading,
			captchaToken,
			captchaVerified,
			captchaSiteKey,
			loginRules,
			passwordRules,
			heroRules,
			formValid,
			handleRegister,
			onCaptchaVerified,
			onCaptchaExpired,
			onCaptchaError,
		};
	},
});
</script>
