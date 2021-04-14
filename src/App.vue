<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <div style="text-align:center; display:flex;">
    <input type="date" v-model="beforeEdit" style="margin-left:30%; margin-right:20%">
    <i class="fa fa-gear fa-spin" style="font-size:24px; cursor:pointer;"></i>
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


  <div v-if="gameData && !(isFetchingData) && !(hasFailed)">
    <div style="text-align:center">Shwoing {{showingDate}} result  </div><br>
    <div v-for="(game, i) in gameData.games" :key="i" style="text-align:center">
      <img :src="game.hTeam.linkName" alt="" class="teamLogo">
      <strong>{{game.hTeam.triCode}}</strong>&nbsp; &nbsp;
      <small>{{game.hTeam.score}}</small>&nbsp;
      &nbsp;<small :style="game.colorOfTheString">{{game.gameStatus}}</small>&nbsp;
      &nbsp;<small>{{game.vTeam.score}}</small>&nbsp;&nbsp; &nbsp; 
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

export default {
  name: 'App',
  data(){
    return{
      searchDate: undefined,
      isFetchingData: false,
      gameData: undefined,
      displayDate: undefined,
      beforeEdit: undefined,
      showingDate: undefined,

      weekDay: ('Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'),


      todaysDate: (new Date()).getMonth()+1 + '-' + (new Date()).getDate() ,
      yesterdayDate: (new Date(new Date().setDate(new Date().getDate() - 1))).getMonth()+1 + '-' + (new Date(new Date().setDate(new Date().getDate() - 1))).getDate(),
      twoDaysAgoDate: (new Date(new Date().setDate(new Date().getDate() - 2))).getMonth()+1 + '-' + (new Date(new Date().setDate(new Date().getDate() - 2))).getDate(),

      tomorrowsDate: (new Date(new Date().setDate(new Date().getDate() +1))).getMonth()+1 + '-' + (new Date(new Date().setDate(new Date().getDate() +1))).getDate(),
      afterTomorrowsDate: (new Date(new Date().setDate(new Date().getDate() +2))).getMonth()+1 + '-' + (new Date(new Date().setDate(new Date().getDate() +2))).getDate(),





      updateCount:0,




      hasFailed: false,





    }
  },
  methods:{
    async getScores(selectedDate) {

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

            // this.gameData.games[i].startTimeUTC = this.gameData.games[i].startTimeUTC.split('T')[1] 
            // this.gameData.games[i].startTimeUTC = this.gameData.games[i].startTimeUTC.split('.')[0] 

            // beforeCal = Number(this.gameData.games[i].startTimeEastern.split(':')[0]) - 3;
            // pureTime =  Number(this.gameData.games[i].startTimeEastern.split(':')[0]) ;
            // if(pureTime<=3 && pureTime >=0){
            //   afterCal = beforeCal + 12;
            //   getAMPMString = 'AM'
            //   if(beforeCal === 0){
            //     getAMPMString = 'PM'
            //     console.log('you called me ')
            //   }
            // }else if(beforeCal === 9){
            //   afterCal = beforeCal
            //   console.log('jhue')
            //   getAMPMString = 'AM'
            // }else{
            //   afterCal = beforeCal
            //   getAMPMString =this.gameData.games[i].startTimeEastern.substring(this.gameData.games[i].startTimeEastern.indexOf(" " )+ 1) 
            //   getAMPMString = getAMPMString.split(' ')[0];
            // }
            // editedString = this.gameData.games[i].startTimeEastern;
            // editedString = editedString.substring(editedString.indexOf(":" )+ 1) 
            // editedString = editedString.split(' ')[0];
            // this.gameData.games[i].startTimePST  = String(afterCal) + ':' + editedString + ' '+ getAMPMString + ' PST'

            // this.gameData.games[i].gameStatus = String(afterCal) + ':' + editedString + ' '+ getAMPMString + ' JPN'
            // this.gameData.games[i].gameStatus = this.gameData.games[i].startTimeUTC + ' JPN'
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
      let checkDate = undefined

      let now = new Date();
      let y = now.getFullYear();
      let m = now.getMonth() + 1;
      let d = now.getDate();
      let mm = m < 10 ? '0' + m : m;
      let dd = d < 10 ? '0' + d : d;
      checkDate = '' + y + mm + dd;

      if(this.searchDate === checkDate){
        this.getScores()
        this.updateCount++;
        console.log(`Update ${this.updateCount}`)
      }else{
        console.log('wrong')
      }

    }
  },

  created() {
    this.interval = setInterval(() => this.checkUpdate(), 30000);  
  },

  mounted(){
    if(new Date().getHours() >= 17){
      this.getScores()
    }else if(new Date().getHours() <= 5){
      this.getScores('twoDaysAgo')
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
    }
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

</style>
