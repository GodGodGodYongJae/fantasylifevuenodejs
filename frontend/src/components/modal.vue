<template>
  <div>
    <b-modal id="modal-1" title="Charater Create" @ok="handleok">
      <p class="my-4">Create Charater</p>
      <b-form-select class="teest" v-model="selected">
        <option v-for="user in options" :value="user.pid">
          {{ user.name }}
        </option>
      </b-form-select>
      <p>{{ selected }}</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "okok-modal",
  props: ["src"],
  created() {
    this.$http.post("/api/users/showplayer").then((response) => {
      this.options = response.data;
      // console.log(this.options);
    });
  },
  data() {
    return {
      selected: "",
      options: [],
    };
  },
  methods: {
    handleok() {
      this.$emit("CreatePlayer", this.selected);
    },
  },
};
</script>
<style scoped>
.teest {
  width: 100%;
  border-radius: 10px;
  font-size: 18px;
}
</style>