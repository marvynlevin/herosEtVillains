<template>
	<ion-modal :is-open="dialog">
		<ion-header>
			<ion-toolbar>
				<ion-title>Entrer le mot de passe secret</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<ion-item>
				<ion-label position="floating">Mot de passe secret</ion-label>
				<ion-input v-model="secret" type="password" :error="!!error" :error-text="error"></ion-input>
			</ion-item>
			<ion-button expand="full" @click="submitSecret">Valider</ion-button>
			<ion-button expand="full" fill="clear" @click="closeDialog">Annuler</ion-button>
		</ion-content>
	</ion-modal>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useOrgStore} from '@/store/org.store';
import {
	IonModal,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonItem,
	IonLabel,
	IonInput,
	IonButton,
} from '@ionic/vue';

const dialog = ref(true);
const secret = ref('');
const error = ref<string | null>(null);
const router = useRouter();
const orgStore = useOrgStore();

const closeDialog = () => {
	dialog.value = false;
};

const submitSecret = () => {
	if (!secret.value.trim()) {
		error.value = 'Le mot de passe secret est requis.';
		return;
	}

	orgStore.currentOrgSecret = secret.value;
	closeDialog();
	router.push({name: 'OrgList'});
};
</script>