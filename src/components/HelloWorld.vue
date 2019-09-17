<template>
  <v-container class="grey lighten-5">
    <v-row justify:space arround>
      <template v-for="n in 4">
        <v-col :key="n">
          <v-card class="pa-1" outlined tile elevation="12">
            <v-img
              :src="require('./assets/bugatti.jpg')"
              aspect-ratio="1"
              class="grey lighten-2"
              max-width="800"
              max-height="250"
            ></v-img>
            <div class="text-center font-weight-medium">Titre de la photo</div>
            <v-card-text>Texte de la photo</v-card-text>
          </v-card>
        </v-col>
        <v-responsive v-if="n === 2" :key="`width-${n}`" width="100%"></v-responsive>
      </template>
    </v-row>
    <v-row justify:space arround>
      <v-col md="10">
        <v-text-field label="Entrez votre réponse" filled></v-text-field>
      </v-col>
      <div class="my-3">
        <v-btn x-large color="primary">Valider</v-btn>
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    énoncé: [
      { consigne: "Trouvez l'intrus parmis les images suivantes" },
      { consigne: 'Entrez le points communs entre ces différentes images' },
      {
        consigne:
          'A votre avis de quand date ces photos (elles ont toutes été prises à la même date)'
      }
    ],
    image: [
    ]
  })
}
</script>
