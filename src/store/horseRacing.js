import { createStore } from 'vuex'
import {generateHorseNames, getRandomColors, getRandomInt} from "@/helpers/horseRacingHelper.js";

const TOTAL_HORSES = 20
const TOTAL_LAPS = 6
const HORSES_PER_LAP = 10
const TICK_INTERVAL = 100


const state = {
    isRacingInProcess: false,
    racing: null,
    horseList: [],
    lapNumber: 0,
    lapsLength: {
        1: 1200,
        2: 1400,
        3: 1600,
        4: 1800,
        5: 2000,
        6: 2200,
    },
    lapProgram: [],
    lapResults: [],
}

const mutations = {
    startPauseRacing(state) {
        state.isRacingInProcess = !state.isRacingInProcess
    },
    generateRacing(state) {
        state.lapNumber = 1
        state.isRacingInProcess = false
        state.lapProgram = []
        state.lapResults = []
    },
    setHorses(state) {
        const names = generateHorseNames(TOTAL_HORSES)
        const colors = getRandomColors(TOTAL_HORSES)

        state.horseList = names.map((name, index) => ({
            horseIndex: index,
            name,
            condition: getRandomInt(1, 100),
            color: colors[index],
        }))
    },
    setLapProgram(state) {
        const laps = []
        const results = []

        for (let lap = 1; lap <= TOTAL_LAPS; lap++) {
            const shuffled = [...state.horseList].sort(() => Math.random() - 0.5)
            const selectedHorses = shuffled.slice(0, HORSES_PER_LAP)

            const lapData = {
                lapNumber: lap,
                horses: selectedHorses.map(horse => ({
                    horseIndex: horse.horseIndex,
                    condition: horse.condition,
                    distanceProgress: 0,
                })),
            }

            laps.push(lapData)

            const resultData = {
                lapNumber: lap,
                horses: [],
            }

            results.push(resultData)
        }

        state.lapProgram = laps
        state.lapResults = results
    },
    updateLapProgress(state) {
        if (!state.isRacingInProcess) return

        const currentLap = state.lapProgram.find(lap => lap.lapNumber === state.lapNumber)
        if (!currentLap) return

        const lapDistance = state.lapsLength[state.lapNumber]
        const currentResults = state.lapResults.find(lap => lap.lapNumber === state.lapNumber)

        for (const horse of currentLap.horses) {
            if (horse.finished) continue

            const horseData = state.horseList.find(horseFromList => horseFromList.horseIndex === horse.horseIndex)
            if (!horseData) continue

            horse.distanceProgress += horseData.condition
        }

        let finishedHorses = []
        for (const horse of currentLap.horses) {
            if (horse.distanceProgress >= lapDistance) {
                horse.distanceProgress = lapDistance
                horse.finished = true

                if (!finishedHorses.some(finishedHorse => finishedHorse.horseIndex === horse.horseIndex)) {
                    finishedHorses.push({
                        distanceProgress: horse.distanceProgress,
                        horseIndex: horse.horseIndex,
                    })
                }
            }
        }

        finishedHorses.sort((a, b) => b.distanceProgress - a.distanceProgress)

        for (const finishedHorse of finishedHorses) {
            if (!currentResults.horses.some(horseFromResults => horseFromResults.horseIndex === finishedHorse.horseIndex)) {
                currentResults.horses.push({
                    horseIndex: finishedHorse.horseIndex,
                    position: currentResults.horses.length + 1,
                })
            }
        }

        const allFinished = currentLap.horses.every(currentLapHorse => currentLapHorse.finished)
        if (allFinished) {
            if (state.lapNumber < TOTAL_LAPS) {
                state.lapNumber++
            } else {
                state.isRacingInProcess = false
                clearInterval(state.racing)
            }
        }
    },
}


const actions = {
    generateRacing({ commit }) {
        commit('generateRacing')
        commit('setHorses')
        commit('setLapProgram')
    },
    startPauseRacing({ commit, state, dispatch }) {
        commit('startPauseRacing')

        if (state.isRacingInProcess) {
            state.racing = setInterval(() => {
                dispatch('tickRacing')
            }, TICK_INTERVAL)
        } else {
            clearInterval(state.racing)
        }
    },

    tickRacing({ commit }) {
        commit('updateLapProgress')
    },
}

const getters = {
    getLapProgram: (state) => state.lapProgram,
    getCurrentLapProgram: (state) => {
        if(state.lapNumber === 0) return []
        const lapIndex = state.lapNumber - 1
        return store.state.lapProgram[lapIndex].horses
    },
    getLapResults: (state) => state.lapResults,
    getLapNumber: (state) => state.lapNumber,
    getLapLength: (state) => (lapNumber) => state.lapsLength[lapNumber],
    getHorseName: (state) => (horseIndex) => {
        return state.horseList[horseIndex].name
    },
    getHorseColor: (state) => (horseIndex) => {
        return state.horseList[horseIndex].color
    },
    getCurrentLapHorseResult: (state) => (horseIndex) => {
        if(state.lapResults[state.lapNumber-1].horses.length === 0) return null
        const horseResult = state.lapResults[state.lapNumber-1].horses.find(horse => horse.horseIndex === horseIndex)

        return horseResult ? horseResult.position : null
    },
}



export const store = createStore({
    state,
    getters,
    actions,
    mutations,
})
