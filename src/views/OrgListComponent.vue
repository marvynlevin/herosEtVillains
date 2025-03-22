<template>
	<v-container>
		<v-card class="elevation-2">
			<v-card-title class="headline">Liste des organisations</v-card-title>

			<!-- Message lorsque aucune organisation n'est trouvée -->
			<v-alert v-if="!getOrgs.length" type="info" elevation="2">
				Aucune organisation trouvée.
			</v-alert>

			<!-- Tableau des organisations si elles existent -->
			<v-data-table
					v-else
					:headers="headers"
					:items="getOrgs"
					item-key="_id"
					class="elevation-1"
			>
				<template v-slot:item.actions="{ item }">
					<v-btn @click="selectOrg(item)" color="blue darken-1" small dark class="white--text">
						<v-icon left class="white--text">mdi-eye</v-icon>
						Détails
					</v-btn>
				</template>
			</v-data-table>

			<v-card-actions>
				<v-btn @click="openCreateDialog" color="primary" class="mt-4">
					Créer une organisation
				</v-btn>
			</v-card-actions>
		</v-card>

		<!-- Dialog pour créer une organisation -->
		<v-dialog v-model="dialog" max-width="500px" persistent>
			<v-card>
				<v-card-title class="headline">Créer une nouvelle organisation</v-card-title>
				<v-card-text>
					<v-text-field
							v-model="newOrg.name"
							label="Nom de l'organisation"
							required
							:error="!!error.name"
							:error-messages="error.name"
					/>
					<v-text-field
							v-model="newOrg.secret"
							label="Phrase secrète"
							type="password"
							required
							:error="!!error.secret"
							:error-messages="error.secret"
					/>
				</v-card-text>
				<v-card-actions class="justify-end">
					<v-btn @click="closeDialog">Annuler</v-btn>
					<v-btn color="primary" @click="handleCreateOrg">Créer</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import {mapState, mapActions, mapGetters, mapMutations} from "vuex";

export default {
	data() {
		return {
			dialog: false,
			newOrg: {name: "", secret: ""},
			error: {name: "", secret: ""},
			headers: [
				{text: "Nom", align: "start", value: "name"},
				{text: "Actions", align: "center", value: "actions", sortable: false},
			],
		};
	},
	computed: {
		...mapGetters("org", ["getOrgs", "getOrgSecret", "getSecretError"]),
		...mapState('org', ['currentOrg'])
	},
	created() {
		this.fetchOrgs(); // Initialiser la liste des organisations
	},
	methods: {
		...mapActions("org", ["fetchOrgs", "fetchOrgById", "createOrg", "addOrgToStore"]),
		...mapMutations('org', ['SET_CURRENT_ORG']),
		...mapActions('error', ['setError']),

		// Sélectionner une organisation et naviguer vers ses détails
		async selectOrg(org) {
			try {
				console.log("secret", `'${this.getOrgSecret}'`); // Affichage du secret
				console.log("id", org._id); // Affichage de l'ID de l'organisation

				// Vérifier l'organisation par son ID et son secret
				await this.fetchOrgById({id: org._id, secret: this.getOrgSecret});

				// Vérification de la réponse pour savoir si l'organisation est valide
				if (this.currentOrg) {
					await this.$router.push({name: "OrgDetail", params: {id: org._id}});
				} else {
					// Si l'organisation ou le secret est invalide, afficher un message d'erreur ou gérer autrement
					console.error("Erreur : secret invalide ou organisation non trouvée.");
					await this.setError("secret invalide ou organisation non trouvée");
				}
			} catch (error) {
				console.error("Erreur lors de la sélection :", error);
			}
		},

		// Ouvrir le dialog pour la création
		openCreateDialog() {
			this.newOrg = {name: "", secret: ""};
			this.error = {name: "", secret: ""};
			this.dialog = true;
		},

		// Fermer le dialog
		closeDialog() {
			this.dialog = false;
		},

		// Créer une organisation
		async handleCreateOrg() {
			this.error = {name: "", secret: ""};

			if (!this.newOrg.name.trim()) this.error.name = "Nom requis";
			if (!this.newOrg.secret.trim()) this.error.secret = "Phrase secrète requise";

			if (this.error.name || this.error.secret) return;

			try {
				console.log("données en entrée:", this.newOrg);
				// Appel à la méthode pour créer l'organisation via le store
				const createdOrg = await this.createOrg(this.newOrg);

				// Ajouter directement la nouvelle organisation au store
				await this.addOrgToStore(createdOrg);

				this.dialog = false;
				// Rafraîchir la liste des organisations en appelant fetchOrgs si nécessaire
				await this.fetchOrgs();
			} catch (error) {
				console.error("Erreur lors de la création :", error);
				await this.setError(`Erreur lors de la création : ${error}`);
			}
		},
	},
};
</script>
