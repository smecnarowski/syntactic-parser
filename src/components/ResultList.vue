<template>
  <v-card-text>
    <div
      v-if="interpretation === undefined"
      key="title"
      class="title font-weight-light grey--text pa-3 text-xs-center"
    >
      Click list element on the left
    </div>
    <v-list subheader>
      <v-subheader>General</v-subheader>

      <v-list-tile avatar>
        <v-list-tile-content>
          <v-list-tile-title>Lexical symbol</v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <strong>{{ lexicalSymbol }}</strong>
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile avatar>
        <v-list-tile-content>
          <v-list-tile-title>Syntactic</v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-btn :color=" interpretation.result ? 'green' : 'red'">{{ statusText }}</v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>

    <v-divider></v-divider>

    <template v-if="invalidStrings.length">
      <v-list two-line subheader>
        <v-subheader>Invalid Tokens</v-subheader>

        <v-list-tile avatar v-for="(invalid, index) in invalidStrings" :key="index">
          <v-list-tile-content>
            <v-list-tile-title>Invalid symbol:</v-list-tile-title>
            <v-list-tile-sub-title>Symbol found in {{ selected.index + 1 }} line at position {{ invalid.position }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <strong>{{ invalid.value }}</strong>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>

      <v-divider></v-divider>
    </template>

    
  </v-card-text>
</template>

<script>
import SyntacticInterpreter from './../services/syntactic-interpreter'

export default {
  props: {
    selected: {
      type: Object,
      default: () => { return {} }
    }
  },
  computed: {
    lexicalSymbol() {
      return this.selected.extraction ? this.selected.extraction.lexicalSymbol : ''
    },
    statusText() {
      if (this.selected.color === undefined) {
        return 'Empty line'
      }

      if (this.invalidStrings.length) {
        return 'Invalid tokens'
      }

      if (this.interpretation.result === false) {
        return 'Bad syntax'
      }

      return 'Syntax OK'
    },
    invalidStrings() {
      return this.selected.extraction ? this.selected.extraction.ignoredStrings : []
    },
    interpretation() {
      if (this.selected.color !== 'green') {
        return { result: false }
      }

      return new SyntacticInterpreter(this.selected.extraction.parsedTokens)
    }
  },
}
</script>
