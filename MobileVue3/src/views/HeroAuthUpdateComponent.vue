<template>
	<ion-page>
		<ion-content class="ion-padding">
			<ion-card>
				<ion-card-header>
					<ion-card-title>Modifier les informations de mon héro</ion-card-title>
				</ion-card-header>
				<ion-card-content>
					<form @submit.prevent="updateHero">
						<ion-item>
							<ion-input v-model="hero.alias" label="Alias" required></ion-input>
						</ion-item>
						<ion-item>
							<ion-input v-model="hero.firstname" label="Prénom" required></ion-input>
						</ion-item>
						<ion-item>
							<ion-input v-model="hero.lastname" label="Nom" required></ion-input>
						</ion-item>
						<ion-item>
							<ion-input v-model="hero.power" label="Pouvoir" required></ion-input>
						</ion-item>
						<ion-button type="submit" expand="full" :loading="loading">Modifier</ion-button>
					</form>
					<ion-alert
							v-if="error"
							:is-open="!!error"
							@didDismiss="error = null"
							header="Erreur"
							:message="error"
							:buttons="['OK']"
					></ion-alert>
				</ion-card-content>
			</ion-card>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {
	IonAlert,
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonContent,
	IonInput,
	IonItem,
	IonPage,
	IonSpinner
} from '@ionic/vue';
import AuthService from '@/services/auth.service';
import {getHeroById, updateAuthHero} from '@/services/hero.service';

interface Hero {
	alias: string;
	firstname: string;
	lastname: string;
	power: string;
}

export default defineComponent({
	name: 'HeroAuthUpdateComponent',
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
		IonSpinner,
		IonAlert
	},
	setup() {
		const router = useRouter();
		const hero = ref<Hero>({
			alias: '',
			firstname: '',
			lastname: '',
			power: '',
		});
		const loading = ref(false);
		const error = ref<string | null>(null);

		onMounted(async () => {
			try {
				const user: any = await AuthService.getUser(localStorage.getItem('login') || '');
				hero.value = await getHeroById(user.data.heroId);
			} catch (err: any) {
				error.value = err.message;
			}
		});

		const updateHero = async () => {
			loading.value = true;
			error.value = null;
			try {
				await updateAuthHero(hero.value);
				await router.push({name: 'Home'});
			} catch (err: any) {
				error.value = err.message;
			} finally {
				loading.value = false;
			}
		};

		return {
			hero,
			loading,
			error,
			updateHero,
		};
	},
});
</script>
