module.exports = {
    name: 'ready',
    execute(client) {
        console.log(`${client.user.tag} Hazırlandı`)

        const activities = [
            'Lexuizm ❤️ Bot Studio',
            'Kawn ❤️ Bot Studio',
            'ElectusX ❤️ Bot Studio',
            'Deniz ❤️ Bot Studio'
        ]

        let currentIndex = 0

        setInterval(() => {
            const activity = activities[currentIndex]
            client.user.setActivity(activity)
            client.user.setStatus('idle')
            
            currentIndex = (currentIndex + 1) % activities.length
        }, 3000) 
    }
}