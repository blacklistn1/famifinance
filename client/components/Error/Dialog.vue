<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <v-dialog width="500" dark>
    <v-card color="red darken-3 white--text">
      <v-card-title>
        <p class="text-lg-body-1">Error</p>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <p>{{ message }}</p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  props: {
    value: Boolean,
    message: String,
  },
}
</script>
