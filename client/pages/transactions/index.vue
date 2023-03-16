<template>
  <v-row>
    <v-col v-if="$auth.loggedIn" cols="12">
      <v-row align-content="stretch">
        <v-col cols="4">
          <v-card min-height="100%">
            <v-card-title>
              Balance
            </v-card-title>
            <v-card-text>
              <span class="text-h3 font-weight-bold">{{ profile.balance }}</span>
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
    <v-col cols="12">
      <high-chart :options="chartOptions"></high-chart>
    </v-col>
  </v-row>
</template>

<script>
import { Chart } from 'highcharts-vue'
export default {
  components: {
    HighChart: Chart,
  },
  data: () => ({
    profile: {},
    chartOptions: {
      chart: {
        type: 'column',
      },
      yAxis: {
        title: {
          text: 'Số tiền'
        },

      },
      xAxis: {
        title: {
          text: 'Năm'
        },
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      series: [
        {
          name: 'Tiết kiệm hàng tháng',
          data: [5_420_000, 1_222_000, 10_300_000, 5_430_000]
        }
      ],
      plotOptions: {
        column: {
          maxPointWidth: 15,
        }
      }
    }
  }),
  async fetch() {
    try {
      this.profile = await this.$axios.$get('/profile')
    } catch (e) {
      console.error(e)
    }
  },
}
</script>
