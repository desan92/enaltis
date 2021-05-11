<template>
    <transition v-if="showEvent" name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header justify-content-start text-start">
              <h3><b>Informació intervenció quirúrgica</b></h3>
          </div>
          <div class="modal-body" style="text-align: start !important;">
              <ul>
                  <li v-if="selectedEvent.Nom"><b>Nom Pacient:</b> {{ selectedEvent.Nom }}</li>
                  <li v-if="selectedEvent.Procediment"><b>Procediment:</b> {{ selectedEvent.Procediment }}</li>
                  <li v-if="selectedEvent.Quiròfan"><b>Quiròfan:</b> {{ selectedEvent.Quiròfan }}</li>
                  <li v-if="selectedEvent.Cirurgia"><b>Cirurgia:</b> {{ selectedEvent.Cirurgia }}</li>
                  <li v-if="selectedEvent.Data"><b>Data:</b> {{ selectedEvent.Data }}</li>
                  <li v-if="selectedEvent.Hora"><b>Hora:</b> {{ selectedEvent.Hora }}</li>
              </ul>
          </div>
          <div class="modal-footer">
              <button class="btn btn-danger mt-4" @click="deleteCal">Borrar</button>
              <button class="btn btn-success mt-4" @click="openEditModal">Editar</button>
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
      showEvent: Boolean,
      selectedEvent: Object
      },
    data: () => ({
        showEditModal: false
    }),
    methods: {
    close(){
      this.$emit("close");
    },
    deleteCal(){
      this.$emit("deleteCal", 'event-delete', this.selectedEvent)
    },
    openEditModal(){
        this.$emit("openEditModal");
    }
    }
}
</script>

<style>

</style>