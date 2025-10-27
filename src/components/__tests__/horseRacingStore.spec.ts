import { describe, it, expect, beforeEach, vi } from 'vitest'
import { store } from '@/store/horseRacing.js'
import { generateHorseNames, getRandomColors, getRandomInt } from '@/helpers/horseRacingHelper.ts'

// mock helpers to return expected results
vi.mock('@/helpers/horseRacingHelper.ts', () => ({
    generateHorseNames: vi.fn(() => Array.from({ length: 20 }, (_, i) => `Horse${i + 1}`)),
    getRandomColors: vi.fn(() => Array.from({ length: 20 }, (_, i) => `Color${i + 1}`)),
    getRandomInt: vi.fn(() => 50), //50 for better distance testing
}))

describe('Horse Racing Store test', () => {
    beforeEach(() => {
        store.replaceState({
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
        })
    })

    it('Racing generation', () => {
        store.dispatch('generateRacing')

        const horses = store.state.horseList
        const laps = store.state.lapProgram

        expect(horses.length).toBe(20)
        expect(horses[0]).toHaveProperty('name', 'Horse1')
        expect(horses[0]).toHaveProperty('condition', 50)
        expect(laps.length).toBe(6)
        expect(laps[0].horses.length).toBe(10)
    })

    it('After race generation, race could be paused without racing reset', () => {
        vi.useFakeTimers()
        store.dispatch('generateRacing')
        store.dispatch('startPauseRacing')

        expect(store.state.isRacingInProcess).toBe(true)
        expect(store.state.racing).not.toBeNull()

        vi.advanceTimersByTime(300)
        store.dispatch('startPauseRacing')
        expect(store.state.isRacingInProcess).toBe(false)
        expect(store.state.racing).not.toBeNull()
    })

    it('Check tickRacing', () => {
        store.dispatch('generateRacing')
        store.state.lapNumber = 1
        store.state.isRacingInProcess = true

        const before = store.state.lapProgram[0].horses.map((horse: any) => horse.distanceProgress)
        store.dispatch('tickRacing')
        const after = store.state.lapProgram[0].horses.map((horse: any) => horse.distanceProgress)

        expect(after[0]).toBeGreaterThan(before[0])
        expect(after[0]).toBe(50)
    })

    it('Check horse is finished and do not run again', () => {
        store.dispatch('generateRacing')
        store.state.lapNumber = 1
        store.state.isRacingInProcess = true

        // set distance to max
        const lap = store.state.lapProgram[0]
        lap.horses.forEach((horse: any) => (horse.distanceProgress = store.state.lapsLength[store.state.lapNumber]))

        store.commit('updateLapProgress')

        const results = store.state.lapResults[0].horses
        expect(results.length).toBe(10)
        expect(results[0]).toHaveProperty('position', 1)
    })

    it('Check next lap starting after all horses finished', () => {
        store.dispatch('generateRacing')
        store.state.lapNumber = 1
        store.state.isRacingInProcess = true

        const lap = store.state.lapProgram[0]
        lap.horses.forEach((horse: any) => {
            horse.finished = true
            horse.distanceProgress = store.state.lapsLength[store.state.lapNumber]
        })

        store.commit('updateLapProgress')

        expect(store.state.lapNumber).toBe(2)
    })

    it('Check race is finished after last lap', () => {
        store.dispatch('generateRacing')
        store.state.lapNumber = 6
        store.state.isRacingInProcess = true

        const lap = store.state.lapProgram[5]
        lap.horses.forEach((horse: any) => {
            horse.finished = true
            horse.distanceProgress = store.state.lapsLength[store.state.lapNumber]
        })

        store.commit('updateLapProgress')
        expect(store.state.isRacingInProcess).toBe(false)
    })
})
