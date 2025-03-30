<template>
	<ion-header>
		<ion-toolbar>
			<ion-title>Liste des équipes</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content class="ion-padding">
		<ion-card>
			<ion-card-header>
				<ion-card-title>Liste des équipes</ion-card-title>
			</ion-card-header>
			<ion-card-content>
				<ion-list v-if="teams.length">
					<ion-item v-for="team in teams" :key="team._id">
						<ion-label>{{ team.name }}</ion-label>
						<ion-buttons slot="end">
							<ion-button @click="selectTeam(team)">
								Sélectionner
							</ion-button>
						</ion-buttons>
					</ion-item>
				</ion-list>
				<ion-card v-else>
					<ion-card-content>
						<p>Aucune équipe trouvée.</p>
					</ion-card-content>
				</ion-card>
				<ion-button expand="full" @click="openAddTeamDialog">Créer une équipe</ion-button>
			</ion-card-content>
		</ion-card>

		<ion-modal :is-open="addTeamDialog">
			<ion-header>
				<ion-toolbar>
					<ion-title>Créer une nouvelle équipe</ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-content class="ion-padding">
				<ion-item>
					<ion-label position="floating">Nom de l'équipe</ion-label>
					<ion-input v-model="newTeamName" required></ion-input>
				</ion-item>
				<ion-button expand="full" :disabled="!newTeamName" @click="createNewTeam">Créer</ion-button>
				<ion-button expand="full" fill="clear" @click="addTeamDialog = false">Annuler</ion-button>
			</ion-content>
		</ion-modal>
	</ion-content>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useTeamStore} from '@/store/team.store';
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
	IonModal,
	IonLabel,
	IonInput,
} from '@ionic/vue';

const router = useRouter();
const teamStore = useTeamStore();
const errorStore = useErrorStore();

const addTeamDialog = ref(false);
const newTeamName = ref('');

const teams = computed(() => teamStore.teams);

onMounted(() => {
	teamStore.fetchTeams();
});

const selectTeam = (team: any) => {
	teamStore.currentTeam = team;
	router.push({name: 'TeamDetail', params: {teamId: team._id}});
};

const openAddTeamDialog = () => {
	newTeamName.value = '';
	addTeamDialog.value = true;
};

const createNewTeam = async () => {
	if (!newTeamName.value.trim()) return;
	try {
		await teamStore.createTeam({name: newTeamName.value});
		addTeamDialog.value = false;
		newTeamName.value = '';
		await teamStore.fetchTeams();
	} catch (error: any) {
		errorStore.setError(`Erreur lors de la création de l'équipe: ${error.toString()}`);
	}
};
</script>