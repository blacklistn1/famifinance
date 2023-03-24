<template>
  <v-row justify="center">
    <v-col v-if="$auth.loggedIn" cols="12">
      <v-row align-content="stretch">
        <v-col cols="4">
          <v-card min-height="100%">
            <v-card-title>
              Số dư hiện tại
            </v-card-title>
            <v-card-text>
              <span class="text-h3 font-weight-bold">{{ formattedBalance }}</span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card min-height="100%">
            <v-card-title>
              Tiết kiệm tháng này
            </v-card-title>
            <v-card-text>
              <span class="text-h3 font-weight-bold">5.000.000</span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card min-height="100%">
            <v-card-title>
              Giao dịch gần đây nhất
            </v-card-title>
            <v-card-text>
              <span class="text-h5">{{ mostRecentTransaction.title }}:</span>
              <span class="text-h3 font-weight-bold">{{ mostRecentTransaction.amount }}</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-row no-gutters>
        <v-col>
          <high-chart :options="monthlySavings"></high-chart>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
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
                <tr v-for="t in mostRecentTransactions" :key="t.id">
                  <td>{{ t.category.title }}</td>
                  <td>{{ t.amount }}</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <DialogError
      :message="errorMessage"
      :enabled.sync="errorAny"
    ></DialogError>
  </v-row>
</template>

<script>
import { Chart } from 'highcharts-vue'
import moment from 'moment'
import Highcharts from 'highcharts'
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
        text: 'Thu tháng trước',
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
        type: 'line',
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
          format: '{value:%d/%m}',
        },
      },
      series: [
        {
          name: 'Số tiền',
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
        data: [],
      }]
    },
    mostRecentTransactions: [
      {
        title: '',
        category: { id: -1 },
        transactionDate: '',
        type: '',
        amount: 0,
      }
    ],
    sumByMonth: [],
  }),
  async fetch() {
    try {
      this.profile = await this.$axios.$get('/profile')
      this.mostRecentTransactions = await this.$axios.$get('/transactions/most-recent')
      for (const t of this.mostRecentTransactions) {
        t.amount = Highcharts.numberFormat(parseFloat(t.amount), 0, ',', '.')
      }
      await this.getSumByMonth()
      const sumByCate = await this.getSumByCategory()
      for (const el of sumByCate) {
        this.expensePerCategory.series[0].data.push({
          name: el.category.title,
          y: el.sumAmount,
        })
      }
    } catch (e) {
      this.errorAny = true
      this.errorMessage = e.message
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
    },
    mostRecentTransaction() {
      const { title, amount } = this.mostRecentTransactions[0]
      return { title, amount }
    }
  },
  mounted() {
    for (let i = 5; i < 12; i++) {
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
    async getSumByMonth() {
      const sum = await this.$axios.$get('/transactions/sum-by-month', {
        params: {
          year: moment().year(),
          month: moment().month() + 1,
        }
      })
      for (const el of sum) {
        el.transactionDate = +moment(el.transactionDate, 'YYYY-MM-DD')
      }
      this.sumByMonth = sum
      for (const s of this.sumByMonth) {
        this.monthlySavings.series[0].data.push([
          s.transactionDate,
          s.sumAmount,
        ])
      }
    },
    async getSumByCategory() {
      const sum = await this.$axios.$get('/transactions/sum-by-category', {
        params: {
          year: moment().year(),
          month: moment().month() + 1,
        }
      })
      sum.sort((a, b) => {
        return b.sumAmount - a.sumAmount
      })
      return sum
    }
  },
}
</script>
