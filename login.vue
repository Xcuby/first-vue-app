<template>
    <v-content>
      <v-layout text-center wrap>
      <v-form v-model="valid">
        <v-container v-if="connexion">

            <v-col cols="12" md="4">
              <v-text-field v-model="username" label="Username" required></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field v-model="password" label="Password" required></v-text-field>
            </v-col>

          <v-btn @click="login">Connexion</v-btn>
          <v-btn @click="addLog">Inscription</v-btn>

          <v-col cols="12" md="4">
              <v-text> {{message}} </v-text>
          </v-col>
        </v-container>

      <v-container v-if="connecte">
                <v-col cols="12" md="4">
                  <v-text>BIENVENUE</v-text>
                </v-col>
      </v-container>

      </v-form>
    </v-layout>
    </v-content>
</template>

<script>

export default {
  data: () => ({
    connexion: true,
    connecte: false,
    username: '',
    password: '',
    message: ''
  }),
  methods: {
    login () {
      // connecter l'utilisateur
      this.axios.post('http://localhost:4000/api/login', {
        login: this.username,
        password: this.password
      })
        .then(jsondata => { this.message = jsondata.data.message })
      console.log(this.message)
      if (this.message === 'connected') {
        console.log('ca marche')
        this.connexion = false
        this.connecte = true
      }
    },
    addLog () {
      this.axios.post('http://localhost:4000/api/addLog', {
        login: this.username,
        password: this.password
      })
        .then(jsondata => { this.message = jsondata.data.message })
    },
    logout () {
    }
  }
}
</script>
