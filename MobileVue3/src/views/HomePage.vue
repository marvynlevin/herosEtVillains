<template>
	<ion-page>
		<ion-content>
			<div class="home">
				<ion-title>Bienvenue sur la page d'accueil</ion-title>
				<br>
				<br>
				<ion-text class="ion-padding ion-padding-vertical ion-margin-vertical">
					Ceci est la page d'accueil de l'application. Vous pouvez commencer à naviguer en utilisant les liens
					ci-dessous.
				</ion-text>
				<br>
				<br>
				<router-link to="/auth">Aller à l'authentification</router-link>
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {IonPage, IonContent, IonText, IonTitle} from '@ionic/vue';
import {useRouter} from 'vue-router';

export default defineComponent({
	name: 'HomeView',
	components: {
		IonPage,
		IonContent,
		IonText,
		IonTitle
	},
	setup() {
		const router = useRouter();

		const goToAuth = () => {
			router.push('/auth');
		};

		return {
			goToAuth,
		};
	},
});
</script>

<style scoped>
.home {
	text-align: center;
	margin-top: 100px;
}

.home h1 {
	font-size: 3rem;
	color: #1890ff;
}

.home p {
	font-size: 1.2rem;
	color: #555;
}

.home a {
	font-size: 1.1rem;
	color: #1890ff;
	text-decoration: none;
}

.home a:hover {
	text-decoration: underline;
}
</style>
