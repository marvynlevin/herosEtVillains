<template>
	<v-container>
		<!-- Affichage du loader pendant le chargement -->
		<v-progress-circular v-if="loading" indeterminate color="primary" class="d-block mx-auto mt-5"/>

		<!-- Affichage des détails de l'organisation -->
		<v-card v-if="org && !loading">
			<v-card-title class="headline">{{ org.name }}</v-card-title>
			<v-card-subtitle>Informations de l'organisation</v-card-subtitle>
			<v-card-text>
				<div><strong>Nom:</strong> {{ org.name }}</div>
				<div><strong>Phrase secrète:</strong> {{ org.secret }}</div>
			</v-card-text>

			<!-- Tableau des équipes -->
			<v-data-table v-if="org && org.teams && org.teams.length" :items="org.teams" :headers="teamHeaders">
				<template v-slot:item.actions="{ item }">
					<v-btn @click="viewTeamDetails(item)" color="blue darken-1" small class="white--text">
						<v-icon left>mdi-eye</v-icon>
						Détails
					</v-btn>
					<v-btn @click="confirmRemoveTeam(item)" color="red darken-1" small class="white--text">
						<v-icon left>mdi-delete</v-icon>
						Supprimer
					</v-btn>
				</template>
			</v-data-table>

			<v-alert v-if="org && org.teams && org.teams.length === 0" type="info">
				Aucune équipe disponible.
			</v-alert>

			<!-- Ajouter une équipe -->
			<v-btn color="green" class="mt-3" @click="toggleAddTeam">Ajouter une équipe</v-btn>
			<v-expand-transition>
				<div v-if="showAddTeam" class="mt-2">
					<v-select v-model="selectedTeam" :items="availableTeams" item-text="name" item-value="_id"
										label="Sélectionner une équipe"></v-select>
					<v-btn :disabled="!selectedTeam" color="primary" @click="addTeam">Valider</v-btn>
					<v-btn color="grey" class="ml-2" @click="toggleAddTeam">Annuler</v-btn>
				</div>
			</v-expand-transition>
		</v-card>

		<!-- Boîte de confirmation pour suppression d'équipe -->
		<v-dialog v-model="confirmDialog" max-width="500px">
			<v-card>
				<v-card-title>Confirmer la suppression</v-card-title>
				<v-card-text>Voulez-vous vraiment supprimer cette équipe de l'organisation ?</v-card-text>
				<v-card-actions>
					<v-btn color="red" @click="removeTeam">Supprimer</v-btn>
					<v-btn color="grey" @click="confirmDialog = false">Annuler</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import {mapActions, mapState, mapGetters, mapMutations} from "vuex";

export default {
	data() {
		return {
			loading: true,
			showDialog: false,
			confirmDialog: false,
			selectedTeam: null,
			teamToRemove: null,
			showAddTeam: false,
			teamHeaders: [
				{text: "Nom de l'équipe", align: "start", value: "name"},
				{text: "Actions", align: "center", value: "actions", sortable: false}
			]
		};
	},
	computed: {
		...mapState("org", ["currentOrg"]),
		...mapGetters("org", ["getOrgSecret"]),
		...mapGetters("team", ["getTeams", "getCurrentTeam"]),

		org() {
			console.log("données: ", this.currentOrg);
			return Array.isArray(this.currentOrg) ? this.currentOrg[0] : this.currentOrg || {};
		},

		availableTeams() {
			if (!this.org || !Array.isArray(this.org.teams)) {
				return [];
			}

			this.fetchTeams();
			const allTeams = this.getTeams || [];

			const existingTeamIds = this.org.teams.map(team => team._id || null);
			return allTeams.filter(team => !existingTeamIds.includes(team._id));
		}
	},
	created() {
		this.fetchOrgDetails();
	},
	methods: {
		...mapActions("org", ["fetchOrgById", "addTeamToOrg", "removeTeamFromOrg"]),
		...mapActions("team", ["fetchTeams"]),
		...mapMutations("team", ["SET_CURRENT_TEAM"]),
		...mapActions('error', ['setError']),

		async fetchOrgDetails() {
			try {
				const {id} = this.$route.params;

				await this.fetchOrgById({id: id, secret: this.getOrgSecret});

				this.showDialog = true;
			} catch (error) {
				console.error("Erreur lors du chargement :", error);
				this.showDialog = true;
				await this.setError(`Erreur lors du chargement : ${error}`)
			} finally {
				this.loading = false;
			}
		},

		viewTeamDetails(team) {
			this.SET_CURRENT_TEAM(team);
			this.$router.push({name: "TeamDetail", params: {teamId: team._id}});
		},

		toggleAddTeam() {
			this.showAddTeam = !this.showAddTeam;
			if (!this.showAddTeam) {
				this.selectedTeam = null;
			}
		},

		async addTeam() {
			if (!this.selectedTeam) return;
			try {
				await this.addTeamToOrg({idTeam: this.selectedTeam});
				await this.fetchOrgDetails();
				this.toggleAddTeam();
			} catch (error) {
				console.error("Erreur lors de l'ajout de l'équipe :", error);
				await this.setError(`Erreur lors de l'ajout de l'équipe: ${error}`)
			}
		},

		confirmRemoveTeam(team) {
			this.teamToRemove = team;
			this.confirmDialog = true;
		},

		async removeTeam() {
			if (!this.teamToRemove) return;
			try {
				await this.removeTeamFromOrg({idTeam: this.teamToRemove._id});
				await this.fetchOrgDetails();
			} catch (error) {
				console.error("Erreur lors de la suppression de l'équipe :", error);
				await this.setError(`Erreur lors de la suppression de l'équipe: ${error}`)
			}
			this.confirmDialog = false;
			this.teamToRemove = null;
		},

		goBack() {
			this.$router.push({name: "OrgList"});
		}
	}
};
</script>
