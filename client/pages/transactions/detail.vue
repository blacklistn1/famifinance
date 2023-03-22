<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-row>
    <v-col cols="12">
      <v-row no-gutters>
        <v-col cols="12">
          <h4 class="text-h4 font-weight-bold">Chi tiết giao dịch</h4>
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
      :method="formMethod"
      @insert-transaction="saveItem"
      @update-transaction="updateItem"
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
      formEnabled: false,
      formMethod: '',
      editedItem: {},
      dateMenu: false,
      timeMenu: false,
      newTransaction: {},
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
          value: 'date',
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
      tableData: [
        {
          id: 1,
          title: 'Xăng ô tô',
          description: 'This is a really really long text that could cause the column to stretch too wide and the table would look ugly',
          category: {
            id: 1,
            title: 'Tiền xăng xe',
          },
          amount: Highcharts.numberFormat(500_000, 0),
          type: 'chi',
          date: moment({year: 2023, month: 1, date: 15}).format('DD/MM/YY HH:MM')
        },
        {
          id: 2,
          title: 'Ăn trưa',
          description: 'This is a really really long text t',
          category: {
            id: 2,
            title: 'Tiền ăn'
          },
          amount: Highcharts.numberFormat(50_000, 0),
          type: 'chi',
          date: moment({year: 2023, month: 1, date: 12}).format('DD/MM/YY HH:MM')
        }
      ],
      categories: [],
    }
  },
  async fetch() {
    try {
      const resCate = await this.$axios.$get('/transactions/categories-all')
      this.categories = resCate.map(el => ({ value: el.id, text: el.title }))
    } catch (e) {
      this.errorObject.flag = true
      this.errorObject.message = e.message
    }
  },
  methods: {
    resetErrors() {
      this.errorObject.flag = false
      this.errorObject.message = ''
    },
    addItem() {
      this.formEnabled = true
      this.formMethod = 'insert'
    },
    saveItem(item) {

    },
    editItem(item) {
      this.formEnabled = true
      this.editedItem.title = item.title
      this.editedItem.description = item.description
      this.editedItem.categoryName = item.categoryName
      this.editedItem.amount = item.amount
      this.editedItem.date = moment(item.date, 'DD/MM/YY HH:MM').format('YYYY-MM-DD')
      this.editedItem.time = moment(item.date, 'DD/MM/YY HH:MM').format('HH:MM')
    },
    updateItem(item) {

    },
    deleteItem(item) {
      console.log('Delete item')
    }
  }
}
</script>

