<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>4 images :</span>
        <span class="font-weight-light">test de culture générale/QI</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout">Déconnexion</v-btn>
    </v-app-bar>
    <v-container class="grey lighten-5">
      <div v-show="presentation">
        <h1 class="text-center display-4">4 images</h1>
        <v-img src='@/assets/PageAccueille.jpg'></v-img>
        <p class="text-center display-1">Un moyen de tester son QI efficacement</p>
        <p class="text-center display-1">(sans aucune garantie de fiabilité des résultats bien sûr)</p>
        <v-btn v-show="presentation" @click="pageProfil" block rounded color="primary">Accèdé à mon profil</v-btn>
      </div>
      <div v-show="profil">
        <v-btn v-show="historique || rank" @click="retourProfil" rounded>Retour</v-btn>
        <div v-show="!historique && !rank">
          <h1 class="display-1">Bienvenue {{identifiant}},</h1>
          <div v-show="message_score_profile">
            <h2
              class="text-center font-weight-light"
            >Votre meilleur score est de {{meilleur_score}} faute(s)</h2>
          </div>
          <div v-show="!message_score_profile">
            <h2 class="text-center font-weight-light">Vous n'avez pas encore de meilleur score, jouer au moins une fois pour en avoir un!</h2>
          </div>
          <v-btn block rounded color="primary" @click="jouer">Jouer !</v-btn>
          <p></p>
          <v-btn @click="historic" block rounded color="secondary">Historique personnel</v-btn>
          <p></p>
          <v-btn
            @click="classement_general"
            block
            rounded
            color="secondary"
          >Classement général entre tous les joueurs</v-btn>
        </div>
        <div v-show="historique" rounded color="primary">
          <div v-show="message_score_profile">
            <p class="text-center font-weight-medium">HISTORIQUE PERSONNEL</p>
            <v-data-table
              :headers="[{ text: 'Partie n°', align: 'left', value: 'numeroPartie'}, { text: 'Nombre de fautes', value: 'score'}]"
              :items="score"
              :items-per-page="5"
              class="elevation-1"
            ></v-data-table>
          </div>
          <div v-show="!message_score_profile">
            <h1 class="text-center font-weight-light">Votre historique est vide pour l'instant !</h1>
          </div>
        </div>
        <div v-show="rank" rounded color="primary">
          <p class="text-center font-weight-medium">CLASSEMENT GLOBAL</p>
          <v-data-table
            :headers="[{ text: 'Rang', align: 'left', value: 'rang'}, { text: 'Pseudo du joueur', value: 'username'}, { text: 'Nombre de fautes', value: 'score'}]"
            :items="classement_global"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
        </div>
      </div>
      <div v-show="erreurLogin">
          <v-alert type="error">Vous devez être connecté pour accèder à votre profile!</v-alert>
        </div>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    presentation: true,
    profil: false,
    historique: false,
    rank: false,
    message_score_profile: false,
    score: [],
    classement_global: [],
    type_alerte_connexion: '',
    meilleur_score: null,
    identifiant: sessionStorage.identifiant,
    url: 'http://localhost:4000',
    erreurLogin: false
  }),
  methods:
 {
   async logout () {
     const response = await this.axios.get(this.url + '/api/logout')
     if (response.data.message === 'you are now disconnected') {
       this.profil = false
       this.presentation = true
       this.rank = false
       this.historique = false
       console.log('response is:', response)
       this.$router.push('./PageAccueille')
     }
   },
   async historic () {
     this.historique = true
     const response = await this.axios.get(this.url + '/api/historique', {})
     this.score = response.data.historique
   },

   async classement_general () {
     this.rank = true
     const response = await this.axios.post(this.url + '/api/classement', {})
     this.classement_global = response.data.classementGlobal
     console.log(this.classement_global)
   },
   retourProfil () {
     this.presentation = false
     this.profil = true
     this.rank = false
     this.historique = false
   },
   async jouer () {
     this.profil = false
     this.presentation = true
     this.rank = false
     this.historique = false
     this.$router.push('/Quizz')
   },
   async pageProfil () {
     const response = await this.axios.get(this.url + '/api/meilleurScore', {})
     this.meilleur_score = response.data.meilleur_score
     if (response.data.message === 'Authentification requise') {
       this.erreurLogin = true
     } else {
       if (this.meilleur_score === null) {
         this.message_score_profile = false
       } else {
         this.message_score_profile = true
       }
       this.presentation = false
       this.profil = true
       this.rank = false
       this.historique = false
     }
   }
 }
}
</script>
