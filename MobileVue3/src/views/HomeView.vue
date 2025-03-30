<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Accueil</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<h1>Bienvenue sur la page d'accueil</h1>
			<p>Ceci est la page d'accueil de votre application. Vous pouvez commencer à naviguer en utilisant les liens
				ci-dessous.</p>
			<ion-button expand="full" @click="goToAuth">Aller à l'authentification</ion-button>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButton,
} from '@ionic/vue';

const router = useRouter();

const goToAuth = () => {
	router.push('/auth');
};
</script>

<style scoped>
h1 {
	font-size: 2rem;
	color: #1890ff;
	text-align: center;
	margin-bottom: 20px;
}

p {
	font-size: 1rem;
	color: #555;
	text-align: center;
	margin-bottom: 30px;
}
</style>