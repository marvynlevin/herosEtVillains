<template>
  <v-dialog v-model="dialog" max-width="400px" persistent>
    <v-card>
      <v-card-title class="headline">Entrer le mot de passe secret</v-card-title>
      <v-card-text>
        <v-text-field
            v-model="secret"
            label="Mot de passe secret"
            type="password"
            outlined
            dense
            :error="!!error"
            :error-messages="error"
        />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="closeDialog">Annuler</v-btn>
        <v-btn color="primary" text @click="submitSecret">Valider</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapState, mapMutations, mapGetters} from "vuex";

export default {
  data() {
    return {
      dialog: true,
      secret: "",
      error: null,
    };
  },
  computed: {
    ...mapState("org", {
      currentOrgSecret: (state) => state.currentOrgSecret,
    }),
  },
  methods: {
    ...mapMutations("org", {
      setOrgSecret: "SET_CURRENT_ORG_SECRET",
    }),
    closeDialog() {
      this.dialog = false;
    },
    submitSecret() {
      if (!this.secret.trim()) {
        this.error = "Le mot de passe secret est requis.";
        return;
      }

      console.log(this.secret);
      this.setOrgSecret(this.secret);
      this.closeDialog();

      this.$router.push({ name:"OrgList"});
    },
  },
};
</script>

