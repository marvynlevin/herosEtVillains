<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>404 - Page Not Found</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<h1>404 - Page Not Found</h1>
			<p>Sorry, the page you are looking for does not exist.</p>
			<ion-button expand="full" @click="goToHome">Go to Homepage</ion-button>
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

const goToHome = () => {
	router.push('/');
};
</script>

<style scoped>
h1 {
	font-size: 3rem;
	color: #ff4d4f;
	text-align: center;
	margin-bottom: 20px;
}

p {
	font-size: 1.2rem;
	text-align: center;
	margin-bottom: 30px;
}
</style>