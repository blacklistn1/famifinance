<template>
  <v-row justify="center" no-gutters>
    <v-col cols="8" class="white">
      <v-card class="pa-6">
        <v-card-title>
          <h1>Profile</h1>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="5" class="flex justify-center">
              <v-avatar color="primary" size="150">
                <v-img v-if="profile.picture" :src="profile.picture"></v-img>
                <v-icon v-if="!profile.picture" dark size="90">mdi-account-circle</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="7">
              <v-row no-gutters align="center">
                <v-col>
                  <h3 class="text-h3">Balance: </h3>
                  <h2 class="text-h2 font-weight-bold">{{ profile.balance }}</h2>
                </v-col>
                <v-col>
                  <v-btn
                    class="primary white--text pa-8"
                    @click="addBalanceDialog = true"
                  >
                    <span class="text-h5">Add balance</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-row justify="space-between" no-gutters>
                <span class="font-weight-bold">Name:</span>
                <span class="font-weight-bold text-lg-body-1">{{ profile.name }}</span>
              </v-row>
              <v-row justify="space-between" no-gutters align-content="center">
                <span class="font-weight-bold">Gender: </span>
                <span class="text-lg-body-1">{{ profile.gender }}</span>
              </v-row>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="7">
              <v-row no-gutters justify="space-between">
                <v-col cols="3" align-self="center">
                  <span class="font-weight-bold">Email:</span>
                </v-col>
                <v-col>
                  <v-text-field v-model="$auth.user.email" disabled></v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters justify="space-between">
                <v-col cols="3" align-self="center">
                  <span class="font-weight-bold">Address:</span>
                </v-col>
                <v-col>
                  <v-text-field v-model="profile.address"></v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="3" align-self="center">
                  <span class="font-weight-bold">Nationality:</span>
                </v-col>
                <v-col>
                  <v-text-field v-model="profile.nationality"></v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters justify="space-between">
                <v-col cols="3" align-self="center">
                  <span class="font-weight-bold">Birth date:</span>
                </v-col>
                <v-col>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-menu
                        v-model="birthDateMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template #activator="{ on, attrs }">
                          <v-text-field
                            v-model="profile.birthDate"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="profile.birthDate"
                          @input="birthDateMenu = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="3" align-self="center">
                  <span class="font-weight-bold">Job:</span>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="profile.job"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="3" align-self="center">
                  <span class="font-weight-bold">Gender:</span>
                </v-col>
                <v-col>
                  <v-select
                    v-model="profile.gender"
                    :items="genderOptions"
                    persistent-hint
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col cols="5"></v-col>
            <v-col cols="7">
              <v-btn class="success" :disabled="updateProfileDisabled" @click="updateProfile">Update profile</v-btn>
            </v-col>
          </v-row>
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
            <v-text-field
              v-model="amount"
              :error-messages="amountErrors"
              label="Amount to add"
              @blur="$v.amount.$touch()"
              @input="$v.amount.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="title"
              label="Description"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="primary white--text"
            @click="addBalance"
          >
            Add balance
          </v-btn>
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
import moment from 'moment'
import { multitude } from '~/common/vuelidate/validators.js'

export default {
  mixins: [validationMixin],
  middleware: 'auth',
  validations: {
    amount: {
      required,
      minValue: minValue(1000),
      factorOfThousands: multitude(1000),
    },
  },
  data: () => ({
    profile: {
      gender: '',
      address: '',
      nationality: '',
      job: '',
      birthDate: '',
    },
    origProfile: {},
    updateProfileDisabled: true,
    amount: 0,
    title: '',
    addBalanceDialog: false,
    birthDateMenu: false,
    chartOptions: {
      series: [{ data: [1, 2, 3, 4] }],
    },
    genderOptions: ['Male', 'Female', 'Other'],
  }),
  async fetch() {
    this.profile = await this.$axios.$get('/profile')
    for (const key in this.profile) {
      if (this.profile[key] === null)
        this.profile[key] = ''
    }
    if (this.profile.birthDate.length) {
      const d = new Date(Date.parse(this.profile.birthDate))
      this.profile.birthDate = moment(d).format('YYYY-MM-DD')
    }
    this.origProfile = JSON.parse(JSON.stringify(this.profile))
  },
  computed: {
    amountErrors() {
      const errors = []
      if (!this.$v.amount.$dirty) return errors
      !this.$v.amount.required &&
        errors.push('Amount is required')
      !this.$v.amount.minValue &&
      errors.push(
        `Amount must be at least ${this.$v.amount.$params.minValue.min} VND`
      )
      !this.$v.amount.factorOfThousands &&
      errors.push(
        `Amount must be a multitude of ${this.$v.amount.$params.factorOfThousands.factor}`
      )
      return errors
    },
  },
  watch: {
    profile: {
      handler: function (val) {
        for (const key of Object.keys(val)) {
          if (key === 'user') continue
          if (val[key] !== this.origProfile[key]) {
            this.updateProfileDisabled = false
            break
          } else {
            this.updateProfileDisabled = true
          }
        }
      },
      deep: true,
    }
  },
  methods: {
    async addBalance() {
      try {
        const res = await this.$axios.post('/transactions/add-balance', {
          amount: parseFloat(this.amount),
          description: this.title.trim().length ? this.title : null
        })
        if (res.status === 201) {
          this.addBalanceDialog = false
          this.profile = {}
          this.profile = await this.$axios.$get('/profile')
        }
      } catch (e) {
        console.dir(e)
      }
    },
    async updateProfile() {
      try {
        const res = await this.$axios.patch('/profile', {
          firstName: this.$auth.user.given_name,
          gender: this.profile.gender || null,
          address: this.profile.address || null,
          nationality: this.profile.nationality || null,
          birthDate: moment(this.profile.birthDate).toISOString() || null,
          job: this.profile.job || null,
        })
        if ([200, 201].includes(res.status)) {
          this.profile = {}
          this.profile = await this.$axios.$get('/profile')
          this.origProfile = JSON.parse(JSON.stringify(this.profile))
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
}
</script>
