<template>
  <v-overlay :value="value" z-index="10">
    <v-card color="red darken-3">
      <v-card-text>
        <p>Error: {{ message }}</p>
        <div>
          <v-btn color="grey" @click="$emit('modal-close')">Close</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  props: {
    value: Boolean,
    message: String,
  }
}
</script>
