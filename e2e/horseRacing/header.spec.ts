import { test, expect } from '@playwright/test'

test.describe('Horse Racing Toolbar', () => {
    test.beforeEach(async ({ page }) => {
        // racing available on the / path
        await page.goto('/')

        // check store is available
        await expect(async () => {
            const hasStore = await page.evaluate(() => !!window.store)
            expect(hasStore).toBe(true)
        }).toPass()
    })

    test('Check header and buttons text', async ({ page }) => {
        await expect(page.getByTestId('horseToolbarTitle')).toBeVisible()
        await expect(page.getByTestId('horseToolbarGenerateButton')).toBeVisible()
        await expect(page.getByTestId('horseToolbarStartPauseButton')).toBeVisible()
    })

    test('Check Generate program click', async ({ page }) => {
        await page.exposeFunction('checkLapProgram', () => {
            return window.store.state.lapProgram.length
        })

        await page.getByTestId('horseToolbarGenerateButton').click()

        await page.waitForTimeout(300)

        const lapCount = await page.evaluate(() => window.store.state.lapProgram.length)
        expect(lapCount).toBe(6)
    })

    test('Check Start / Pause click', async ({ page }) => {
        await page.getByTestId('horseToolbarGenerateButton').click()

        let isRunning = await page.evaluate(() => window.store.state.isRacingInProcess)
        expect(isRunning).toBe(false)

        await page.getByTestId('horseToolbarStartPauseButton').click()
        await page.waitForTimeout(200)
        isRunning = await page.evaluate(() => window.store.state.isRacingInProcess)
        expect(isRunning).toBe(true)

        await page.getByTestId('horseToolbarStartPauseButton').click()
        await page.waitForTimeout(200)
        isRunning = await page.evaluate(() => window.store.state.isRacingInProcess)
        expect(isRunning).toBe(false)
    })

    test('Check Start / Pause leads to distance increasing', async ({ page }) => {
        await page.getByTestId('horseToolbarGenerateButton').click()
        await page.getByTestId('horseToolbarStartPauseButton').click()

        const before = await page.evaluate(() => {
            const lap = window.store.state.lapProgram[0]
            return lap.horses[0].distanceProgress
        })

        await page.waitForTimeout(500)

        const after = await page.evaluate(() => {
            const lap = window.store.state.lapProgram[0]
            return lap.horses[0].distanceProgress
        })

        expect(after).toBeGreaterThan(before)
    })
})
