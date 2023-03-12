<template>
  <v-row class="white">
    <v-col>
      <v-card>
        <v-card-title>
          <h1>Profile</h1>
        </v-card-title>
        <v-card-text>
          <div>
            Balance:
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="addBalanceDialog = true">Add balance</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <!-- Add balance dialog -->
    <v-dialog v-model="addBalanceDialog" width="400">
      <v-card>
        <v-card-title>
          <h4 class="text-h4">Add to balance</h4>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="amount" :error-messages="amountErrors" label="Amount to add" @blur="$v.amount.$touch()"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary white--text" @click="addBalance">Add balance</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ./dialog -->

  </v-row>
</template>

<script>
// import { Chart } from 'highcharts-vue'
import { validationMixin } from 'vuelidate'
import { required, minValue } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  middleware: 'auth',
  validations: {
    amount: {
      required,
      min: minValue(1000)
    }
  },
  data: () => ({
    profile: null,
    amount: 0,
    addBalanceDialog: false,
    chartOptions: {
      series: [
        { data: [1, 2, 3, 4] },
      ],
    }
  }),
  async fetch() {
    this.profile = await this.$axios.$get('/profile')
  },
  computed: {
    amountErrors() {
      const errors = []
      if (this.$v.amount.$dirty) return errors
      !this.$v.amount.maxValue && errors.push('Amount must be at least 1000 VND')
      return errors
    }
  },
  methods: {
    async addBalance() {
      const res = await this.$axios.post('/profile/add-balance', {
        balance: this.amount,
      })
      if (res.status === 201) {
        return this.$router.push('/profile')
      }
    }
  }
}
</script>
