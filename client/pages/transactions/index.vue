<template>
  <v-row justify="center">
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
    <v-col cols="6">
      <v-row no-gutters>
        <v-col>
          <high-chart :options="monthlySavings"></high-chart>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="6">
      <v-row no-gutters>
        <v-col>
          <high-chart :options="expenseVsIncome"></high-chart>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="6">
      <v-row no-gutters>
        <v-col>
          <high-chart :options="expensePerCategory"></high-chart>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="6">
      <v-card>
        <v-card-title>
          <v-row no-gutters justify="space-between">
            <h3>Giao dịch gần đây nhất</h3>
            <v-btn nuxt to="/transactions/detail">Chi tiết</v-btn>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col>
              <v-simple-table>
                <thead>
                <tr>
                  <th>Mục chi tiêu</th>
                  <th>Số tiền</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Ăn lẩu</td>
                  <td>4000000</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <ErrorDialog
      :value="errorAny"
      :message="errorMessage"
      @modal-close="closeModal"
    ></ErrorDialog>
  </v-row>
</template>

<script>
import { Chart } from 'highcharts-vue'
import moment from 'moment'
import { randomNumber } from '~/common/helper/functions'

export default {
  components: {
    HighChart: Chart,
  },
  data: () => ({
    errorAny: false,
    errorMessage: '',
    profile: {},
    monthlySavings: {
      title: {
        text: 'Số tiền tiết kiệm hàng tháng',
        style: {
          color: 'blue',
          fontWeight: 'bold',
          fontSize: '175%',
        },
      },
      subtitle: {
        text: 'Tính theo VND',
        style: {
          fontSize: '140%',
        }
      },
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
          text: 'Thời gian'
        },
        type: 'datetime',
        labels: {
          format: '{value:%m/%Y}',
        },
      },
      series: [
        {
          name: 'Tiết kiệm hàng tháng',
          data: [],
        }
      ],
      plotOptions: {
        column: {
          maxPointWidth: 35,
        }
      }
    },
    expenseVsIncome: {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Biểu đồ thu/chi hàng tháng',
      },
      subtitle: {
        text: 'Tính bằng VND',
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          maxPointWidth: 35,
        }
      },
      yAxis: {
        title: {
          text: 'Số tiền',
        },
      },
      xAxis: {
        type: 'datetime',
        labels: {
          format: '{value:%m/%y}',
        },
      },
      series: [
        {
          name: 'Thu',
          data: [],
        },
        {
          name: 'Chi',
          color: '#E57373',
          data: [],
        },
      ],
    },
    expensePerCategory: {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Chi tiêu theo 3 loại lớn nhất',
      },
      subtitle: {
        text: 'Tính theo VND',
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            // eslint-disable-next-line quotes
            format: `<b>{point.name}</b>: {point.percentage:,.1f} %`
          }
        }
      },
      series: [{
        name: 'Tổng chi theo loại',
        colorByPoint: true,
        data: [
          {
            name: 'Xăng xe',
            y: 400_000,
          },
          {
            name: 'Ăn trưa',
            y: 800_000,
          },
          {
            name: 'Nhậu',
            y: 1_400_000,
          }
        ],
      }]
    }
  }),
  async fetch() {
    try {
      this.profile = await this.$axios.$get('/profile')
    } catch (e) {
      this.errorAny = true
      this.errorMessage = e.message
    }
  },
  mounted() {
    for (let i = 5; i < 12; i++) {
      this.monthlySavings.series[0].data.push(
        [
          +moment({ year: 2022, month: i }),
          randomNumber(1000, 7000) * 1000
        ]
      )
      this.expenseVsIncome.series[0].data.push([
        +moment({ year: 2022, month: i }),
        randomNumber(2000, 12000) * 1000
      ])
      this.expenseVsIncome.series[1].data.push([
        +moment({ year: 2022, month: i }),
        -(randomNumber(1200, 5000) * 1000)
      ])
    }
  },
  methods: {
    closeModal() {
      this.errorAny = false
      this.errorMessage = ''
    },
  },
}
</script>
