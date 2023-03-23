<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-row>
    <v-col cols="12">
      <v-row no-gutters>
        <v-col cols="12">
          <h4 class="text-h4 font-weight-bold">Chi tiết giao dịch {{ monthLabel }}</h4>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-row no-gutters align="center">
        <v-col cols="2">
          <p class="text-body-1">Chọn tháng hiển thị</p>
        </v-col>
        <v-col cols="2">
          <v-menu
            ref="monthMenu"
            v-model="monthMenu"
            :close-on-content-click="false"
            :return-value.sync="monthInput"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                :value="monthLabel"
                label="Chọn tháng hiển thị"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="monthInput"
              type="month"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="monthMenu = false"
              >
                Huỷ
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="updateResult"
              >
                Chọn
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-data-table :headers="headers" :items="tableData">
        <template #top>
          <v-row no-gutters class="pa-3">
            <v-col>
              <v-btn color="grey lighten-2" @click="addItem">Thêm giao dịch</v-btn>
            </v-col>
          </v-row>
        </template>
        <template #item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-col>

    <TransactionForm
      :enabled.sync="formEnabled"
      :orig-transaction="editedItem"
      :method="formMethod"
      @insert-transaction="insertTransaction"
      @update-transaction="updateItem"
    ></TransactionForm>
    <DialogError :dialog.sync="errorObject.flag" :message="errorObject.message"></DialogError>

  </v-row>
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      errorObject: {
        flag: false,
        message: '',
      },
      resDialog: {
        enabled: false,
        statusText: '',
        statusCode: '',
        message: '',
      },
      formEnabled: false,
      formMethod: '',
      dateMenu: false,
      timeMenu: false,
      monthMenu: false,
      monthInput: moment().format('YYYY-MM'),
      editedItem: {
        title: '',
        category: {
          id: -1,
        },
        type: '',
        amount: 0,
        date: '',
        time: '',
        description: '',
      },
      origItem: {},
      headers: [
        {
          text: 'Tên giao dịch',
          value: 'title',
        },
        {
          text: 'Phân loại',
          value: 'category.title',
        },
        {
          text: 'Mô tả ngắn',
          value: 'description',
          sortable: false,
          width: 250,
        },
        {
          text: 'Số tiền',
          value: 'amount',
        },
        {
          text: 'Loại giao dịch',
          value: 'type',
        },
        {
          text: 'Ngày giao dịch',
          value: 'transactionDate',
          sort: (a, b) => {
            return (+moment(a, 'DD/MM/y')) - (+moment(b, 'DD/MM/y'))
          }
        },
        {
          text: 'Thao tác',
          value: 'actions',
          sortable: false,
        },
      ],
      tableData: [],
      categories: [],
    }
  },
  async fetch() {
    try {
      this.tableData = await this.getData()
      const resCate = await this.$axios.$get('/transactions/categories-all')
      this.categories = resCate.map(el => ({ value: el.id, text: el.title }))
    } catch (e) {
      this.errorObject.flag = true
      this.errorObject.message = e.message
    }
  },
  computed: {
    monthLabel() {
      return moment(this.monthInput, 'YYYY-MM').format('[tháng] M [năm] YYYY')
    }
  },
  watch: {
    $route: {
      handler: async function (val) {
        this.tableData = await this.getData(val.query)
      },
      deep: true,
    }
  },
  mounted() {
    this.origItem = JSON.parse(JSON.stringify(this.editedItem))
  },
  methods: {
    resetErrors() {
      this.errorObject.flag = false
      this.errorObject.message = ''
    },
    openErrorDialog(e) {
      this.errorObject.flag = true
      this.errorObject.message = e.message
    },
    async getData(query = {}) {
      try {
        const transactions = await this.$axios.$get('/transactions', {
          params: query
        })
        this.transformData(transactions)
        return transactions
      } catch (e) {
        this.openErrorDialog(e)
      }
    },
    updateResult() {
      this.$refs.monthMenu.save(this.monthInput)
      const monthInput = moment(this.monthInput, 'YYYY-MM')

      return this.$router.push({
        path: '/transactions/detail',
        query: {
          type: 'monthly',
          year: (monthInput.get('year')).toString(),
          month: (monthInput.get('month') + 1).toString(),
        }
      })

    },
    transformData(array) {
      for (const t of array) {
        t.transactionDate = this.transformDate(t.transactionDate)
      }
    },
    transformDate(input, format = 'DD/MM/YY HH:MM:SS') {
      return moment(input).format(format)
    },
    addItem() {
      this.formEnabled = true
      this.formMethod = 'insert'
      this.editedItem = JSON.parse(JSON.stringify(this.origItem))
    },
    saveItem() {},
    editItem(item) {
      this.formEnabled = true
      this.formMethod = 'update'
      Object.assign(this.editedItem, {
        id: item.id,
        title: item.title,
        description: item.description,
        category: { id: item.category.id },
        amount: item.amount,
        type: item.type,
        date: moment(item.transactionDate, 'DD/MM/YY HH:MM:SS').format('YYYY-MM-DD'),
        time: moment(item.transactionDate, 'DD/MM/YY HH:MM:SS').format('HH:MM'),
      })
    },
    updateItem(item) {
      item.transactionDate = moment(item.transactionDate).format('DD/MM/YY HH:MM:SS')
      const i = this.tableData.findIndex(el => el.id === item.id)
      Object.assign(this.tableData[i], {
        id: item.id,
        title: item.title,
        amount: item.amount,
        category: item.category,
        type: item.type,
        description: item.description,
        transactionDate: item.transactionDate,
      })
    },
    async insertTransaction(t) {
      try {
        this.tableData = await this.getData(this.$route.query)
      } catch (e) {
        this.errorObject.flag = true
        this.errorObject.message = e.message
      }
    },
    deleteItem(item) {
      console.log('Delete item')
    },
      closeFormModal() {
      this.formEnabled = false
    }
  }
}
</script>

