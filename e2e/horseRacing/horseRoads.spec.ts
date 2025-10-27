import { test, expect } from '@playwright/test'

test.describe('HorseRoads + HorseRoadItem Components', () => {
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

    // === HORSE ROADS TESTS ===
    test('Check roads count', async ({ page }) => {
        const horseRoadItems = page.getByTestId('horseRoadItem')
        await expect(horseRoadItems).toHaveCount(10)
    })

    test('Check FINISH label', async ({ page }) => {
        const finishLabel = await page.getByTestId('roadsFinishLabel')
        await expect(finishLabel).toBeVisible()
        await expect(finishLabel).toHaveText('FINISH')
    })

    test('Check lap information', async ({ page }) => {
        const lapInfo = await page.getByTestId('roadsLapInformation').textContent()
        expect(lapInfo).toMatch(/\d+\.st Lap \d+m/)
    })

    test('Check horse positions changing', async ({ page }) => {
        const beforeProgress = await page.evaluate(() =>
            window.store.state.lapProgram[0].horses.map((horse: any) => horse.distanceProgress)
        )

        await page.getByTestId('horseToolbarStartPauseButton').click()
        await page.waitForTimeout(2000)

        const afterProgress = await page.evaluate(() =>
            window.store.state.lapProgram[0].horses.map((horse: any) => horse.distanceProgress)
        )

        const moved = afterProgress.some((pos: number, i: number) => pos > beforeProgress[i])
        expect(moved).toBe(true)
    })

    // === HORSE ROAD ITEM TESTS ===
    test('Each HorseRoadItem renders with correct name, color, and progress', async ({ page }) => {
        // lapHorses have no color information, needs to get all horseIndex and grab horses from horseList
        const lapHorsesWithFullData = await page.evaluate(() => {
            const lapHorses = window.store.state.lapProgram[0].horses
            const horseList = window.store.state.horseList

            return lapHorses.map((lapHorse: any) => {
                const listHorse = horseList.find((horse: any) => horse.horseIndex === lapHorse.horseIndex)
                return {
                    ...lapHorse,
                    name: listHorse?.name || '',
                    color: listHorse?.color || '',
                }
            })
        })

        for (let i = 0; i < lapHorsesWithFullData.length; i++) {
            const item = page.getByTestId('horseRoadItem').nth(i)

            await expect(item).toBeVisible()

            // Check alt
            const img = item.getByTestId('horseRoadItemImage')
            await expect(img).toHaveAttribute('alt', lapHorsesWithFullData[i].name)

            // Check horse color
            const horseColor = lapHorsesWithFullData[i].color.toLowerCase()

            // colorValue will contains rgb() but we have color in text - need to convert to rgb
            // this hack adds div, sets expected color and gets rgb for expected color
            const expectedRgb = await page.evaluate((name) => {
                const el = document.createElement('div')
                el.style.color = name
                document.body.appendChild(el)
                const rgb = getComputedStyle(el).color
                document.body.removeChild(el)
                return rgb
            }, horseColor)

            const filter = await img.evaluate(el => getComputedStyle(el).filter.toLowerCase())
            expect(filter).toContain(expectedRgb)

            // Check progress (left%)
            const left = await img.evaluate(el => parseFloat(el.style.left))
            expect(left).toBeGreaterThanOrEqual(0)
            expect(left).toBeLessThanOrEqual(100)
        }
    })

    test('Horse image moves right when race starts', async ({ page }) => {
        const initialDistance = await page.$$eval('[data-testid="horseRoadItem"] img', imgs =>
            imgs.map(el => parseFloat(el.style.left || '0'))
        )

        await page.getByTestId('horseToolbarStartPauseButton').click()
        await page.waitForTimeout(2000)

        const currentDistance = await page.$$eval('[data-testid="horseRoadItem"] img', imgs =>
            imgs.map(el => parseFloat(el.style.left || '0'))
        )

        const moved = currentDistance.some((current, index) => current > initialDistance[index])
        expect(moved).toBe(true)
    })
})
