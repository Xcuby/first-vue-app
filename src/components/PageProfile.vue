<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>4 images :</span>
        <span class="font-weight-light">test de culture générale/QI</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-show="!page_accueille && !log" @click="logout">Déconnexion</v-btn>
    </v-app-bar>
    <v-container class="grey lighten-5">
      <div v-show="profil">
        <v-btn v-show="historique || rank" @click="retour_profil" rounded>Retour</v-btn>
        <div v-show="!historique && !rank">
          <h1>Bienvenue {{identifiant}},</h1>
          <div v-show="message_score_profile">
            <p
              class="text-center font-weight-medium"
            >Votre meilleur score est de {{meilleur_score}} faute(s)</p>
          </div>
          <div v-show="!message_score_profile">
            <p>Vous n'avez pas encore de meilleur score, jouer au moins une fois pour en avoir un!</p>
          </div>
          <v-btn block rounded color="primary" @click="Jouer">Jouer !</v-btn>
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
            <p>Votre historique est vide pour l'instant !</p>
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
    </v-container>
  </v-app>
</template>

<script>
import { METHODS } from 'http';
export default {
  data: () => ({
  historique: false,
  rank: false,
  jouer: false,
  message_score_profile: false,
  score: [],
  classement_global: [],
  type_alerte_connexion: '',
  meilleur_score: 0
})
methods:
 {

}
</script>
