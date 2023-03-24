<template>
<!-- eslint-disable vue/no-mutating-props -->
  <v-dialog v-model="enabled" width="400" @click:outside="$emit('update:enabled', false)">
    <v-card>
      <v-card-title :class="colorClass">
        {{ dialog.statusText }}
      </v-card-title>
      <v-card-text>
        <p v-if="dialog.message" class="text-body-1">{{ dialog.message }}</p>
        <ul v-if="dialog.messages.length">
          <li v-for="(m, i) in dialog.messages" :key="i" class="text-body-1">
            {{ m }}
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  props: {
    enabled: Boolean,
    dialog: {
      type: Object,
      default: () => ({
        status: Number,
        statusText: String,
        message: String,
        messages: Array,
      })
    },
  },
  computed: {
    colorClass() {
      if (this.dialog.status > 199 && this.dialog.status < 300) return 'success'
      return 'error white--text'
    },
  }
}
</script>

