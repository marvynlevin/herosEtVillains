<template>
	<ion-header>
		<ion-toolbar>
			<ion-title>Modifier les informations de mon héros</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<ion-item>
			<ion-label position="floating">Alias</ion-label>
			<ion-input v-model="hero.alias" required></ion-input>
		</ion-item>
		<ion-item>
			<ion-label position="floating">Prénom</ion-label>
			<ion-input v-model="hero.firstname" required></ion-input>
		</ion-item>
		<ion-item>
			<ion-label position="floating">Nom</ion-label>
			<ion-input v-model="hero.lastname" required></ion-input>
		</ion-item>
		<ion-item>
			<ion-label position="floating">Pouvoir</ion-label>
			<ion-input v-model="hero.power" required></ion-input>
		</ion-item>
		<ion-button expand="full" @click="updateHero" :loading="loading">Modifier</ion-button>
		<div v-if="error" class="error-message">{{ error }}</div>
	</ion-content>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {AuthService} from "@/services/auth.service";
import {getHeroById, updateAuthHero, Hero} from "@/services/hero.service";
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonItem,
	IonLabel,
	IonInput,
	IonButton,
} from '@ionic/vue';

const hero = ref<Partial<Hero>>({
	alias: '',
	firstname: '',
	lastname: '',
	power: '',
});
const loading = ref(false);
const error = ref<string | null>(null);
const router = useRouter();

onMounted(async () => {
	try {
		const user = await AuthService.getUser(localStorage.getItem('login')!);
		const heroData = await getHeroById(user.data.heroId, "");
		hero.value = (heroData as unknown as Array<any>)[0];
	} catch (err: any) {
		error.value = err.message;
	}
});

const updateHero = async () => {
	loading.value = true;
	try {
		await updateAuthHero(hero.value);
		router.push({name: 'Home'});
	} catch (err: any) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
};
</script>

<style scoped>
.error-message {
	color: red;
	margin-top: 10px;
}
</style>