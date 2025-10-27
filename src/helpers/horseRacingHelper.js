
export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const generateHorseNames = (count) => {
    const horseNames = [
        'Thunderbolt', 'Shadowfax', 'Blaze', 'Spirit', 'Midnight', 'Storm', 'Aurora', 'Raven',
        'Comet', 'Whisper', 'Lightning', 'Dusty', 'Nova', 'Falcon', 'Sapphire', 'Phoenix',
        'Silverwind', 'Tornado', 'Jet', 'Moonlight', 'Arrow', 'Crimson', 'Onyx', 'Willow',
        'Majesty', 'Eclipse', 'Flame', 'Zephyr', 'Tempest', 'Mirage',
    ]
    return horseNames.sort(() => Math.random() - 0.5).slice(0, count)
}

export const getRandomColors = (count) => {
    const colorPalette = [
        'red', 'green', 'blue', 'orange', 'purple', 'yellow', 'pink', 'brown',
        'gray', 'black', 'teal', 'magenta', 'indigo',
        'silver', 'navy', 'violet', 'maroon', 'olive', 'coral', 'turquoise',
        'crimson', 'khaki', 'plum', 'salmon', 'tan', 'orchid', 'chocolate',
    ]
    return colorPalette.sort(() => Math.random() - 0.5).slice(0, count)
}
