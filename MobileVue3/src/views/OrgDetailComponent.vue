<template>
	<ion-page>
		<ion-content>
			<ion-spinner v-if="loading" color="primary" class="mx-auto mt-5"></ion-spinner>

			<ion-card v-if="org && !loading">
				<ion-card-header>
					<ion-card-title class="headline">{{ org.name }}</ion-card-title>
					<ion-card-subtitle>Informations de l'organisation</ion-card-subtitle>
				</ion-card-header>
				<ion-card-content>
					<p><strong>Nom:</strong> {{ org.name }}</p>
					<p><strong>Phrase secrète:</strong> {{ orgSecret }}</p>
				</ion-card-content>

				<ion-list v-if="org && org.teams && org.teams.length">
					<ion-list-header>
						<ion-label>Équipes</ion-label>
					</ion-list-header>
					<ion-item v-for="team in org.teams" :key="team._id" @click="viewTeamDetails(team)">
						<ion-label>{{ team.name }}</ion-label>
						<ion-button slot="end" color="primary">
							<ion-icon :icon="eye"></ion-icon>
							Détails
						</ion-button>
						<ion-button slot="end" color="danger" @click.stop="confirmRemoveTeam(team)">
							<ion-icon :icon="trash"></ion-icon>
							Supprimer
						</ion-button>
					</ion-item>
				</ion-list>

				<ion-item v-if="org && org.teams && org.teams.length === 0">
					<ion-label>Aucune équipe disponible.</ion-label>
				</ion-item>

				<ion-card-content>
					<ion-button @click="toggleAddTeam">Ajouter une équipe</ion-button>
					<ion-item v-if="showAddTeam">
						<ion-select
								v-model="selectedTeam"
								label="Sélectionner une équipe"
								:interface-options="{ header: 'Sélectionner une équipe' }"
						>
							<ion-select-option v-for="team in availableTeams" :value="team._id" :key="team._id"
							>{{ team.name }}
							</ion-select-option>
						</ion-select>
						<ion-button :disabled="!selectedTeam" @click="addTeamToOrg">Valider</ion-button>
						<ion-button color="secondary" @click="toggleAddTeam">Annuler</ion-button>
					</ion-item>
				</ion-card-content>
			</ion-card>

			<ion-alert
					:is-open="confirmDialog"
					@didDismiss="confirmDialog = false"
					header="Confirmer la suppression"
					message="Voulez-vous vraiment supprimer cette équipe de l'organisation ?"
					:buttons="[
          {
            text: 'Annuler',
            role: 'cancel',
          },
          {
            text: 'Supprimer',
            handler: () => removeTeam(),
          },
        ]"
			></ion-alert>
			<ion-button @click="goBack()">Retour</ion-button>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import {defineComponent, ref, computed, onMounted} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {
	IonPage,
	IonContent,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardSubtitle,
	IonCardContent,
	IonList,
	IonItem,
	IonLabel,
	IonButton,
	IonIcon,
	IonSelect,
	IonSelectOption,
	IonAlert,
	IonSpinner
} from '@ionic/vue';
import {eye, trash} from 'ionicons/icons';
import {useOrgStore} from '@/store/org.store'; // Import Pinia store
import {useTeamStore} from '@/store/team.store';
import {useErrorStore} from '@/store/error.store';

export default defineComponent({
	components: {
		IonPage,
		IonContent,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardSubtitle,
		IonCardContent,
		IonList,
		IonItem,
		IonLabel,
		IonButton,
		IonIcon,
		IonSelect,
		IonSelectOption,
		IonAlert,
		IonSpinner
	},
	setup() {
		const router = useRouter();
		const route = useRoute();
		const orgStore = useOrgStore();
		const teamStore = useTeamStore();
		const errorStore = useErrorStore();

		const loading = ref(true);
		const confirmDialog = ref(false);
		const selectedTeam = ref<string | null>(null);
		const teamToRemove = ref<any>(null);
		const showAddTeam = ref(false);
		const orgId = computed(() => route.params.id as string);

		const org = computed(() => orgStore.currentOrg);
		const orgSecret = computed(() => orgStore.orgSecret);
		const teams = computed(() => teamStore.teams);

		const fetchOrgDetails = async () => {
			loading.value = true;
			try {
				await orgStore.fetchOrgById({id: orgId.value, secret: orgSecret.value!});
			} catch (error: any) {
				console.error('Erreur lors du chargement :', error);
				errorStore.setError(`Erreur lors du chargement : ${error.message}`);
			} finally {
				loading.value = false;
			}
		};

		const fetchTeams = async () => {
			try {
				await teamStore.fetchTeams();
			} catch (error: any) {
				console.error("Failed to fetch teams", error);
				errorStore.setError(`Failed to fetch teams: ${error.message}`);
			}
		}

		onMounted(() => {
			fetchOrgDetails();
			fetchTeams();
		});

		const viewTeamDetails = (team: any) => {
			teamStore.setCurrentTeam(team);
			router.push({name: 'TeamDetail', params: {teamId: team._id}});
		};

		const toggleAddTeam = () => {
			showAddTeam.value = !showAddTeam.value;
			if (!showAddTeam.value) {
				selectedTeam.value = null;
			}
		};

		const addTeamToOrg = async () => {
			if (!selectedTeam.value) return;
			try {
				await orgStore.addTeamToOrg({idTeam: selectedTeam.value});
				await fetchOrgDetails();
				toggleAddTeam();
			} catch (error: any) {
				console.error('Erreur lors de l\'ajout de l\'équipe :', error);
				errorStore.setError(`Erreur lors de l'ajout de l'équipe: ${error.message}`);
			}
		};

		const confirmRemoveTeam = (team: any) => {
			teamToRemove.value = team;
			confirmDialog.value = true;
		};

		const removeTeam = async () => {
			if (!teamToRemove.value) return;
			try {
				await orgStore.removeTeamFromOrg({idTeam: teamToRemove.value._id});
				await fetchOrgDetails();
			} catch (error: any) {
				console.error('Erreur lors de la suppression de l\'équipe :', error);
				errorStore.setError(`Erreur lors de la suppression de l'équipe: ${error.message}`);
			}
			confirmDialog.value = false;
			teamToRemove.value = null;
		};

		const goBack = () => {
			router.push({name: 'OrgList'});
		};

		const availableTeams = computed(() => {
			if (!org.value || !Array.isArray(org.value.teams)) {
				return [];
			}
			const existingTeamIds = org.value.teams.map((team: any) => team._id || null);
			return teams.value.filter((team: any) => !existingTeamIds.includes(team._id));
		});

		return {
			loading,
			confirmDialog,
			selectedTeam,
			teamToRemove,
			showAddTeam,
			org,
			orgSecret,
			availableTeams,
			viewTeamDetails,
			toggleAddTeam,
			addTeamToOrg,
			confirmRemoveTeam,
			removeTeam,
			goBack,
			eye,
			trash
		};
	},
});
</script>
