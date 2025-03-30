<template>
	<ion-header>
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-back-button default-href="/orgs"></ion-back-button>
			</ion-buttons>
			<ion-title v-if="org">{{ org.name }}</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<ion-spinner v-if="loading" name="crescent" class="ion-text-center"></ion-spinner>

		<div v-if="org && !loading">
			<ion-card>
				<ion-card-header>
					<ion-card-title>{{ org.name }}</ion-card-title>
					<ion-card-subtitle>Informations de l'organisation</ion-card-subtitle>
				</ion-card-header>
				<ion-card-content>
					<ion-item>
						<ion-label><strong>Nom:</strong> {{ org.name }}</ion-label>
					</ion-item>
					<ion-item>
						<ion-label><strong>Phrase secrète:</strong> {{ org.secret }}</ion-label>
					</ion-item>
				</ion-card-content>
			</ion-card>

			<ion-list v-if="org && org.teams && org.teams.length">
				<ion-list-header>Équipes</ion-list-header>
				<ion-item v-for="team in org.teams" :key="team._id">
					<ion-label>{{ team.name }}</ion-label>
					<ion-buttons slot="end">
						<ion-button @click="viewTeamDetails(team)">
							<ion-icon name="eye"></ion-icon>
						</ion-button>
						<ion-button color="danger" @click="confirmRemoveTeam(team)">
							<ion-icon name="trash"></ion-icon>
						</ion-button>
					</ion-buttons>
				</ion-item>
			</ion-list>

			<ion-card v-if="org && org.teams && org.teams.length === 0">
				<ion-card-content>
					<p>Aucune équipe disponible.</p>
				</ion-card-content>
			</ion-card>

			<ion-button expand="full" @click="toggleAddTeam">Ajouter une équipe</ion-button>
			<div v-if="showAddTeam">
				<ion-select v-model="selectedTeam" :items="availableTeams" item-text="name" item-value="_id"
										label="Sélectionner une équipe">
				</ion-select>
				<ion-button :disabled="!selectedTeam" @click="addTeam">Valider</ion-button>
				<ion-button fill="clear" @click="toggleAddTeam">Annuler</ion-button>
			</div>
		</div>

		<ion-modal :is-open="confirmDialog">
			<ion-header>
				<ion-toolbar>
					<ion-title>Confirmer la suppression</ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-content class="ion-padding">
				<p>Voulez-vous vraiment supprimer cette équipe de l'organisation ?</p>
				<ion-button color="danger" @click="removeTeam">Supprimer</ion-button>
				<ion-button fill="clear" @click="confirmDialog = false">Annuler</ion-button>
			</ion-content>
		</ion-modal>
	</ion-content>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {useOrgStore} from '@/store/org.store';
import {useTeamStore} from '@/store/team.store';
import {useErrorStore} from '@/store/error.store';
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButton,
	IonList,
	IonListHeader,
	IonItem,
	IonButtons,
	IonIcon,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardSubtitle,
	IonCardContent,
	IonSelect,
	IonModal,
	IonSpinner,
	IonBackButton,
} from '@ionic/vue';

const router = useRouter();
const route = useRoute();
const orgStore = useOrgStore();
const teamStore = useTeamStore();
const errorStore = useErrorStore();

const loading = ref(true);
const showAddTeam = ref(false);
const selectedTeam = ref<string | null>(null);
const confirmDialog = ref(false);
const teamToRemove = ref<any | null>(null);

const org = computed(() => {
	return Array.isArray(orgStore.currentOrg) ? orgStore.currentOrg[0] : orgStore.currentOrg || {};
});

const availableTeams = computed(() => {
	if (!org.value || !Array.isArray(org.value.teams)) {
		return [];
	}

	teamStore.fetchTeams();
	const allTeams = teamStore.teams || [];

	const existingTeamIds = org.value.teams.map((team: any) => team._id || null);
	return allTeams.filter((team: any) => !existingTeamIds.includes(team._id));
});

onMounted(async () => {
	await fetchOrgDetails();
});

const fetchOrgDetails = async () => {
	try {
		const {id} = route.params;
		await orgStore.fetchOrgById({id: id as string, secret: orgStore.currentOrgSecret!});
	} catch (error: any) {
		errorStore.setError(`Erreur lors du chargement : ${error}`);
	} finally {
		loading.value = false;
	}
};

const viewTeamDetails = (team: any) => {
	teamStore.currentTeam = team;
	router.push({name: 'TeamDetail', params: {teamId: team._id}});
};

const toggleAddTeam = () => {
	showAddTeam.value = !showAddTeam.value;
	if (!showAddTeam.value) {
		selectedTeam.value = null;
	}
};

const addTeam = async () => {
	if (!selectedTeam.value) return;
	try {
		await orgStore.addTeamToOrg({idTeam: selectedTeam.value, idOrg: org.value._id});
		await fetchOrgDetails();
		toggleAddTeam();
	} catch (error: any) {
		errorStore.setError(`Erreur lors de l'ajout de l'équipe : ${error}`);
	}
};

const confirmRemoveTeam = (team: any) => {
	teamToRemove.value = team;
	confirmDialog.value = true;
};

const removeTeam = async () => {
	if (!teamToRemove.value) return;
	try {
		await orgStore.removeTeamFromOrg({idTeam: teamToRemove.value._id, idOrg: org.value._id});
		await fetchOrgDetails();
	} catch (error: any) {
		errorStore.setError(`Erreur lors de la suppression de l'équipe : ${error}`);
	}
	confirmDialog.value = false;
	teamToRemove.value = null;
};
</script>

<style scoped>
ion-spinner {
	margin-top: 50px;
}
</style>