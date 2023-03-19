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

    <!-- Update transaction Overlay -->
    <v-overlay :value="editEnable">
      <v-card light width="1000">
        <v-card-title>
          <h5 class="text-h5 font-weight-bold">Chỉnh sửa giao dịch</h5>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-row justify="space-around">
              <v-col cols="5">
                <v-text-field v-model="editedItem.name" label="Tên giao dịch"></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-select
                  v-model="editedItem.categoryName"
                  :items="categories"
                  offset-y
                  label="Phân loại"
                ></v-select>
              </v-col>
            </v-row>
            <v-row justify="space-around">
              <v-col cols="5">
                <v-textarea v-model="editedItem.description" rows="4" label="Mô tả ngắn"></v-textarea>
              </v-col>
              <v-col cols="5">
                <v-row no-gutters justify="space-around">
                  <!-- Ngày giao dịch -->
                  <v-col cols="5">
                    <v-menu
                      v-model="dateMenu"
                      offset-y
                      min-width="auto"
                    >
                      <template #activator="{ attrs, on }">
                        <v-text-field
                          v-model="editedItem.date"
                          label="Ngày giao dịch"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.date"
                        no-title
                        scrollable
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <!-- Giờ giao dịch -->
                  <v-col cols="5">
                    <v-menu
                      ref="timeMenu"
                      v-model="timeMenu"
                      :return-value.sync="editedItem.time"
                      :close-on-content-click="false"
                      offset-y
                      min-width="auto"
                    >
                      <template #activator="{ attrs, on }">
                        <v-text-field
                          v-model="editedItem.time"
                          label="Giờ giao dịch"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="timeMenu"
                        v-model="editedItem.time"
                        format="24hr"
                        @click:minute="$refs.timeMenu.save(editedItem.time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-row justify="center" no-gutters>
            <v-btn color="grey lighten-2" large @click="editEnable = !editEnable">Đóng</v-btn>
            <v-btn color="primary" large class="ml-4" @click="console.log('a')">Gửi</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-overlay>
    <ErrorDialog :value="errorAny" :message="errorMessage"></ErrorDialog>
  </v-row>
</template>

<script>
import moment from 'moment'
import Highcharts from 'highcharts'

export default {
  data: () => ({
    errorAny: false,
    errorMessage: '',
    editEnable: false,
    editedItem: {},
    dateMenu: false,
    timeMenu: false,
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
      this.errorAny = true
      this.errorMessage = e.message
    }
  },
  methods: {
    resetErrors() {
      this.errorAny = false
      this.errorMessage = ''
    },
    addItem() {
      this.editEnable = true
      this.editedItem = {}
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

