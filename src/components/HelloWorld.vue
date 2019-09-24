<template>
  <v-container class="grey lighten-5">
    <div v-show="!fin" class="text-center font-weight-medium" v-text="enonce[image[0].type].consigne"></div>
    <div v-show="fin" class="text-center display-4" v-text="Score()"></div>
    <v-row align="center" justify="center">
      <v-img v-show="fin" :src="intelligence[fauteFinal()].src" aspect-ratio="1" class="grey darken-4 " max-width="1000" max-height="500"></v-img>
    </v-row>
    <div v-show="fin" class="text-center display-1" v-text="intelligence[fauteFinal()].titre"></div>
    <v-row justify:space arround>
      <template v-for="n in 4">
        <v-col :key="n">
          <v-hover v-slot:default="{ hover }">
            <v-card
            v-show="!fin"
              class="pa-2"
              :color="image[n-1].color"
              v-on:click="image[n-1].color = validationCard(image[n-1].reponse), changementQuestion (image, image[n-1].color)"
              outlined
              tile
              :elevation="hover ? 0 : 19"
            >
              <v-img
                :src="image[n-1].src"
                aspect-ratio="1"
                class="grey lighten-2"
                max-width="600"
                max-height="215"
              ></v-img>
              <div class="text-center font-weight-medium" v-text="image[n-1].titre"></div>
            </v-card>
          </v-hover>
        </v-col>
        <v-responsive v-if="n-1 === 1" :key="`width-${n-1}`" width="100%"></v-responsive>
      </template>
    </v-row>
    <v-row justify:space arround>
      <v-col md="10">
        <v-text-field
          v-show="montrerChampDeTexte(image[0].type)"
          :background-color="couleurText"
          v-model="reponse"
          @click="resetCouleur()"
          @keyup.enter="validation(), validationText(image[0].reponse), changementQuestion(image, couleurText)"
          label="Entrez votre réponse"
          filled
        ></v-text-field>
      </v-col>
      <div class="my-3">
        <v-btn v-show="montrerChampDeTexte(image[0].type)" x-large color="primary" @click="validation(), validationText(image[0].reponse), changementQuestion(image, couleurText)">Valider</v-btn>
      </div>
    </v-row>
  </v-container>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { METHODS } from 'http'
export default {
  data: () => ({
    enonce: [
      { consigne: "Trouvez l'intrus parmis les images suivantes, cliquez directement sur l'image!" },
      { consigne: 'Entrez le points communs entre ces différentes images, entrez votre réponse dans le champ de texte!' },
      {
        consigne:
          'A votre avis de quelle année datent ces photos (elles ont toutes été prises à la même date), entrez votre réponse dans le champ de texte!'
      },
      { consigne: "Quel est la personne (ou objet) la plus âgée (ou le plus ancien), cliquez directement sur l'image!" }
    ],
    reponse: '',
    valider: false,
    couleurText: '',
    nombreDeFaute: 0,
    fin: false,
    image: [
      {
        src: require('@/assets/bugatti.jpg'),
        titre: 'Bugatti chiron',
        color: '',
        type: 0,
        reponse: false
      },
      {
        src: require('@/assets/Ferrari.jpg'),
        titre: 'Ferrari F8 tributo',
        color: '',
        reponse: false
      },
      {
        src: require('@/assets/lamborghini.jpg'),
        titre: 'Lamborghini aventador S',
        color: '',
        reponse: false
      },
      {
        src: require('@/assets/2Cheveaux.jpg'),
        titre: 'Citroën 2 Chevaux',
        color: '',
        reponse: true
      },
      {
        src: require('@/assets/drapeauBlanc.jpg'),
        titre: 'Blanc',
        color: '',
        type: 1,
        reponse: 'drapeau'
      },
      {
        src: require('@/assets/drapeauFr.jpg'),
        titre: 'France',
        color: '',
        reponse: 'drapeau'
      },
      {
        src: require('@/assets/drapeauNoir.jpg'),
        titre: 'Noir',
        color: '',
        reponse: 'drapeau'
      },
      {
        src: require('@/assets/drapeauPirate.jpg'),
        titre: 'Pirate',
        color: '',
        reponse: 'drapeau'
      },
      {
        src: require('@/assets/DiCaprio1998.jpg'),
        titre: 'Léonardo DiCaprio dans le film Titanic',
        color: '',
        type: 2,
        reponse: '1998'
      },
      {
        src: require('@/assets/CDM1998.jpg'),
        titre: 'La France championne du monde de Foot',
        color: '',
        reponse: '1998'
      },
      {
        src: require('@/assets/Chirac1998.jpg'),
        titre: 'Jacques Chirac, président de la France à cette époque',
        color: '',
        reponse: '1998'
      },
      {
        src: require('@/assets/BillClinton1998.jpg'),
        titre: 'Bill Clinton, président des Etats-Unis à cette époque',
        color: '',
        reponse: '1998'
      },
      {
        src: require('@/assets/TractionAvant.jpg'),
        titre: 'Première citroëne Traction-avant',
        color: '',
        type: 3,
        reponse: false
      },
      {
        src: require('@/assets/ValeryGiscardDEstaing.jpeg'),
        titre: "Valery Giscard d'Estaing, ancien président de la France",
        color: '',
        reponse: true
      },
      {
        src: require('@/assets/BrigitteMacron.jpg'),
        titre: 'Brigitte Macron, première dame de France actuelle',
        color: '',
        reponse: false
      },
      {
        src: require('@/assets/MachineDeTuring.jpg'),
        titre: 'Première machine de Turing (créé par Alain Turing)',
        color: '',
        reponse: false
      }
    ],
    intelligence: [
      {
        src: require('@/assets/YagamiLight.jpeg'),
        titre: "Tu as l'intelligence de Yagami Light de Death Note.\nTu as un QI de 300!!!"
      },
      {
        src: require('@/assets/SherlockHolmes.jpg'),
        titre: "Tu as l'intelligence de Sherlock Holmes.\nTu as un QI de 260!!!!"
      },
      {
        src: require('@/assets/Rick.jpg'),
        titre: "Tu as l'intelligence de Rick de Rick & Morty.\nTu as un QI 220!!!"
      },
      {
        src: require('@/assets/Yoda.jpg'),
        titre: "Tu as l'intelligence de Yoda de Star Wars. \n Tu as un QI de 180!!!"
      },
      {
        src: require('@/assets/Einstein.jpg'),
        titre: "Tu as l'intelligence de Einstien. \n Tu as un QI de 160!!"
      },
      {
        src: require('@/assets/Leonard.jpeg'),
        titre: "Tu as l'intelligence de Leonard de The Big Bang theory. \n Tu as un QI de 140!!"
      },
      {
        src: require('@/assets/MorganFreeman.jpg'),
        titre: "Tu as l'intelligence de Morgan Freeman. \n Tu as un QI de 130!"
      },
      {
        src: require('@/assets/Saitama.png'),
        titre: "Tu as l'intelligence de Saitama de One punch man. \n Tu as un QI de 90..."
      },
      {
        src: require('@/assets/Reese.jpg'),
        titre: "Tu as l'intelligence de Reese de Malcom. \n Tu as un QI de 70..."
      },
      {
        src: require('@/assets/Junior.png'),
        titre: "Tu as l'intelligence de Junior dans Ma famille d'abord. \n Tu as un QI de 50...."
      },
      {
        src: require('@/assets/Homer.jpg'),
        titre: "Tu as l'intelligence d'Homer dans les Simpson. \n Tu as un QI de 30......."
      }
    ]
  }),
  methods: {
    login () {
      // connecter utilisateur
      fetch('http://localhost:4000/api/login', {
        method: 'POST',
        body: { login: xav }
      })
        .then(response => {
          console.log('response is:', response)
        })
        .then(jsondata => {
          console.log('response is:', jsondata)
        })
    },
    validationCard (c) {
      if (typeof c === 'boolean') {
        if (c === true) {
          return 'green'
        } else {
          this.nombreDeFaute++
          console.log(this.nombreDeFaute)
          return 'red'
        }
      } else {
        return ''
      }
    },
    validationText (c) {
      if (typeof c === 'string' && this.valider === true) {
        if (c === this.reponse.toLowerCase()) {
          this.couleurText = 'green'
          return ''
        } else {
          this.nombreDeFaute++
          this.couleurText = 'red'
          return ''
        }
      }
    },
    changementQuestion (liste, couleur) {
      if (couleur === 'green' && liste.length > 4) {
        for (var i = 0; i < 4; i++) {
          liste.shift()
        }
        this.couleurText = ''
        this.reponse = ''
        return ''
      } else if (liste.length === 4 && couleur === 'green') {
        console.log('test')
        this.fin = true
      }
    },
    validation () {
      this.valider = true
    },
    resetCouleur () {
      this.couleurText = ''
      return ''
    },
    montrerChampDeTexte (type) {
      if (this.fin || type === 0 || type === 3) {
        return false
      } else {
        return true
      }
    },
    Score () {
      const fautes = this.nombreDeFaute
      return 'Vous avez fait ' + fautes + ' faute(s) !'
    },
    fauteFinal () {
      if (this.nombreDeFaute > 10) {
        return 10
      } else {
        return this.nombreDeFaute
      }
    }
  }
}
</script>
