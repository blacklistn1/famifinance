<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <v-dialog v-model="enabled" width="400" @click:outside="closeModal">
    <v-card>
      <v-card-title class="red white--text">
        <p class="text-lg-body-1">Error</p>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <p class="mt-4 text-xl-body-1">{{ errorMessage }}</p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  props: {
    enabled: {
      type: Boolean,
      default: false,
    },
    message: String,
  },
  data() {
    return {
      errorMessage: this.message,
    }
  },
  watch:{
    message() {
      this.errorMessage = this.message
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:enabled', false)
    }
  }
}
</script>
