<template>
  <transition v-if="showEditModal" name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header justify-content-center text-center">
              <h3><b>Editar Cirurgia</b></h3>
          </div>
          <div class="modal-body">
              <form  @submit.prevent="compareEdit">
              <div class="form-group">
                <div class="row">
                <div class="col-6">
                  <label id="label_form">Nom pacient</label>
                  <input type="text" v-model="editarform.Nom" class="form-control" />
                </div>
                <div class="col-6">
                  <label id="label_form">Quiròfan</label>
                  <select v-model="editarform.Quiròfan" class="form-select form-select-sm" >
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
                </div>
                <div class="row">

                <div class="col-6">
                  <label id="label_form">Nom cirurgia</label>
                  <input type="text" v-model="editarform.Cirurgia" class="form-control" />
                </div>
                <div class="col-6">
                  <label id="label_form">Procediment</label>
                  <input type="text" v-model="editarform.Procediment" class="form-control" />
                </div>
                </div>
                  <div class="form-group"><br>
                  <button class="btn btn-danger btn-block">Editar</button>
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
      showEditModal: Boolean,
      selectedEvent: Object,
      },
      data: () => ({
    editarform: { 
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
      end: "" },
      }),
      methods:{
          close(){
            this.$emit("close");
            },
            compareEdit(){
              //es mira que les dades no estiguin buides.
              if(this.editarform.Nom == "" || this.editarform.Cirurgia == "" ||
              this.editarform.Procediment == "" || this.editarform.Quiròfan == "")
              {
                  alert("ALGUN CAMP ESTA BUIT");
              }
              else
              {
                console.log(this.selectedEvent);
                this.editarform.Num_Procediment = this.selectedEvent.Num_Procediment
                this.editarform.class = this.editarform.Quiròfan
                this.$emit("compareEdit", this.editarform);
              }
              
            }
      }
}
</script>

<style>

</style>