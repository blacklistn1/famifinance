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
              <v-text-field v-model="transaction.name" label="Tên giao dịch"></v-text-field>
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
              <v-textarea v-model="transaction.description" rows="2" label="Mô tả ngắn"></v-textarea>
            </v-col>
            <v-col cols="5">
              <v-row no-gutters>
                <v-col cols="12">
                  <v-radio-group v-model="transaction.type" row>
                    <template #label>
                      <span class="font-weight-bold">Loại giao dịch</span>
                    </template>
                    <v-radio label="Thu" value="thu"></v-radio>
                    <v-radio label="Chi" value="chi"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12">
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
                        ></v-date-picker>
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
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-row justify="center" no-gutters>
          <v-btn color="grey lighten-2" large @click="closeModal">Đóng</v-btn>
          <v-btn color="primary" large class="ml-4" @click="submitTransaction">Gửi</v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable vue/require-default-prop, vue/require-valid-default-prop */

export default {
  props: {
    enabled: Boolean,
    origTransaction: {
      type: Object,
      default: () => ({
        name: String,
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
    submitTransaction() {
      if (this.method === 'update') this.$emit('update-transaction', this.transaction)
      if (this.method === 'insert') this.$emit('insert-transaction', this.transaction)
    }
  }
}
</script>
