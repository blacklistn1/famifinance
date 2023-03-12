<template>
  <v-row>
    <v-col>
      <v-card></v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  middleware: 'auth',
  /* Create a transaction */
  /* Needs to be logged in */
  /* Transaction has title, description, amount, direction (out, in), */
}
</script>

<style scoped lang="sass">

</style>
