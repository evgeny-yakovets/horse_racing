import { test, expect } from '@playwright/test'

test.describe('StatsTables Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        // check store is available
        await expect(async () => {
            const hasStore = await page.evaluate(() => !!window.store)
            expect(hasStore).toBe(true)
        }).toPass()

        await page.getByTestId('horseToolbarGenerateButton').click()
        await page.waitForTimeout(300)
    })

    test('Check table Program and Results titles', async ({ page }) => {
        await expect(page.getByTestId('horseProgramTitle')).toBeVisible()
        await expect(page.getByTestId('horseResultTitle')).toBeVisible()

        await expect(page.getByTestId('horseProgramTitle')).toHaveText('Program')
        await expect(page.getByTestId('horseResultTitle')).toHaveText('Results')
    })

    test('Check all Program tables exists', async ({ page }) => {
        const programTables = await page.getByTestId('horseProgramLapTable').count()
        expect(programTables).toBe(6)

        const firstLapRows = await page.getByTestId('horseProgramLapTable').first()
            .getByTestId('horseProgramRow').count()
        expect(firstLapRows).toBe(10)
    })

    test('Check Program table column headers', async ({ page }) => {
        await expect(page.getByTestId('horseProgramLapTablePositionHeader').first())
            .toHaveText('Position')
        await expect(page.getByTestId('horseProgramLapTableNameHeader').first())
            .toHaveText('Name')
    })

    test('Check horse names in Program table are the same as on store', async ({ page }) => {
        const storeHorses = await page.evaluate(() =>
            window.store.state.lapProgram[0].horses.map(
                (horse: any) => window.store.getters.getHorseName(horse.horseIndex)
            )
        )

        const tableHorses = await page.getByTestId('horseProgramLapTable').first()
            .getByTestId('horseProgramRowHorseName').allTextContents()

        expect(tableHorses.length).toBe(storeHorses.length)
        for (let i = 0; i < tableHorses.length; i++) {
            expect(tableHorses[i]).toBe(storeHorses[i])
        }
    })

    test('Compare horses color with visible in table', async ({ page }) => {
        const firstHorse = await page.evaluate(
            () => {
            const horse = window.store.state.lapProgram[0].horses[0]
            const color = window.store.getters.getHorseColor(horse.horseIndex)
            return { horseIndex: horse.horseIndex, expectedColor: color }
        })

        const actualColor = await page
            .getByTestId('horseProgramLapTable').first()
            .getByTestId('horseProgramRowHorseName').first()
            .evaluate(el => window.getComputedStyle(el).color)

        // colorValue will contains rgb() but we have color in text - need to convert to rgb
        // this hack adds div, sets expected color and gets rgb for expected color
        const expectedRgb = await page.evaluate((name) => {
            const el = document.createElement('div')
            el.style.color = name
            document.body.appendChild(el)
            const rgb = getComputedStyle(el).color
            document.body.removeChild(el)
            return rgb
        }, firstHorse.expectedColor)

        expect(actualColor).toBe(expectedRgb)
    })

    test('Check Results table is empty on race start', async ({ page }) => {
        const resultRows = await page.getByTestId('horseResultTable').count()
        expect(resultRows).toBe(0)
    })

    test('Check Results table on lap end', async ({ page }) => {
        await page.getByTestId('horseToolbarStartPauseButton').click()

        // increase horses speed
        await page.evaluate(() => {
            window.store.state.lapProgram[0].horses.forEach((horse: any) => { horse.condition = 4000 })
        })

        // and wait the lap end
        await page.waitForTimeout(2500)

        const resultTablesCount = await page.getByTestId('horseResultTable').count()
        expect(resultTablesCount).toBeGreaterThanOrEqual(1)
        
        const firstResultRows = await page.getByTestId('horseResultTable').first()
            .getByTestId('horseResultRow').count()
        expect(firstResultRows).toBeGreaterThan(0)
    })

    test('Check horse names in Result table are the same as on store', async ({ page }) => {
        await page.evaluate(() => {
            const lap = window.store.state.lapProgram[0]
            lap.horses.forEach((horse: any) => { horse.condition = 4000 })
        })
        await page.getByTestId('horseToolbarStartPauseButton').click()
        await page.waitForTimeout(2500)

        const resultHorseNames = await page
            .getByTestId('horseResultRowHorseName')
            .allTextContents()

        expect(resultHorseNames.length).toBeGreaterThan(0)

        const allExist = await page.evaluate((names) => {
            return names.every(name =>
                window.store.state.horseList.some((horse: any) => horse.name === name)
            )
        }, resultHorseNames)

        expect(allExist).toBe(true)
    })
})
