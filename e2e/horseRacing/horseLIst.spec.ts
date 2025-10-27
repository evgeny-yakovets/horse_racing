import { test, expect } from '@playwright/test'

test.describe('HorseList Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        // check store is available
        await expect(async () => {
            const hasStore = await page.evaluate(() => !!window.store)
            expect(hasStore).toBe(true)
        }).toPass()
    })

    test('Check table is hidden before race generation', async ({ page }) => {
        await expect(page.getByTestId('horseListTitle')).toBeHidden()
        await expect(page.getByTestId('horseListTable')).toBeHidden()
        await expect(page.getByTestId('horseListTableNameHeader')).toBeHidden()
        await expect(page.getByTestId('horseListTableConditionHeader')).toBeHidden()
        await expect(page.getByTestId('horseListTableColorHeader')).toBeHidden()

        const rows = await page.getByTestId('horseListRow').count()
        expect(rows).toBe(0)
    })

    test('Check table is visible after race generation with 20 records', async ({ page }) => {
        await page.getByTestId('horseToolbarGenerateButton').click()
        await page.waitForTimeout(300)

        await expect(page.getByTestId('horseListTitle')).toBeVisible()
        await expect(page.getByTestId('horseListTable')).toBeVisible()
        await expect(page.getByTestId('horseListTableNameHeader')).toBeVisible()
        await expect(page.getByTestId('horseListTableConditionHeader')).toBeVisible()
        await expect(page.getByTestId('horseListTableColorHeader')).toBeVisible()

        const horseCount = await page.evaluate(() => window.store.state.horseList.length)
        expect(horseCount).toBe(20)

        const rows = await page.getByTestId('horseListRow').count()
        expect(rows).toBe(horseCount)
    })

    test('Check table contains horses name, condition and color', async ({ page }) => {
        await page.getByTestId('horseToolbarGenerateButton').click()
        await page.waitForTimeout(200)

        const firstHorse = await page.evaluate(() => window.store.state.horseList[0])
        expect(firstHorse).toBeDefined()

        const firstRow = page.getByTestId('horseListRow').first()

        await expect(firstRow.getByTestId('horseListRowName')).toHaveText(firstHorse.name)
        await expect(firstRow.getByTestId('horseListRowCondition')).toHaveText(String(firstHorse.condition))
        await expect(firstRow.getByTestId('horseListRowColor')).toContainText(firstHorse.color)
    })

    test('Compare horses color with visible in table', async ({ page }) => {
        await page.getByTestId('horseToolbarGenerateButton').click()
        await page.waitForTimeout(200)

        // colorValue will contains rgb() format color
        const colorValue = await page
            .getByTestId('horseListRow').first()
            .getByTestId('horseListRowColor')
            .evaluate(el => window.getComputedStyle(el).color)

        const firstHorse = await page.evaluate(() => window.store.state.horseList[0])
        const expectedColor = firstHorse.color.toLowerCase()

        // colorValue will contains rgb() but we have color in text - need to convert to rgb
        // this hack adds div, sets expected color and gets rgb for expected color
        const expectedRgb = await page.evaluate((name) => {
            const el = document.createElement('div')
            el.style.color = name
            document.body.appendChild(el)
            const rgb = getComputedStyle(el).color
            document.body.removeChild(el)
            return rgb
        }, expectedColor)

        expect(colorValue).toContain('rgb')
        expect(typeof colorValue).toBe('string')
        expect(colorValue).toBe(expectedRgb)
    })
})
