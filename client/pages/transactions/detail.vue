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

    <!-- Add transaction Overlay -->
    <TransactionAdd
      :enabled="addEnabled"
      @close="saveItem"
    ></TransactionAdd>
    <ErrorDialog v-model="errorObject.flag" :message="errorObject.message"></ErrorDialog>
  </v-row>
</template>

<script>
import moment from 'moment'
import Highcharts from 'highcharts'

export default {
  data: () => ({
    errorObject: {
      flag: false,
      message: '',
    },
    editEnable: false,
    addEnabled: false,
    editedItem: {},
    dateMenu: false,
    timeMenu: false,
    newTransaction: {},
    headers: [
      {
        text: 'Tên giao dịch',
        value: 'name',
      },
      {
        text: 'Phân loại',
        value: 'categoryName',
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
        name: 'Xăng ô tô',
        description: 'This is a really really long text that could cause the column to stretch too wide and the table would look ugly',
        categoryName: 'Tiền xăng xe',
        amount: Highcharts.numberFormat(500_000, 0),
        date: moment({ year: 2023, month: 1, date: 15 }).format('DD/MM/YY HH:MM')
      },
      {
        name: 'Ăn trưa',
        description: 'This is a really really long text t',
        categoryName: 'Tiền ăn',
        amount: Highcharts.numberFormat(50_000, 0),
        date: moment({ year: 2023, month: 1, date: 12 }).format('DD/MM/YY HH:MM')
      }
    ],
    categories: [],
  }),
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
      this.addEnabled = true
    },
    saveItem(item) {
      this.transaction = item
    },
    editItem(item) {
      this.editEnable = true
      this.editedItem.name = item.name
      this.editedItem.description = item.description
      this.editedItem.categoryName = item.categoryName
      this.editedItem.amount = item.amount
      this.editedItem.date = moment(item.date, 'DD/MM/YY HH:MM').format('YYYY-MM-DD')
      this.editedItem.time = moment(item.date, 'DD/MM/YY HH:MM').format('HH:MM')
    },
    deleteItem(item) {
      console.log('Delete item')
    }
  }
}
</script>

