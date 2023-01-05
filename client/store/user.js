export const state = () => ({
  id: 0,
  email: '',
  firstName: '',
});

export const mutations = {
  setFirstName({ firstName }, payload) {
    firstName = payload.firstName;
  }
}
