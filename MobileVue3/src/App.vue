<template>
	<ion-app>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-menu-toggle>
						<ion-icon :icon="menu" style="width: 25px; height: 25px;"></ion-icon>
					</ion-menu-toggle>
				</ion-buttons>
				<ion-title>Héros et Villains</ion-title>
				<ion-buttons slot="end">
					<ion-button v-if="!isLoggedIn" @click="goToLogin">Se connecter</ion-button>
					<ion-button v-else @click="logout">Se déconnecter</ion-button>
					<ion-button @click="openSecretDialog">Phrase secrète</ion-button>
					<ion-button v-if="!isLoggedIn" @click="goToRegister">S'inscrire</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>

		<ion-menu v-model="drawer" side="start" content-id="main_content">
			<ion-header>
				<ion-header>
					<ion-toolbar>
						<ion-title>Héros et Villains</ion-title>
					</ion-toolbar>
				</ion-header>
			</ion-header>
			<ion-content class="ion-padding" style="height: 100%; user-select: none;">
				<ion-list>
					<ion-item @click="goToHomePage" style="cursor: pointer">
						<ion-label>Accueil</ion-label>
					</ion-item>
					<ion-item @click="goToOrgList" style="cursor: pointer">
						<ion-label>Organisations</ion-label>
					</ion-item>
					<ion-item @click="goToTeamList" style="cursor: pointer">
						<ion-label>Équipes</ion-label>
					</ion-item>
				</ion-list>
			</ion-content>
		</ion-menu>

		<ion-content>
			<ion-page id="main_content">
				<router-view></router-view>
			</ion-page>
		</ion-content>

		<ion-alert
				:is-open="dialog"
				@didDismiss="dialog = false"
				header="Saisir la phrase secrète"
				:inputs="[
        {
          placeholder: 'Phrase secrète',
          type: 'password',
          value: secret,
          handler: (input: any) => (secret = input.value),
        },
      ]"
				:buttons="[
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Enregistrer',
          handler: () => saveSecret(),
        },
      ]"
		></ion-alert>

		<ion-alert
				:is-open="errorDialog"
				@didDismiss="closeErrorDialog"
				header="Erreur"
				message="errorMessage"
				:buttons="['OK']"
		></ion-alert>
	</ion-app>


</template>

<script lang="ts">
import {defineComponent, ref, computed, watch} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {useOrgStore} from '@/store/org.store';
import {useErrorStore} from '@/store/error.store';
import {
	IonApp,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonButtons,
	IonButton,
	IonIcon,
	IonContent,
	IonList,
	IonItem,
	IonLabel,
	IonPage,
	IonAlert,
	IonMenu,
	IonMenuToggle
} from '@ionic/vue';
import {menu} from 'ionicons/icons';

export default defineComponent({
	components: {
		IonApp,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonButtons,
		IonButton,
		IonIcon,
		IonContent,
		IonList,
		IonItem,
		IonLabel,
		IonPage,
		IonAlert,
		IonMenu,
		IonMenuToggle
	},
	setup() {
		const router = useRouter();
		const route = useRoute();
		const orgStore = useOrgStore();
		const errorStore = useErrorStore();
		const drawer = ref(false);
		const secret = ref('');
		const dialog = ref(false);
		const isLoggedIn = ref(!!localStorage.getItem('xsrfToken'));

		const currentOrg = computed(() => orgStore.currentOrg);
		const orgSecret = computed(() => orgStore.orgSecret);
		const errorMessage = computed(() => errorStore.errorMessage);
		const errorDialog = computed(() => errorStore.errorDialog);

		const goToLogin = () => {
			router.push({name: 'Login'});
		};

		const goToRegister = () => {
			router.push({name: 'Register'});
		};

		const logout = () => {
			localStorage.removeItem('xsrfToken');
			localStorage.removeItem('login');
			isLoggedIn.value = false;
			router.push({name: 'Home'});
		};

		const goToOrgList = () => {
			if (orgSecret.value !== null) {
				router.push({name: 'OrgList'}).catch((err: any) => {
					console.error("Navigation error:", err);
				});
			}
		};

		const goToTeamList = () => {
			if (orgSecret.value !== null && currentOrg.value !== null) {
				router.push({name: 'TeamList'}).catch((err: any) => {
					console.error("Navigation error:", err);
				});
			}
		};

		const goToHomePage = () => {
			router.push({name: 'Home'}).catch((err: any) => {
				console.error("Navigation error:", err);
			});
		};

		const saveSecret = () => {
			orgStore.setOrgSecret(secret.value);
			dialog.value = false;
		};

		const closeErrorDialog = () => {
			errorStore.clearError();
		};

		const openSecretDialog = () => {
			dialog.value = true;
		};

		watch(
				() => route.path,
				() => {
					isLoggedIn.value = !!localStorage.getItem('xsrfToken');
				}
		);

		return {
			drawer,
			secret,
			dialog,
			isLoggedIn,
			goToLogin,
			goToRegister,
			logout,
			goToOrgList,
			goToTeamList,
			goToHomePage,
			saveSecret,
			closeErrorDialog,
			openSecretDialog,
			menu,
			errorMessage,
			errorDialog,
			currentOrg,
			orgSecret,
		};
	},
});
</script>
