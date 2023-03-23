<template>
<!-- eslint-disable vue/no-mutating-props -->
  <v-dialog v-model="dialog" @click:outside="$emit('update:dialog', false)">
    <v-card>
      <v-card-title :class="colorClass">
        {{ statusText }}
      </v-card-title>
      <v-card-text>
        <p v-if="message" class="text-body-1">{{ message }}</p>
        <ul v-if="messages">
          <li v-for="(m, i) in messages" :key="i" class="text-body-1">
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
    dialog: Boolean,
    status: Number,
    statusText: String,
    message: String,
    messages: Array,
  },
  computed: {
    colorClass() {
      if (this.status > 199 && this.status < 300) return 'success'
      return 'error white--text'
    },
  }
}
</script>

