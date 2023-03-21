<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <v-dialog v-model="enabled" width="1000" @click:outside="closeModal">
    <v-card>
      <v-card-title>
        <h4 class="text-h4 font-weight-bold">Thêm giao dịch</h4>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form>
          <v-row justify="space-around">
            <v-col cols="5">
              <v-text-field v-model="transaction.title" label="Tên giao dịch"></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-select
                v-model="transaction.category.id"
                :items="categories"
                item-text="title"
                item-value="id"
                offset-y
                label="Phân loại"
              ></v-select>
            </v-col>
          </v-row>
          <v-row justify="space-around">
            <v-col cols="5">
              <v-text-field
                v-model="transaction.amount"
                label="Số tiền"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-radio-group v-model="transaction.type" row>
                <template #label>
                  <span class="font-weight-bold">Loại giao dịch</span>
                </template>
                <v-radio label="Thu" value="thu"></v-radio>
                <v-radio label="Chi" value="chi"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row justify="space-around">
            <v-col cols="5">
              <v-textarea v-model="transaction.description" rows="1" label="Mô tả ngắn"></v-textarea>
            </v-col>
            <v-col cols="5">
              <v-row no-gutters justify="space-between">
                <!-- Ngày giao dịch -->
                <v-col cols="5">
                  <v-menu
                    ref="dateMenu"
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="transaction.date"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ attrs, on }">
                      <v-text-field
                        v-model="transaction.date"
                        label="Ngày giao dịch"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="transaction.date"
                      no-title
                      scrollable
                    >
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dateMenu.save(transaction.date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <!-- Giờ giao dịch -->
                <v-col cols="5">
                  <v-menu
                    ref="timeMenu"
                    v-model="timeMenu"
                    :return-value.sync="transaction.time"
                    :close-on-content-click="false"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ attrs, on }">
                      <v-text-field
                        v-model="transaction.time"
                        label="Giờ giao dịch"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="timeMenu"
                      v-model="transaction.time"
                      format="24hr"
                      @click:minute="$refs.timeMenu.save(transaction.time)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row justify="center" no-gutters class="pa-3">
          <v-btn color="grey lighten-2" large @click="closeModal">Đóng</v-btn>
          <v-btn color="primary" large class="ml-4" @click="submitTransaction">Gửi</v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="resDialog.enabled" width="400" @click:outside.self="resDialog.enabled = false">
      <v-card>
        <v-card-title>
          <h5 class="text-h5 font-weight-bold">{{ resDialog.statusText }}</h5>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <p>Status code: {{ resDialog.statusCode }}</p>
          <p>message: {{ resDialog.message }}</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import moment from 'moment'
/* eslint-disable vue/require-default-prop, vue/require-valid-default-prop */

export default {
  props: {
    enabled: Boolean,
    origTransaction: {
      type: Object,
      default: () => ({
        id: Number,
        title: String,
        description: String,
        category: {
          type: Object,
          default: () => ({
            id: Number,
            title: String,
          }),
        },
        type: String,
        date: String,
        time: String,
      }),
    },
    method: String,
  },
  data() {
    return {
      resDialog: {
        enabled: false,
        statusCode: '',
        statusText: '',
        message: '',
      },
      dialog: this.enabled,
      dateMenu: false,
      timeMenu: false,
      categories: [],
      transaction: JSON.parse(JSON.stringify(this.origTransaction)),
    }
  },
  async fetch() {
    this.categories = await this.$axios.$get('/transactions/categories-all')
  },
  methods: {
    closeModal() {
      this.$emit('update:enabled', false)
    },
    async submitTransaction() {

      if (this.method === 'update') {
        this.$emit('update-transaction', this.transaction)
      }
      if (this.method === 'insert') {
        const transactionDate = moment(
          [this.transaction.date, this.transaction.time].join(' '),
          'YYYY-MM-DD HH:MM'
        ).toISOString()
        console.log(this.transaction)
        console.log(transactionDate)
        try {
          const res = await this.$axios.post('/transactions', {
            title: this.transaction.title,
            description: this.transaction.description || null,
            categoryId: this.transaction.category.id,
            type: this.transaction.type,
            amount: parseFloat(this.transaction.amount),
            transactionDate,
          })
          this.resDialog.enabled = true
          this.resDialog.statusText = res.statusText
          if (res.status > 199 && res.status < 300) {
            this.resDialog.message = 'Response has succeeded'
          }
          if (res.status > 399 && res.status < 500) {
            this.resDialog.message = 'Response has failed'
            console.info(res.data)
          }
        } catch (e) {
          console.info(e);
        }
        this.$emit('insert-transaction', this.transaction)
      }
      this.closeModal()
    }
  }
}
</script>
