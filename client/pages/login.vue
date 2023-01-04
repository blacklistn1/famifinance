<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-card>
        <v-card-title>
          <h1>Title</h1>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field label="Email"></v-text-field>
            <v-text-field type="password" label="Password"></v-text-field>
            <v-btn>Submit</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'default',
}
</script>

