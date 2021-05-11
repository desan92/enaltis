<template>
      <transition v-if="afegirEvent" name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header justify-content-center text-center">
              <h3><b>Afegir Cirurgia</b></h3>
          </div>
          <div class="modal-body">
            <form  @submit.prevent="handleSubmit">
              <div class="form-group">
                <div class="row">
                  <div class="col-6">
                  <label id="label_form">Numero procediment</label>
                  <input type="text" v-model="afegirCirurgiaForm.Num_Procediment" class="form-control" />
                </div>
                <div class="col-6">
                  <label id="label_form">Nom pacient</label>
                  <input type="text" v-model="afegirCirurgiaForm.Nom" class="form-control" />
                </div>
                </div>
                <div class="row">
                  <div class="col-6">
                  <label id="label_form">Quiròfan</label>
                  <select class="form-select form-select-sm" v-model="afegirCirurgiaForm.Quiròfan">
                    <option value="Q1">Quiròfan 1</option>
                    <option value="Q3">Quiròfan 3</option>
                    <option value="Q4">Quiròfan 4</option>
                    <option value="Q5">Quiròfan 5</option>
                    <option value="Q6">Quiròfan 6</option>
                    <option value="Q7">Quiròfan 7</option>
                    <option value="Q8">Quiròfan 8</option>
                    <option value="Q11">Quiròfan 11</option>
                  </select>
                </div>
                <div class="col-6">
                  <label id="label_form">Nom cirurgia</label>
                  <input type="text" v-model="afegirCirurgiaForm.Cirurgia" class="form-control" />
                </div>
                </div>
                <div class="row">
                  <div class="col-6">
                  <label id="label_form">NHC</label>
                  <input type="text" v-model="afegirCirurgiaForm.NHC" class="form-control" />
                </div>
                <div class="col-6">
                  <label id="label_form">Procediment</label>
                  <input type="text" v-model="afegirCirurgiaForm.Procediment" class="form-control" />
                </div>
                </div>
                <div class="row">
                  <div class="col-6">
                  <label id="label_form">Inici intervenció</label>
                  <input class="form-control" type="datetime-local" v-model="afegirCirurgiaForm.start"  id="example-datetime-local-input-start">
                </div>
                <div class="col-6">
                  <label id="label_form">Final intervenció</label>
                  <input class="form-control" type="time" v-model="afegirCirurgiaForm.end" id="example-datetime-local-input--end">
                </div>
                </div>
                  <div class="form-group"><br>
                  <button class="btn btn-danger btn-block">Afegir</button>
              </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
              <button class="btn mt-4" id="btn" @click="close">Sortir</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
    props: {
      afegirEvent: Boolean
      },
    data: () => ({
      afegirCirurgiaForm: { 
      Num_Procediment: "",
      Nom: "",
      Data: "",
      Hora: "",
      Quiròfan: "", 
      Cirurgia: "", 
      NHC: "", 
      Procediment: "",
      duration: "",
      class: "",
      start: "",
      end: "" }
    }),
    methods: {
    close(){
      this.$emit("close");
    },
    handleSubmit(){
      this.$emit("handleSubmit", this.afegirCirurgiaForm);
      this.afegirCirurgiaForm = {}
    }
    }
}
</script>

<style>

</style>