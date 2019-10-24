<template>
<v-container class="grey lighten-5">
      <div v-show="page_accueille">
        <v-btn block rounded color="primary" @click="logout_init_connexion" x-large>Connectez-vous</v-btn>
        <p></p>
        <v-btn block rounded color="secondary" @click="page_inscription" x-large>Inscrivez-vous</v-btn>
      </div>
      <div v-show="log">
        <v-btn @click="retour_page_accueille" rounded>Retour</v-btn>
        <v-text-field
          label="Identifiant"
          filled
          v-model="identifiant"
          :rules="[rules_mdp_id.required, rules_mdp_id.min]"
          hint="Au moins 4 caracteres"
          counter
        ></v-text-field>
        <v-text-field
          v-model="mdp"
          :append-icon="show_mdp ? 'Cacher' : 'Afficher'"
          :rules="[rules_mdp_id.required, rules_mdp_id.min]"
          :type="show_mdp ? 'text' : 'password'"
          label="Mot de passe"
          hint="Au moins 4 caracteres"
          counter
          @click:append="show_mdp = !show_mdp"
        ></v-text-field>
        <v-btn @click="login" v-show="connexion" block rounded color="primary">Connexion</v-btn>
        <v-btn @click="addLog" v-show="inscription" block rounded color="primary">Inscription</v-btn>
      </div>
</v-container>
</template>
