<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-row>
    <v-col cols="12">
      <v-row no-gutters>
        <v-col cols="12">
          <h4 class="text-h4 font-weight-bold">Chi tiết giao dịch tháng này</h4>
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
    ></TransactionForm>
    <DialogError :dialog.sync="errorObject.flag" :message="errorObject.message"></DialogError>

  </v-row>
</template>

<script>
import moment from 'moment'
import Highcharts from 'highcharts'

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
      const transactions = await this.$axios.$get('/transactions')
      for (const t of transactions) {
        t.amount = Highcharts.numberFormat(parseFloat(t.amount), 0, ',', '.')
        t.transactionDate = moment(t.transactionDate).format('DD/MM/YY HH:MM:SS')
      }
      const resCate = await this.$axios.$get('/transactions/categories-all')
      this.categories = resCate.map(el => ({ value: el.id, text: el.title }))
      this.tableData = transactions
    } catch (e) {
      this.errorObject.flag = true
      this.errorObject.message = e.message
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
    addItem() {
      this.formEnabled = true
      this.formMethod = 'insert'
      this.editedItem = JSON.parse(JSON.stringify(this.origItem))
    },
    saveItem() {},
    editItem(item) {
      console.log(item)
      this.formEnabled = true
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

    },
    insertTransaction(transaction) {
      const t = transaction
      t.amount = Highcharts.numberFormat(parseFloat(t.amount), 0, ',', '.')
      t.transactionDate = moment(t.transactionDate).format('DD/MM/YY HH:MM:SS')
      this.tableData.push(transaction)
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

