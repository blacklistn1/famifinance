<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col v-if="!$auth.loggedIn" cols="6">
        <v-card>
          <v-card-title class="text-h4">
            Welcome to FamiFinance
          </v-card-title>
          <v-spacer class="my-16"></v-spacer>
          <v-card-actions class="flex justify-center">
            <v-btn class="red accent-2 white--text font-weight-bold pa-5" @click="loginWithGoogle">
              login with google+
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col v-if="$auth.loggedIn" cols="12">
        <v-row align-content="stretch">
          <v-col cols="4">
            <v-card min-height="100%">
              <v-card-title>
                Balance
              </v-card-title>
              <v-card-text>
                <span class="text-h3 font-weight-bold">{{ formattedBalance }}</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card min-height="100%">
              <v-card-title>
                Income this month
              </v-card-title>
              <v-card-text>
                <span class="text-h3 font-weight-bold">5.000.000</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card min-height="100%">
              <v-card-title>
                Latest transaction
              </v-card-title>
              <v-card-text>
                <span class="text-h5">Tiền xăng xe: </span>
                <span class="text-h3 font-weight-bold">80.000</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="$auth.loggedIn">
      <v-col cols="12">
        <v-simple-table>
          <template #default>
            <thead>
            <tr>
              <th>Tên</th>
              <th>Số tiền</th>
              <th>Mục</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="ts in transactions" :key="ts.id">
              <td>{{ ts.title }}</td>
              <td>{{ ts.amount }}</td>
              <td>{{ ts.category.title }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-dialog v-model="errorDialog.enabled">
      <v-card>
        <v-card-text>
          <span class="text-h4">{{ errorDialog.title }}</span>: <span>{{ errorDialog.detail }}</span>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Highcharts from 'highcharts';

export default {
  data: () => ({
    errorDialog: {
      enabled: false,
      title: '',
      detail: '',
    },
    transactions: [],
    profile: {},
  }),
  async fetch() {
    if (this.$auth.loggedIn) {
      this.transactions = await this.getTransactions()
      this.profile = await this.getProfile()
    }
  },
  computed: {
    formattedBalance() {
      return Highcharts.numberFormat(
        parseFloat(this.profile.balance),
        0,
        ',',
        '.'
      )
    }
  },
  methods: {
    async loginWithGoogle() {
      try {
        await this.$auth.loginWith('google', {
          params: {
            prompt: 'select_account',
          }
        })
      } catch(e) {
        this.dialog.enabled = true
        this.dialog.title = 'Error ' + e.statusCode
        this.dialog.detail = e.message
      }
    },
    getTransactions(limit = 5) {
      return this.$axios.$get('/transactions', {
        params: {
          limit,
          order_created_at: 'desc'
          // recent: 1
        }
      })
    },
    getProfile() {
      return this.$axios.$get('/profile')
    }
  }
}
</script>
