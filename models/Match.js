import mongoose from "mongoose";
import Teams from "../models/Teams.js";


const matchsSchema = new mongoose.Schema({
    duration: {type: Number, required: true},
    times: {type: Number, required: true},
    teams: {
      team1: {type: String, required: true},
      team2: {type: String, required: true},
    },
    scoreboard: {
      team1Goals: {type: Number, required: true, default: 0},
      team2Goals: {type: Number, required: true, default: 0},
      totals: {type: String, required: true, default: 0 }
    },  
    winner: {type: String, default: 'null', required: true},
    defeated: {type: String, default: 'null', required: true},
    draw: {type: Boolean, default: false, required: true},
    finished: {type: Boolean, default: false, required: true},
})

const matchsModel = mongoose.model('Matchs', matchsSchema)


//Service
class Matchs {

    async create(duration, times, teams){
  
        const status = await this.validate(duration,times,teams)
        
        if(status.status){
          try {
            const t1 = await Teams.searchTeamByName(teams[0])
            const t2 = await  Teams.searchTeamByName(teams[1])
              if(!t1){
                return {msg: "Esse time não existe na base de dados"}
              }
              if(!t2){
                return {msg: "Esse time não existe na base de dados"}
              }
                const Match = await matchsModel.create({duration: duration, times: times, teams: {team1: teams[0], team2: teams[1]}})
                return Match
          } catch (error) {
            console.log(error)
            return {msg: 'Erro desconhecido'}
          }
        }
        return status.msg
        
    }

    async matchResult(id,winner,defeated,draw,scoreboard){
      let error = false
      try {
        const Result = await this.searchMatch(id)
        const finalScore = String(scoreboard[0]) + 'x' + String(scoreboard[1])

        

          if(winner !== Result.teams.team1 && winner !== Result.teams.team2){
            error = true;
          }
     
          if(defeated !== Result.teams.team1 && defeated !== Result.teams.team2){
            error = true
          }

          if(error){
            return {msg: 'Os times selecionados não coincidem com os da partida'}
          }

          if(draw){
            const result = await matchsModel.findByIdAndUpdate(id, {draw: true, finished: true, scoreboard: {team1Goals: scoreboard[0], team2Goals: scoreboard[1], totals: finalScore}}, {new: true})
            Teams.updateStats(Result.id);
            return result
          }

          Teams.updateStats(Result.id);
        
          const ResultMatch = await matchsModel.findByIdAndUpdate(id, {winner: winner, defeated: defeated, scoreboard: {team1Goals: scoreboard[0], team2Goals: scoreboard[1], totals: finalScore}, finished: true}, {new: true})
          return ResultMatch
      } catch (error) {
        console.log(error)
        return {msg: "Erro desconhecido"}
      }
      
    }

    async searchMatch(id){
      try {
        const Match = await matchsModel.findById(id)
        return Match
      } catch (error) {
        console.log(error)
        return {msg: "Erro desconhecido"}
      }
    }


    async validate(duration, times, teams){
      if(!duration || !times){
        return {error: true, msg: "dados invalidos"}
      }

      if(teams[0] === '' || teams[1] === ''){
        return {error: true, msg: "Times não selecionado"}
      }

      if(!isNaN(teams[0]) || !isNaN(teams[1]) ){
        return {error: true, msg: "Times inválido"}
      }
      
      return {status:true}
    }

  }

export default new Matchs()