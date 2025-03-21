<template>
	<v-container>
		<v-card class="elevation-2">
			<v-card-title class="headline">Liste des équipes</v-card-title>

			<!-- Afficher une alerte si aucune équipe n'est trouvée -->
			<v-alert v-if="!teams.length" type="info" elevation="2">
				Aucune équipe trouvée.
			</v-alert>

			<!-- Tableau des équipes si elles existent -->
			<v-data-table v-else :headers="headers" :items="teams" item-key="id" class="elevation-1">
				<template v-slot:item.actions="{ item }">
					<v-btn @click="selectTeam(item)" color="blue darken-1" small dark class="white--text">
						Sélectionner
					</v-btn>
				</template>
			</v-data-table>

			<v-btn @click="openAddTeamDialog" color="primary" class="mt-4">Créer une équipe</v-btn>
		</v-card>

		<!-- Dialog de création d'équipe -->
		<v-dialog v-model="addTeamDialog" max-width="500px">
			<v-card>
				<v-card-title class="headline">Créer une nouvelle équipe</v-card-title>
				<v-card-text>
					<v-text-field v-model="newTeamName" label="Nom de l'équipe" required></v-text-field>
				</v-card-text>
				<v-card-actions>
					<v-btn @click="createNewTeam" :disabled="!newTeamName" color="primary">Créer</v-btn>
					<v-btn @click="addTeamDialog = false" color="secondary">Annuler</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import {mapState, mapActions, mapMutations, mapGetters} from "vuex";

export default {
	data() {
		return {
			addTeamDialog: false,
			newTeamName: "",
			headers: [
				{text: "Nom de l'équipe", align: "start", value: "name"},
				{text: "Actions", align: "center", value: "actions"},
			],
		};
	},
	computed: {
		...mapState("team", ["teams"]),
		...mapGetters("team", ["getCurrentTeam"]),
		...mapGetters("org", ["getCurrentOrg"]),
	},
	async created() {
		await this.fetchTeams();
	},
	methods: {
		...mapActions("team", ["fetchTeams", "createTeam"]),
		...mapMutations("team", ["SET_CURRENT_TEAM"]),
		...mapActions('error', ['setError']),

		selectTeam(team) {
			this.SET_CURRENT_TEAM(team);
			this.$router.push({name: "TeamDetail", params: {id: this.getCurrentTeam._id}});
		},
		openAddTeamDialog() {
			this.newTeamName = "";
			this.addTeamDialog = true;
		},
		async createNewTeam() {
			if (!this.newTeamName.trim()) return;
			try {
				await this.createTeam({name: this.newTeamName});
				this.addTeamDialog = false;
				this.newTeamName = "";
				await this.fetchTeams();
			} catch (error) {
				console.error("Erreur lors de la création de l'équipe :", error);
				await this.setError(`Erreur lors de la création de l'équipe: ${error.toString()}`)
			}
		},
	},
};
</script>
