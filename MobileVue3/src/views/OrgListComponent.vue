<template>
	<ion-header>
		<ion-toolbar>
			<ion-title>Liste des organisations</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<ion-card>
			<ion-card-header>
				<ion-card-title>Liste des organisations</ion-card-title>
			</ion-card-header>
			<ion-card-content>
				<ion-list v-if="getOrgs.length">
					<ion-item v-for="org in getOrgs" :key="org._id">
						<ion-label>{{ org.name }}</ion-label>
						<ion-buttons slot="end">
							<ion-button @click="selectOrg(org)">
								<ion-icon name="eye"></ion-icon>
								Détails
							</ion-button>
						</ion-buttons>
					</ion-item>
				</ion-list>
				<ion-card v-else>
					<ion-card-content>
						<p>Aucune organisation trouvée.</p>
					</ion-card-content>
				</ion-card>
				<ion-button expand="full" @click="openCreateDialog">Créer une organisation</ion-button>
			</ion-card-content>
		</ion-card>

		<ion-modal :is-open="dialog">
			<ion-header>
				<ion-toolbar>
					<ion-title>Créer une nouvelle organisation</ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-content class="ion-padding">
				<ion-item>
					<ion-label position="floating">Nom de l'organisation</ion-label>
					<ion-input v-model="newOrg.name" :error="!!error.name" :error-text="error.name" required></ion-input>
				</ion-item>
				<ion-item>
					<ion-label position="floating">Phrase secrète</ion-label>
					<ion-input v-model="newOrg.secret" type="password" :error="!!error.secret" :error-text="error.secret"
										 required></ion-input>
				</ion-item>
				<ion-button expand="full" @click="handleCreateOrg">Créer</ion-button>
				<ion-button expand="full" fill="clear" @click="closeDialog">Annuler</ion-button>
			</ion-content>
		</ion-modal>
	</ion-content>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useOrgStore} from '@/store/org.store';
import {useErrorStore} from '@/store/error.store';
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonList,
	IonItem,
	IonButtons,
	IonButton,
	IonIcon,
	IonModal,
	IonLabel,
	IonInput,
} from '@ionic/vue';

const router = useRouter();
const orgStore = useOrgStore();
const errorStore = useErrorStore();

const dialog = ref(false);
const newOrg = ref({name: '', secret: ''});
const error = ref({name: '', secret: ''});

const getOrgs = computed(() => orgStore.orgs);

onMounted(() => {
	orgStore.fetchOrgs();
});

const selectOrg = async (org: any) => {
	try {
		await orgStore.fetchOrgById({id: org._id, secret: orgStore.currentOrgSecret!});
		router.push({name: 'OrgDetail', params: {id: org._id}});
	} catch (err: any) {
		errorStore.setError(`Erreur lors de la sélection : ${err}`);
	}
};

const openCreateDialog = () => {
	newOrg.value = {name: '', secret: ''};
	error.value = {name: '', secret: ''};
	dialog.value = true;
};

const closeDialog = () => {
	dialog.value = false;
};

const handleCreateOrg = async () => {
	error.value = {name: '', secret: ''};

	if (!newOrg.value.name.trim()) error.value.name = 'Nom requis';
	if (!newOrg.value.secret.trim()) error.value.secret = 'Phrase secrète requise';

	if (error.value.name || error.value.secret) return;

	try {
		await orgStore.createOrg(newOrg.value);
		await orgStore.fetchOrgs();
		dialog.value = false;
	} catch (err: any) {
		errorStore.setError(`Erreur lors de la création : ${err}`);
	}
};
</script>