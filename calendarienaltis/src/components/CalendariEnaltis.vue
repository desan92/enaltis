<template>
<div class="container-fluid">
  <div class="row">
    <div class="col">
      <ModalAfegirCirurgia :afegirEvent="afegirEvent" @close="tancaraddEvent" @handleSubmit="handleSubmit"/>
      <ModalCirurgia :showEvent="showModal" :selectedEvent="selectedEvent" @close="tancarEvent" @deleteCal="deleteCal" @openEditModal="openEditModal"/>
      <ModalEditarCirurgia :showEditModal="showEditModal" :selectedEvent="selectedEvent" @close="tancarEditEvent" @compareEdit="compareEdit"/>
      <button class="btn btn-outline-primary mb-2 float-end" @click="addEvent">Afegir Cirurgia</button>
      <button class="btn btn-outline-primary mb-2 me-2 float-end" @click="customEventCreation">Bloquejar dia</button>
    </div>
  </div>
  <div class="row">
      <div class="col-md-3">
        <select v-model="quirofan" class="form-select form-select-sm">
            <option value="ALL" selected>Tots els quiròfans</option>
            <option value="Q1">Quiròfan 1</option>
            <option value="Q3">Quiròfan 3</option>
            <option value="Q4">Quiròfan 4</option>
            <option value="Q5">Quiròfan 5</option>
            <option value="Q6">Quiròfan 6</option>
            <option value="Q7">Quiròfan 7</option>
            <option value="Q8">Quiròfan 8</option>
            <option value="Q11">Quiròfan 11</option>
          </select>
          <button class="btn mt-4 mb-3" id="btn" @click="selectQuirofan(quirofan)">Veure Quiròfan</button>
          <div class="external-event"
              v-for="(item, i) in draggables"
              :key="i"
              @dragover="onDragOver($event)"
              @drag="onEventDrop($event, event, external)"
              draggable="true"
              @dragstart="onEventDragStart($event, item)">
              <strong>{{ item.Nom }}</strong>
              ({{ item.duration ? `${item.duration} min` : 'no duration' }})
            <div>{{ item.Procediment }}</div>
          </div>
          <select class="form-select form-select-sm mt-3" v-model="draggableSelect" v-if="draggables.length">
            <option v-for="(item, i) in draggables"
            :key="i" :value="item.Num_Procediment">{{ item.Nom }}</option>
          </select>
          <button class="btn mt-4 mb-3" id="btn" v-if="draggables.length" @click="borrarElementDraggable(draggableSelect)">Borrar</button>
      </div>
      <div class="col-md-9">
  <vue-cal
         today-button
         :time-from="7 * 60"
         :time-to="23 * 60"
         :disable-views="['years', 'year']"
         hide-weekends
         locale = "ca"
         :snap-to-time="15"
         :editable-events="{ title: false, drag: true, resize: true, delete: true, create: false }"
         :events="events"
         @event-change="change"
         @event-delete="deleteCal('event-delete', $event)"
         @event-drop="onEventDrop"
         :special-hours="specialHours"
         :disableDays= disabledday
         :on-event-click="onEventClick"
         class="vuecal--full-height-delete"><template v-slot:event="{ event }">
    <span class="vuecal__event-title"
         @blur="event.Nom = $event.target.innerHTML"
         v-html="event.Nom" />
    <div>
  </div>
  </template>
</vue-cal>
      </div>
  </div>
</div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import 'vue-cal/dist/drag-and-drop.js'
import 'vue-cal/dist/i18n/ca.js'
import axios from 'axios'
import ModalAfegirCirurgia from './ModalAfegirCirurgia.vue'
import ModalCirurgia from './ModalCirurgia'
import ModalEditarCirurgia from './ModalEditarCirurgia'

export default {
components: { VueCal, ModalAfegirCirurgia, ModalCirurgia, ModalEditarCirurgia },
data: () => ({
    afegirEvent: false,
    draggableSelect: "",
    showModal: false,
    showEditModal: false,
    changeEvent: true,
    quirofan: "ALL",
    selectedEvent: {},
    originalEvent: {},
    aux_events: [],
    events: [],
    draggables: [],
    specialHours: {
      5: [{ from: 9 * 60, to: 12 * 60, class: 'business-hours', id: 'business-hours'}]
    },
    test:{ from: '2021-04-23 9:00', to: '2021-04-23 12:00'}, 
    disabledday: ["2021-05-05"],
}),
methods: {
  //metode que carrega el json que conte les dades del draggable.
    dadesCirurgiesDraggables(){
        axios.get("api/drag.json")
        .then(res=>{
            this.draggables = res.data 
            //console.log(this.draggables);

        })
    },
    //metode que carrega el json amb les dades dels events.
    dadesCirurgiesEvents(){
        axios.get("api/event.json")
        .then(res=>{
            this.events = res.data 
            //console.log(this.events);
            this.aux_events = this.events;
        })
    },
    onEventDragStart(e, draggable) {
      // Passing the event's data to Vue Cal through the DataTransfer object
      e.dataTransfer.setData('event', JSON.stringify(draggable))
      e.dataTransfer.setData('cursor-grab-at', e.offsetY)
    },
    // The 3 parameters are destructured from the passed $event in @event-drop="onEventDrop".
    // `event` is the final event as Vue Cal understands it.
    // `originalEvent` is the event that was dragged into Vue Cal, it can come from the same
    //  Vue Cal instance, another one, or an external source.
    // `external` is a boolean that lets you know if the event is not coming from any Vue Cal.
    onEventDrop({ event, originalEvent, external }){
      // If the event is external, delete it from the data source on drop into Vue Cal.
      // If the event comes from another Vue Cal instance, it will be deleted automatically in there.
        if(external)
        {
          var date_start = new Date(this.test.from)
          var date_end = new Date(this.test.to)
          console.log("external");
          //es mira que les dades de start i end no es trobin entre les dades de l'horari bloquejat.
          if((date_start <= event.start && event.start <= date_end) ||(date_start <= event.end && event.end <= date_end))
          {
            const extEventToDeletePos = this.draggables.findIndex(item => item.Num_Procediment === originalEvent.Num_Procediment)

            if(extEventToDeletePos > -1) 
            {
              this.draggables.splice(extEventToDeletePos, 1);
              //console.log(event);
              this.aux_events.push(event);
              //console.log(this.events);
              for(var i = 0; i < this.aux_events.length; i++)
              {
                if(event.Num_Procediment == this.aux_events[i].Num_Procediment)
                {
                  this.aux_events.splice(i, 1)
                }
              }
              this.draggables.push(event);
            }
          }
          else 
          {
            //si no es troben al segment bloquejat es treu l'element de draggables i es posa al array de events.
            const extEventToDeletePos = this.draggables.findIndex(item => item.Num_Procediment === originalEvent.Num_Procediment)

            if(extEventToDeletePos > -1) 
            {
              this.draggables.splice(extEventToDeletePos, 1);
              //console.log(event);
              this.aux_events.push(event);
              console.log(this.events);
            }
          }
          
        }
        else if(originalEvent != undefined)
        {
          //es comprova que hi ha un originalevent, que hi ha existia un dins al calendari
          var object_event = originalEvent;
          console.log(object_event)
          console.log("internal");
          date_start = new Date(this.test.from);
          date_end = new Date(this.test.to);

          //si existia i es troba dins d'aquest horari bloquejat es pasa la variable chengeEvent a false.
          //es comprava tambe a change() i a afegirCirurgia()
          if((date_start <= event.start && event.start <= date_end) ||(date_start <= event.end && event.end <= date_end))
          {
            //console.log(event.start);
            this.changeEvent = false
          }
          else{
            console.log("ok")
          }
        }

    },
    onDragOver(ev) {
      ev.preventDefault();
    },
    change({ event, originalEvent }){
      //si change event es true es pasaran s'afegiran les dades d'hora i data i durada
      if(this.changeEvent)
      {
          if(event)
          {
            console.log("change")
            for(var i = 0; i < this.events.length; i++)
            {
                if(event.Num_Procediment == this.events[i].Num_Procediment)
                {
                  this.events[i].start = event.start
                  this.events[i].end = event.end

                  var day_start = this.events[i].start.format('DD/MM/YYYY');
                  this.events[i].Data = day_start

                  var hour = this.events[i].start.formatTime('HH:mm');
                  this.events[i].Hora = hour

                  var durada = Math.abs(this.events[i].end - this.events[i].start);
                  durada = Math.floor((durada/1000)/60);
                  this.events[i].duration = durada;
                }
            }
          }
      }
      else
      {
        //en cas de ser negatiu vol dir que s'ha intentat posar al segment bloquejat per tant, 
        //es borra  i es posa a draggables.
          var object_event = originalEvent;
          for(var j = 0; j < this.aux_events.length; j++)
          {
            if(event.Num_Procediment == this.aux_events[j].Num_Procediment)
            {
              this.aux_events.splice(j, 1)
              this.events.splice(j, 1)
              console.log(object_event)
              this.draggables.push(object_event);
              this.selectQuirofan(this.quirofan)
            }
          }
          this.changeEvent = true;
      }
      
    },
    deleteCal(e, event){
      console.log(e);
      console.log(event);

      //es busca al array l'element a borrar i es borra d'events i es pasa a draggables.
      for(var i = 0; i < this.events.length; i++)
      {
        if(event.Num_Procediment == this.events[i].Num_Procediment)
        {
          this.events.splice(i, 1)
        }
      }
      this.draggables.push(event);
      this.showModal = false;

    },
    customEventCreation() {
      //aquest metode serveix per bloquejar un dia senser.
      const dateTime = prompt('Create event on (YYYY-MM-DD)', '2021-05-06')
      if(/^\d{4}-\d{2}-\d{2}$/.test(dateTime)) 
      {
        this.disabledday.push(dateTime);
      } 
      else if(dateTime)
      {
        alert('Error en el format de la data.')
      }
    },
    borrarElementDraggable(drag) {
      //en cas de que un element ja no vulguen que es trobi a draggables es busca amb el for
      // i es borra del array draggables.
      for(var i = 0; i < this.draggables.length; i++)
      {
        if(drag == this.draggables[i].Num_Procediment)
        {
          this.draggables.splice(i, 1)
        }
      }

    },
    onEventClick (event, e) {
      //metode que obra el modal de informacio de cirurgia
        this.selectedEvent = event
        this.showModal = true

        // Prevent navigating to narrower view (default vue-cal behavior).
        e.stopPropagation()
    },
    tancarEvent(){
      //tanca el modal de informacio de cirurgia.
      this.showModal = false
    },
    selectQuirofan(quirofan){
      //inicialment es mostrara tot el contingut que hi ha al calendari
      //si es vol veure per quirofans es fara un for que seleccionara per quirofan 
      //els elements a veure.
      this.events = []

      if(quirofan != "ALL")
      {
        for(var i = 0; i < this.aux_events.length; i++)
        {
          if(quirofan == this.aux_events[i].Quiròfan)
          {
              this.events.push(this.aux_events[i])
          }
        }
      }
      else
      {
        this.events = this.aux_events;
      }
    },
    addEvent(){
      //obra el modal afegir event
      this.afegirEvent= true;
    },
    tancaraddEvent(){
      //tanca el modal d'afegir event.
      this.afegirEvent= false;
    },

    handleSubmit(afegirCirurgiaForm) {

        //metode on es comprva que el contingut que hi ha al modal d'afegir cirurgia
        //no esta buit. si esta buit algun camp es mostra un alert en cas contrari s'envia a afegirCirurgia()
        if(afegirCirurgiaForm.Num_procediment == "" || afegirCirurgiaForm.Nom == "" ||
        afegirCirurgiaForm.Quiròfan == "" || afegirCirurgiaForm.Cirurgia == "" ||
        afegirCirurgiaForm.NHC == "" || afegirCirurgiaForm.Procediment == "" ||
        afegirCirurgiaForm.start == "" || afegirCirurgiaForm.end == "" )
        {
          alert("ALGUN CAMP ESTA BUIT");
        }
        else
        {
          //alert("SUCCESS!" + JSON.stringify(afegirCirurgiaForm));
          this.afegirCirurgia(afegirCirurgiaForm);
        }

        
    },
    afegirCirurgia(afegirCirurgiaForm){
      
      //metode per afegir les dades de la nova cirurgia al calendari aixi com afegir alguns
      //camps que estan buits.
      afegirCirurgiaForm.class = afegirCirurgiaForm.Quiròfan;

      var index_end = afegirCirurgiaForm.end.indexOf(':');
      var hora_end = afegirCirurgiaForm.end.substr(0, index_end);
      var minuts_end = afegirCirurgiaForm.end.substr(index_end +1);

      var d_start = new Date(afegirCirurgiaForm.start);
      afegirCirurgiaForm.start = d_start;
      var d_end = new Date(afegirCirurgiaForm.start);
      d_end.setHours(hora_end)
      d_end.setMinutes(minuts_end);
      afegirCirurgiaForm.end = d_end;

      //calcula la durada a partir de start i end 
      var durada = Math.abs(afegirCirurgiaForm.end - afegirCirurgiaForm.start);
      durada = Math.floor((durada/1000)/60);
      afegirCirurgiaForm.duration = durada;

      var day_start = afegirCirurgiaForm.start.format('DD/MM/YYYY');
      afegirCirurgiaForm.Data = day_start

      var hour = afegirCirurgiaForm.start.formatTime('HH:mm');
      afegirCirurgiaForm.Hora = hour

      var date_start = new Date(this.test.from);
      var date_end = new Date(this.test.to);

      //en cas de posar-se al horari bloquejat es mostrara un missatge que no es correcte.
      if(!(date_start <= afegirCirurgiaForm.start && afegirCirurgiaForm.start <= date_end) || !(date_start <= afegirCirurgiaForm.end && afegirCirurgiaForm.end <= date_end))
      {
        this.aux_events.push(afegirCirurgiaForm);
        this.afegirEvent= false;
        alert("SUCCESS!");
      }
      else
      {
        alert("Horari bloquejat!!")
        this.afegirEvent= false;
      }
    },
    openEditModal(){
      //metode per obrir el modal de modificar cirurgia
      this.showModal = false;
      this.showEditModal = true;
    },
    tancarEditEvent(){
      //metode per tancar el modal de modificar cirurgia.
      this.showEditModal = false
    },
    compareEdit(editarform){
      //metode per fer els canvis a cirurgia ....
      console.log(editarform);
    }
  },
  mounted(){
      this.dadesCirurgiesEvents()
      this.dadesCirurgiesDraggables()
      this.$emit('selectedEvent', this.selectedEvent);

  }
}
</script>
  
<style>
.external-event{
  background-color: rgba(178, 228, 235, 0.7);
  border: 1px solid #68B5C7;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 525px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #68B5C7;
  text-align: center;
}

#label_form{
  color: #68B5C7;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>