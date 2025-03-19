<template>
  <v-container>
    <v-row v-if="currentTeam">
      <v-col cols="12">
        <v-card class="elevation-2">
          <v-card-title>{{ teamName }}</v-card-title>
          <v-card-actions>
            <v-btn color="primary" @click="openAddMemberDialog">Ajouter un membre</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Liste des membres -->
      <v-col cols="12">
        <v-data-table
            v-if="teamDetails.length"
            :items="teamDetails"
            :headers="memberHeaders"
            class="elevation-1"
        >
          <template v-slot:item.name="{ item }">
            {{ item && item.publicName ? item.publicName : 'Nom inconnu' }}
          </template>

          <template v-slot:item.real="{ item }">
            {{ item && item.realName ? item.realName : 'Nom réel inconnu' }}
          </template>

          <template v-slot:item.role="{ item }">
            {{ item && item._id ? item._id : 'Rôle inconnu' }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn color="primary" @click="openEditMemberDialog(item)">Modifier</v-btn>
            <v-btn color="red" @click="confirmDeleteMember(item)">Supprimer</v-btn>
          </template>
        </v-data-table>
        <p v-else class="text-center">Aucun membre dans cette équipe.</p>
      </v-col>
    </v-row>

    <!-- Dialog de modification de héros -->
    <v-dialog v-model="editMemberDialog" max-width="600px">
      <v-card>
        <v-card-title>Modifier un Héros</v-card-title>
        <v-card-text>
          <v-form ref="editHeroForm">
            <v-text-field v-model="editHero.publicName" label="Nom public" required></v-text-field>
            <v-text-field v-model="editHero.realName" label="Nom réel" required></v-text-field>

            <!-- Liste des pouvoirs -->
            <div v-for="(power, index) in editHero.powers" :key="index" class="power-item">
              <v-text-field v-model="power.name" label="Nom du pouvoir" required></v-text-field>
              <v-select
                  v-model="power.type"
                  :items="[1, 2, 3, 4, 5, 6, 7]"
                  label="Type de pouvoir"
                  required
              ></v-select>
              <v-slider
                  v-model="power.level"
                  :min="0"
                  :max="100"
                  label="Niveau"
                  thumb-label
                  required
              ></v-slider>
              <v-btn color="red" @click="removePower(index)">Supprimer</v-btn>
            </div>

            <v-btn color="green" @click="addPower">Ajouter un pouvoir</v-btn>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="confirmEditMember">Modifier</v-btn>
          <v-btn color="grey" @click="editMemberDialog = false">Annuler</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog pour retirer un héros -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Confirmation</v-card-title>
        <v-card-text>Voulez-vous vraiment supprimer ce membre ?</v-card-text>
        <v-card-actions>
          <v-btn color="red" @click="deleteMember">Oui, supprimer</v-btn>
          <v-btn color="grey" @click="deleteDialog = false">Annuler</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog d'ajout de héros -->
    <v-dialog v-model="addMemberDialog" max-width="600px">
      <v-card>
        <v-card-title>Ajouter un Héros</v-card-title>
        <v-card-text>
          <v-form ref="addHeroForm">
            <v-text-field v-model="newHero.publicName" label="Nom public" required></v-text-field>
            <v-text-field v-model="newHero.realName" label="Nom réel" required></v-text-field>

            <!-- Liste des pouvoirs -->
            <div v-for="(power, index) in newHero.powers" :key="index" class="power-item">
              <v-text-field v-model="power.name" label="Nom du pouvoir" required></v-text-field>
              <v-select
                  v-model="power.type"
                  :items="[1, 2, 3, 4, 5, 6, 7]"
                  label="Type de pouvoir"
                  required
              ></v-select>
              <v-slider
                  v-model="power.level"
                  :min="0"
                  :max="100"
                  label="Niveau"
                  thumb-label
                  required
              ></v-slider>
              <v-btn color="red" @click="removePower(index)">Supprimer</v-btn>
            </div>

            <v-btn color="green" @click="addPower">Ajouter un pouvoir</v-btn>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="addMember">Ajouter</v-btn>
          <v-btn color="grey" @click="addMemberDialog = false">Annuler</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {mapState, mapGetters, mapActions} from "vuex";

export default {
  data() {
    return {
      addMemberDialog: false,
      editMemberDialog: false,
      deleteDialog: false,
      newHero: {
        publicName: "",
        realName: "",
        powers: [],
      },
      editHero: {
        publicName: "",
        realName: "",
        powers: [],
        _id: "",
      },
      selectedHeroId: null,
      editMember: null,
      memberToDelete: null,
      memberHeaders: [
        {text: "Nom", value: "name"},
        {text: "Réel", value: "real"},
        {text: "Rôle", value: "role"},
        {text: "Actions", value: "actions", sortable: false},
      ],
    };
  },

  computed: {
    ...mapState("team", ["currentTeam"]),
    ...mapGetters("org", ["getCurrentOrg", "getOrgSecret"]),
    ...mapGetters("team", ["getCurrentTeam"]),
    ...mapGetters("hero", ["getHeroesDetails", "getHeroesAliases"]),

    teamName() {
      return this.currentTeam ? this.currentTeam.name : "Équipe sans nom";
    },

    teamMembers() {
      const orgArray = this.getCurrentOrg;
      console.log(orgArray[0])
      if (!Array.isArray(orgArray) || orgArray.length === 0) {
        console.log("org n'est pas défini")
        return [];
      }
      const org = orgArray[0];

      if (!org || !Array.isArray(org.teams)) {
        return [];
      }

      const teamId = this.getCurrentTeam ? this.getCurrentTeam._id : null;

      if (!teamId) {
        return [];
      }

      const team = org.teams.find(t => String(t._id) === String(teamId));

      if (!team) {
        return [];
      }
      return team.members || [];
    },

    teamDetails() {
      const teamMemberIds = this.teamMembers.map(member => String(member));
      return this.getHeroesDetails.filter(hero =>
          teamMemberIds.includes(String(hero._id))
      ).map(hero => ({
        ...hero,
        publicName: hero.publicName || 'Nom inconnu',
        realName: hero.realName || 'Nom réel inconnu',
      }));
    },
  },

  methods: {
    ...mapActions("team", ["addMemberToTeam", "removeMemberFromTeam"]),
    ...mapActions("org", ["fetchOrgById"]),
    ...mapActions("hero", ["fetchHeroesAliases", "fetchHeroById", "createHero", "updateHero"]),

    async loadHeroes() {
      try {
        const memberIds = this.teamMembers;
        for (let id of memberIds) {
          await this.fetchHeroById({id, orgSecret: this.getOrgSecret});
        }
      } catch (error) {
        console.error('Erreur lors du chargement des héros:', error);
      }
    },

    openAddMemberDialog() {
      this.addMemberDialog = true;
    },

    addPower() {
      this.newHero.powers.push({name: "", type: null, level: 50});
    },

    removePower(index) {
      this.newHero.powers.splice(index, 1);
    },

    async addMember() {
      try {
        if (!this.newHero.publicName || !this.newHero.realName) {
          console.error("Veuillez renseigner le nom public et le nom réel.");
          return;
        }

        const hero = await this.createHero(this.newHero);
        if (hero) {
          await this.addMemberToTeam({teamId: this.currentTeam._id, heroId: hero._id});

          await this.fetchOrgById({id: this.getCurrentOrg[0]._id, secret: this.getOrgSecret});
          await this.loadHeroes();
        }

        this.addMemberDialog = false;
        this.newHero = {publicName: "", realName: "", powers: []};
      } catch (error) {
        console.error(error.message || "Erreur lors de l'ajout du héros.");
      }
    },

    openEditMemberDialog(member) {
      if (member) {
        console.log(member.publicName);
        this.editHero.publicName = member.publicName;
        this.editHero.realName = member.realName;
        this.editHero.powers = member.powers;
        this.editHero._id = member._id;
        console.log()
        this.editMemberDialog = true;
      } else {
        console.error("Données invalides pour le membre", member);
      }
    },

    async confirmEditMember() {
      try {
        if (this.editHero && this.editHero._id) {
          await this.updateHero({heroData: this.editHero, orgSecret: this.getOrgSecret});

          if (this.getCurrentOrg.length > 0 && this.getCurrentOrg[0]._id) {
            await this.fetchOrgById({id: this.getCurrentOrg[0]._id, secret: this.getOrgSecret});
          }

          await this.loadHeroes();
          this.editMemberDialog = false;
        }
      } catch (error) {
        console.error(error.message || "Erreur lors de la modification.");
      }
    },

    confirmDeleteMember(member) {
      this.memberToDelete = member;
      this.deleteDialog = true;
    },

    async deleteMember() {
      try {
        console.log("data hero remove: ", this.currentTeam._id, this.memberToDelete._id);
        if (this.memberToDelete && this.memberToDelete._id) {
          await this.removeMemberFromTeam({
            teamId: this.currentTeam._id,
            heroId: this.memberToDelete._id,
          });

          if (this.getCurrentOrg.length > 0 && this.getCurrentOrg[0]._id) {
            await this.fetchOrgById({id: this.getCurrentOrg[0]._id, secret: this.getOrgSecret});
          }

          await this.loadHeroes();
          this.deleteDialog = false;
        }
      } catch (error) {
        console.error(error.message || "Erreur lors de la suppression.");
      }
    },
  },

  beforeMount() {
    console.log("Données avant le rendu:");
    console.log("Organisation actuelle:", this.getCurrentOrg);
    console.log("Équipe actuelle:", this.currentTeam);
  },

  created() {
    this.loadHeroes();
  },
};
</script>
