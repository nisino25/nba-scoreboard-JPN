<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">

  <div class="menu-tool">
    <!-- <i class="fa fa-gear fa-spin" style="font-size:24px; cursor:pointer;"></i> -->
    <!-- <span style="">Showing Score</span> -->

    <div class="mid" >
      <label class="rocker" @click="showingScore = !showingScore">
        <input type="checkbox" unchecked>
        <span class="switch-left" @click="showingScore = !showingScore">On</span>
        <span class="switch-right" @click="showingScore = !showingScore">Off</span>
      </label>
    </div>

    
   



  </div>

    
  
  

  <div class="view-counter" style="left:0;margin-left: 50px">
    <i class="far fa-eye" id="togglePassword" style="margin-right: 7.5px; cursor: pointer;"></i>
    <vue3-autocounter class="counter" ref='counter' :startAmount='0'  suffix=' Views' :endAmount="userNum" :duration='1.5'  separator=',' :autoinit='true' />
  </div>
  
  <div style="text-align:center; display:flex; margin-bottom:1rem; margin-top:0.5rem;">
    <input type="date" v-model="beforeEdit" style="margin-left:5%;">
  </div>

  
    
  <br>
  <div style="text-align:center" class='select-date'>
    <button @click="getScores('twoDaysAgo')">{{twoDaysAgoDate}}</button>
    <button @click="getScores('yesterday')">{{ yesterdayDate }}</button> 
    <button @click="getScores('today')">{{todaysDate}}</button>
    <button @click="getScores('tomorrow')">{{tomorrowsDate}}</button>
    <button @click="getScores('afterTomorrow')">{{afterTomorrowsDate}}</button>
    

  </div>
  
  
  <br>


  <div v-if="gameData && !(isFetchingData) && !(hasFailed) && showingScore">
    <div style="text-align:center">Showing {{showingDate}} result  </div><br>
    <div v-for="(game, i) in gameData.games" :key="i" style="text-align:center">
      <img :src="game.hTeam.linkName" alt="" class="teamLogo">
      <strong>{{game.hTeam.triCode}}</strong>&nbsp; &nbsp;
      <small>{{game.hTeam.score}}</small>&nbsp;

      &nbsp;<small :style="game.colorOfTheString">{{game.gameStatus}}</small>&nbsp;
      &nbsp;<small :style="game.colorOfTheString">{{game.mustWatch}}</small>&nbsp;

      &nbsp;<small>{{game.vTeam.score}}</small>&nbsp;&nbsp; &nbsp; 
      <img :src="game.vTeam.linkName" alt="" class="teamLogo">
      <strong>{{game.vTeam.triCode}}</strong>&nbsp; 
      
      <hr>
      

    </div>

    
  </div>

  <div v-if="gameData && !(isFetchingData) && !(hasFailed) && !showingScore">
    <div style="text-align:center">Shwoing {{showingDate}} result  </div><br>
    <div v-for="(game, i) in gameData.games" :key="i" style="text-align:center">
      <img :src="game.hTeam.linkName" alt="" class="teamLogo">
      <strong>{{game.hTeam.triCode}}</strong>&nbsp; &nbsp;
      <!-- <small>{{game.hTeam.score}}</small>&nbsp; -->

      &nbsp;<small :style="game.colorOfTheString">{{game.gameStatus}}</small>&nbsp;
      &nbsp;<small :style="game.colorOfTheString">{{game.mustWatch}}</small>&nbsp;

      <!-- &nbsp;<small>{{game.vTeam.score}}</small>&nbsp;&nbsp; &nbsp;  -->
      <img :src="game.vTeam.linkName" alt="" class="teamLogo">
      <strong>{{game.vTeam.triCode}}</strong>&nbsp; 
      
      <hr>
      

    </div>

    
  </div>
  <div v-if="gameData &&gameData.games.length === 0 && !(isFetchingData)"><br><br><br> No Games</div>
  <div v-if="isFetchingData" style="text-align:center">
    <br><br><br>
    <strong>Loading.....</strong>
  </div>
  <div v-if="hasFailed && !(isFetchingData)" style="text-align:center"><br><br><br>
    Sorry the latest data you can get is 20141118
  </div>
  
  
</template>

<script>

// import Vue from 'vue'
// import ToggleButton from 'vue-js-toggle-button'
 
// Vue.use(ToggleButton)
import Vue3autocounter from 'vue3-autocounter';
import db from "./firebase.js"


export default {
  // components:{
  //   ToggleButton,
  // },
  

  name: 'App',
  components: {
    'vue3-autocounter': Vue3autocounter
  },
  data(){
    return{
      showingScore: false,



      searchDate: undefined,
      isFetchingData: false,
      gameData: undefined,
      displayDate: undefined,
      beforeEdit: undefined,
      showingDate: undefined,

      weekDay: ('Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'),
      autoRefresh: false,


      todaysDate: (new Date()).getMonth()+1 + '-' + (new Date()).getDate() ,
      yesterdayDate: (new Date(new Date().setDate(new Date().getDate() - 1))).getMonth()+1 + '-' + (new Date(new Date().setDate(new Date().getDate() - 1))).getDate(), 
      twoDaysAgoDate: (new Date(new Date().setDate(new Date().getDate() - 2))).getMonth()+1 + '-' + (new Date(new Date().setDate(new Date().getDate() - 2))).getDate(),

      tomorrowsDate: (new Date(new Date().setDate(new Date().getDate() +1))).getMonth()+1 + '-' + (new Date(new Date().setDate(new Date().getDate() +1))).getDate(),
      afterTomorrowsDate: (new Date(new Date().setDate(new Date().getDate() +2))).getMonth()+1 + '-' + (new Date(new Date().setDate(new Date().getDate() +2))).getDate(),





      updateCount:0,




      hasFailed: false,

      fireData:[],
      userNum: 0,





    }
  },
  methods:{
    async getScores(selectedDate) {
      this.autoRefresh = false

      switch(selectedDate){
        case 'twoDaysAgo':

          this.showingDate = this.twoDaysAgoDate

          var today = new Date()
          var yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 2)
          var y = yesterday.getFullYear();
          var m = yesterday.getMonth() + 1;
          var d = yesterday.getDate();
          var mm = m < 10 ? '0' + m : m;
          var dd = d < 10 ? '0' + d : d;
          this.searchDate  = '' + y + mm + dd
          break;

        case 'yesterday':
          this.autoRefresh = true;

          this.showingDate = this.yesterdayDate

          today = new Date()
          yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          y = yesterday.getFullYear();
          m = yesterday.getMonth() + 1;
          d = yesterday.getDate();
          mm = m < 10 ? '0' + m : m;
          dd = d < 10 ? '0' + d : d;
          this.searchDate  = '' + y + mm + dd

          break;

        case 'today':

          this.showingDate = this.todaysDate

          var now = new Date();
          y = now.getFullYear();
          m = now.getMonth() + 1;
          d = now.getDate();
          mm = m < 10 ? '0' + m : m;
          dd = d < 10 ? '0' + d : d;
          this.searchDate  = '' + y + mm + dd
          break;

        case 'tomorrow':

          this.showingDate = this.tomorrowsDate

          today = new Date()
          var tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)
          y = tomorrow.getFullYear();
          m = tomorrow.getMonth() + 1;
          d = tomorrow.getDate();
          mm = m < 10 ? '0' + m : m;
          dd = d < 10 ? '0' + d : d;
          this.searchDate  = '' + y + mm + dd
          break;

         case 'afterTomorrow':

          this.showingDate = this.afterTomorrowsDate
          today = new Date()
          tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 2)
          y = tomorrow.getFullYear();
          m = tomorrow.getMonth() + 1;
          d = tomorrow.getDate();
          mm = m < 10 ? '0' + m : m;
          dd = d < 10 ? '0' + d : d;
          this.searchDate  = '' + y + mm + dd
          break;

        case 'special':
          this.showingDate = this.beforeEdit
          this.searchDate = this.beforeEdit.replace('-', '');
          this.searchDate = this.searchDate.replace('-', '');
        
        
      }
      this.isFetchingData = true


      const URL = 'https://data.nba.net/10s/prod/v1/'+ this.searchDate + '/scoreboard.json'


      const res = await fetch(URL)
      const json = await res.json()
      console.log(json)
      if(json.Message !== 'Object not found.'){
        this.hasFailed = false
        this.gameData = json 
        this.isFetchingData = false

        let i =0
        let gameHour = undefined
        let gameMinute = undefined
        let theString = undefined

        // let beforeCal = undefined;
        // let pureTime = undefined
        // let afterCal = undefined;
        // let editedString = undefined;
        // let getAMPMString = undefined;
        // console.log('------------')

        

        while(i < this.gameData.games.length){
          this.gameData.games[i].colorOfTheString = "color: black"
          if(this.gameData.games[i].period.current === 0){
            // Before the tipoff
            theString = this.gameData.games[i].startTimeUTC


            this.gameData.games[i].colorOfTheString === 'black'

            gameHour = theString.split('T')[1] 
            gameHour = gameHour.split(':')[0] 
            gameHour = Number(gameHour) + 9
            if(gameHour > 24){
              gameHour =  gameHour - 24
            }

            gameMinute = this.gameData.games[i].startTimeUTC.split('T')[1] 
            gameMinute = gameMinute.split(':')[1]

            this.gameData.games[i].gameStatus = gameHour + ':' +  gameMinute + ' JPN'
            // this.gameData.games[i].gameStatus = gameMinute

          }
          
          
          // after tip off 
          else if(this.gameData.games[i].period.isHalftime){
            this.gameData.games[i].colorOfTheString = 'color: red'
            this.gameData.games[i].gameStatus = 'Half Time'
            
          }else if(this.gameData.games[i].period.current >=1 && this.gameData.games[i].period.current <=4 && this.gameData.games[i].isGameActivated && !this.gameData.games[i].period.isEndOfPeriod){
            this.gameData.games[i].colorOfTheString = 'color: red'
            this.gameData.games[i].gameStatus = this.gameData.games[i].period.current + 'Q  ' + this.gameData.games[i].clock

          }else if(this.gameData.games[i].period.current >=1 && this.gameData.games[i].period.current <=3 && this.gameData.games[i].period.isEndOfPeriod){
             this.gameData.games[i].colorOfTheString = 'color: red'
            this.gameData.games[i].gameStatus = 'End of ' + this.gameData.games[i].period.current + 'Q ' 

          }else if(this.gameData.games[i].isGameActivated && this.gameData.games[i].period.current >= 4){
             this.gameData.games[i].colorOfTheString = 'color: red'
            this.gameData.games[i].gameStatus = String(this.gameData.games[i].period.current -4) + 'OT' + this.gameData.games[i].clock

          }else if(!this.gameData.games[i].isGameActivated && this.gameData.games[i].period.current === 4){
            this.gameData.games[i].colorOfTheString = 'color: red'
            this.gameData.games[i].gameStatus = 'Final'

          }else if(!this.gameData.games[i].isGameActivated && this.gameData.games[i].period.current > 4){
            this.gameData.games[i].colorOfTheString = 'color: red'
            this.gameData.games[i].gameStatus = String(this.gameData.games[i].period.current -4) + ' OT Final'

          }else{
            // console.log('missed')
          }

          // call function if it is true or not
          // this.checkuMustWatch(this.gameData.games[i].hTeam.score, this.gameData.games[i].vTeam.score)
          if(this.gameData.games[i].period.current === 0){
            this.gameData.games[i].mustWatch = ''
          }else{
            this.gameData.games[i].mustWatch = this.checkuMustWatch(this.gameData.games[i].hTeam.score, this.gameData.games[i].vTeam.score)

          }

          
          
          switch(this.gameData.games[i].hTeam.triCode){
            case 'NOP':
              this.gameData.games[i].hTeam.linkName = 'https://sportsfly.cbsistatic.com/fly-152/bundles/sportsmediacss/images/team-logos/nba/alt/NO.svg';
              break;

            case 'GSW':
              this.gameData.games[i].hTeam.linkName = 'https://sportsfly.cbsistatic.com/fly-152/bundles/sportsmediacss/images/team-logos/nba/alt/GS.svg';
              break;
            
            case 'PHX':
              this.gameData.games[i].hTeam.linkName = 'https://sportsfly.cbsistatic.com/fly-152/bundles/sportsmediacss/images/team-logos/nba/alt/PHO.svg';
              break;

            case 'NYK':
              this.gameData.games[i].hTeam.linkName = 'https://sportsfly.cbsistatic.com/fly-152/bundles/sportsmediacss/images/team-logos/nba/alt/NY.svg';
              break;

            case 'SAS':
              this.gameData.games[i].hTeam.linkName = 'https://sportsfly.cbsistatic.com/fly-152/bundles/sportsmediacss/images/team-logos/nba/alt/SA.svg';
              break;
            default:
              this.gameData.games[i].hTeam.linkName = `https://sportsfly.cbsistatic.com/fly-152/bundles/sportsmediacss/images/team-logos/nba/alt/` + this.gameData.games[i].hTeam.triCode + `.svg`
              break;
          }

          switch(this.gameData.games[i].vTeam.triCode){
            case 'NOP':
              this.gameData.games[i].vTeam.linkName = 'https://sportsfly.cbsistatic.com/fly-152/bundles/sportsmediacss/images/team-logos/nba/alt/NO.svg';
              break;

            case 'GSW':
              this.gameData.games[i].vTeam.linkName = 'https://sportsfly.cbsistatic.com/fly-152/bundles/sportsmediacss/images/team-logos/nba/alt/GS.svg';
              break;
            
            case 'PHX':
              this.gameData.games[i].vTeam.linkName = 'https://sportsfly.cbsistatic.com/fly-152/bundles/sportsmediacss/images/team-logos/nba/alt/PHO.svg';
              break;

            case 'NYK':
              this.gameData.games[i].vTeam.linkName = 'https://sportsfly.cbsistatic.com/fly-152/bundles/sportsmediacss/images/team-logos/nba/alt/NY.svg';
              break;

            case 'SAS':
              this.gameData.games[i].vTeam.linkName = 'https://sportsfly.cbsistatic.com/fly-152/bundles/sportsmediacss/images/team-logos/nba/alt/SA.svg';
              break;
            default:
              this.gameData.games[i].vTeam.linkName = `https://sportsfly.cbsistatic.com/fly-152/bundles/sportsmediacss/images/team-logos/nba/alt/` + this.gameData.games[i].vTeam.triCode + `.svg`
              break;
          }

          i++
        }

        // console.log(this.gameData.games)
      }else{
        this.hasFailed = true
        this.isFetchingData = false;
      }

    
     
      // console.log(this.gameData.games.length)
      
    },
    checkUpdate(){
      if(this.autoRefresh){
        this.getScores('yesterday')
        console.log(`Update ${this.updateCount}`)
      }else{
        console.log('no need to update')
      }

    },

    checkuMustWatch(score1, score2){
      if((score1 - score2 < 10 && score1 - score2 >  -10)  ){
        return 'Hot!'
      }else{
        return ''
      }
    },
  },

  created() {
    this.interval = setInterval(() => this.checkUpdate(), 30000); 
    
    db.collection("nba-jpn-scoreboard")
     .get()
     .then((querySnapshot) => {
       querySnapshot.forEach((doc) => {
         console.log(`${doc.id} => ${doc.data().TotalNum}`)
         this.fireData.push(doc.data().TotalNum)
         this.userNum = doc.data().TotalNum + 1

       })
     })
  },

  mounted(){
    if(new Date().getHours() >= 20){
      this.getScores('today')
    }else if(new Date().getHours() <= 4){
      this.getScores('yesterday')
    }else{
      this.getScores('yesterday')
    }


    // console.log(Date())
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var mm = m < 10 ? '0' + m : m;
    var dd = d < 10 ? '0' + d : d;
    this.searchDate  = '' + y + mm + dd

 
    // this.getScores()
    // console.log(offset);


   
    // this.searchDate = '20210215'
  },
  watch:{
    beforeEdit: function(){
      this.getScores('special')
      console.log(this.beforeEdit)
    },
    userNum(){
      console.log('just ogt data')
        const ref = db.collection('nba-jpn-scoreboard')
        ref.doc('Fy07iVqDzbObMgipvsBL').update({
          TotalNum: this.userNum
          // TotalNum: 200 
        })
      console.log('Sent data now')
    },
  },

}
</script>

<style>
.teamLogo{
  height: 23px;
  width: auto;
  margin-right: 6px;
  margin-top: 2px;
}

.select-date button{
  margin-left:3%;
}


.mid {
  display: flex;
  margin-top:-1rem;
  /* align-items: center; */
  /* justify-content: center; */
  /* padding-top:-0.5em; */
  /* padding-bottom: 1em; */
  float:right

}


/* Switch starts here */
.rocker {
  display: inline-block;
  position: relative;
  /*
  SIZE OF SWITCH
  ==============
  All sizes are in em - therefore
  changing the font-size here
  will change the size of the switch.
  See .rocker-small below as example.
  */
  font-size: 0.8em;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  color: #888;
  width: 7em;
  height: 4em;
  overflow: hidden;
  border-bottom: 0.5em solid #eee;
}

.rocker::before {
  content: "";
  position: absolute;
  top: 0.5em;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #999;
  border: 0.5em solid #eee;
  border-bottom: 0;
}

.rocker input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-left,
.switch-right {
  cursor: pointer;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5em;
  width: 3em;
  transition: 0.2s;
}

.switch-left {
  height: 2.4em;
  width: 2.75em;
  left: 0.85em;
  bottom: 0.4em;
  background-color: #ddd;
  transform: rotate(15deg) skewX(15deg);
}

.switch-right {
  right: 0.5em;
  bottom: 0;
  background-color: #bd5757;
  color: #fff;
}

.switch-left::before,
.switch-right::before {
  content: "";
  position: absolute;
  width: 0.4em;
  height: 2.45em;
  bottom: -0.45em;
  background-color: #ccc;
  transform: skewY(-65deg);
}

.switch-left::before {
  left: -0.4em;
}

.switch-right::before {
  right: -0.375em;
  background-color: transparent;
  transform: skewY(65deg);
}

input:checked + .switch-left {
  background-color: #0084d0;
  color: #fff;
  bottom: 0px;
  left: 0.5em;
  height: 2.5em;
  width: 3em;
  transform: rotate(0deg) skewX(0deg);
}

input:checked + .switch-left::before {
  background-color: transparent;
  width: 3.0833em;
}

input:checked + .switch-left + .switch-right {
  background-color: #ddd;
  color: #888;
  bottom: 0.4em;
  right: 0.8em;
  height: 2.4em;
  width: 2.75em;
  transform: rotate(-15deg) skewX(-15deg);
}

input:checked + .switch-left + .switch-right::before {
  background-color: #ccc;
}

/* Keyboard Users */
input:focus + .switch-left {
  color: #333;
}

input:checked:focus + .switch-left {
  color: #fff;
}

input:focus + .switch-left + .switch-right {
  color: #fff;
}

input:checked:focus + .switch-left + .switch-right {
  color: #333;
}


</style>
