<template>
  <v-row justify="center">
    <v-col cols="8">
      <v-card>
        <v-card-title>
          <h2>Register</h2>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="email"
              name="email"
              label="Email"
              :error-messages="emailErrors"
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="password"
              name="password"
              type="password"
              label="Password"
              :error-messages="passwordErrors"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="passwordConfirm"
              name="passwordConfirm"
              type="password"
              label="Re-type password"
              :error-messages="passwordConfirmErrors"
              @input="$v.passwordConfirm.$touch()"
              @blur="$v.passwordConfirm.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="firstName"
              label="First name"
             :error-messages="firstNameErrors"
              @input="$v.firstName.$touch()"
              @blur="$v.firstName.$touch()"
            ></v-text-field>
            <v-btn @click.prevent="handleSubmit">submit</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email, sameAs, minLength } from 'vuelidate/lib/validators';
export default {
  mixins: [
    validationMixin,
  ],
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required
    },
    passwordConfirm: {
      required,
      sameAsPassword: sameAs('password'),
    },
    firstName: {
      required,
      minLength: minLength(5)
    }
  },
  data() {
    return {
      counter: 0,
      email: '',
      password: '',
      passwordConfirm: '',
      firstName: '',
    }
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.required && errors.push('Email is required');
      !this.$v.email.email && errors.push('Must provide a valid email');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push('Password is required');
      return errors;
    },
    passwordConfirmErrors() {
      const errors = [];
      if (!this.$v.passwordConfirm.$dirty) return errors;
      !this.$v.passwordConfirm.required && errors.push('Password confirmation is required');
      !this.$v.passwordConfirm.sameAsPassword && errors.push('Password confirmation must match the password');
      return errors;
    },
    firstNameErrors() {
      const errors = [];
      if (!this.$v.firstName.$dirty) return errors;
      !this.$v.firstName.required && errors.push('First name is required');
      !this.$v.firstName.minLength && errors.push(`First name must be at least ${this.$v.firstName.$params.minLength.min} characters long`);
      return errors;
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.$v.$touch();
        const user = await this.$axios.post('/auth', {
          email: this.email,
          password: this.password,
          firstName: this.firstName,
        })
        await this.$auth.loginWith('cookie', {
          data: user
        });
        await this.$router.push('/');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    },
    resetForm() {
      this.$v.$reset();
      this.email = '';
      this.password = '';
      this.passwordConfirm = '';
    }
  }
}
</script>
