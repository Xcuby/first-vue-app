<template>
  <v-container class="grey lighten-5">
    <h1>Bienvenue {{identifiant}},</h1>
    <div v-show="message_score_profile">
      <p
        class="text-center font-weight-medium"
      >Votre meilleur score est de {{meilleur_score}} faute(s)</p>
    </div>
    <div v-show="!message_score_profile">
      <p>Vous n'avez pas encore de meilleur score, jouer au moins une fois pour en avoir un!</p>
    </div>
    <v-btn block rounded color="primary" @click="jouer">Jouer !</v-btn>
    <p></p>
    <v-btn @click="historique" block rounded color="secondary">Historique personnel</v-btn>
    <p></p>
    <v-btn
      @click="classement"
      block
      rounded
      color="secondary"
    >Classement général entre tous les joueurs</v-btn>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    message_score_profile: false
  }),

  methods: {
    async historique () {
      this.$router.push('/PageHistoriquePersonnel')
    },
    async jouer () {
      this.$router.push('/Quizz')
    },
    async classement () {
      this.$router.push('/PageClassementGeneral')
    }
  }
}
</script>
