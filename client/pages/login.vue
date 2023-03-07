<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-card>
        <v-card-title>
          <h1>Title</h1>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="email"
              label="Email"
              :error-messages="emailErrors"
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="password"
              type="password"
              label="Password"
              :error-messages="passwordErrors"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
            ></v-text-field>
            <v-btn @click="login">Submit</v-btn>
          </v-form>
          <v-btn @click="() => login(true)">Login with Google+</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { email, minLength, required } from 'vuelidate/lib/validators'
export default {
  mixins: [validationMixin],
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(8)
    }
  },
  data: () => ({
    email: '',
    password: ''
  }),
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.required && errors.push('Email is required');
      !this.$v.email.email && errors.push('Must be a valid email');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push('Password is required');
      !this.$v.password.minLength && errors.push(`Password must be ${this.$v.password.$params.minLength.min} characters long`);
      return errors;
    }
  },
  methods: {
    async login(withGoogle = false) {
      if (withGoogle) {
        await this.$auth.loginWith('google', {
          params: {
            prompt: 'select_account',
            include_granted_scope: true,
          },
        })
          .catch(e => console.log(e))
      } else {
        await this.loginLocal()
      }
    },
    async loginLocal() {
      this.$v.$touch();
      await this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password,
        },
      })
        .then(() => {
          return this.$router.push('/')
        })
        .catch(e => console.error(e))
    },
  },
}
</script>

