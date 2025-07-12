const Discord = require('discord.js')
const icooldown = new Discord.Collection()
const { ownerid } = require("../ayarlar.json")

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
 
        if (interaction.type === Discord.InteractionType.ApplicationCommand) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

           
            if (interaction.user.id !== ownerid) {
                if (!icooldown.has(interaction.commandName)) {
                    icooldown.set(interaction.commandName, new Discord.Collection())
                }

                const now = Date.now()
                const timestampt = icooldown.get(interaction.commandName)
                const cooldownAmount = (command.cooldown) * 1000

                if (timestampt.has(interaction.user.id)) {
                    const expiration = timestampt.get(interaction.user.id) + cooldownAmount

                    if (now < expiration) {
                        const timeleft = Math.round((expiration - now) / 1000)

                        const embeduyarı = new Discord.EmbedBuilder()
                            .setDescription(`:x: Bu Komutu Kullanabilmek için **${timeleft} Saniye** Beklemelisin`)
                            .setColor('Red')
                        await interaction.reply({ embeds: [embeduyarı] })
                        setTimeout(() => { interaction.deleteReply() }, expiration - now)

                        return
                    }

                } else {
                    timestampt.set(interaction.user.id, now)
                    setTimeout(() => timestampt.delete(interaction.user.id), cooldownAmount)
                }
            }

            
            if (command.yetki) {
                var yetki = command.yetki.replace("ManageEmojis", 'Emojileri Yönet').replace("KickMembers", 'Kullanıcıyı Uzaklaştır').replace("BanMembers", 'Kullanıcıyı Yasakla').replace('Administrator', 'Yönetici').replace("ManageChannels", 'Kanalları Yönet').replace("ManageMessages", 'Mesajları Yönet').replace("ManageRoles", 'Rolleri Yönet')

                var yetkiyok = new Discord.EmbedBuilder()
                .setDescription(`
                :x: Yetersiz Yetki
                
                Gerekli Yetki: '**${yetki}**'
                `)
                .setColor('Red')
                if (!interaction.member.permissions.has(`${command.yetki}`)) return interaction.reply({ embeds: [yetkiyok] })
            }

            if (command.botyetki) {
                var botyetki = command.botyetki.replace("ManageEmojis", 'Emojileri Yönet').replace("KickMembers", 'Kullanıcıyı Uzaklaştır').replace("BanMembers", 'Kullanıcıyı Yasakla').replace('Administrator', 'Yönetici').replace("ManageChannels", 'Kanalları Yönet').replace("ManageMessages", 'Mesajları Yönet').replace("ManageRoles", 'Rolleri Yönet')

                var botyetkiyok = new Discord.EmbedBuilder()
                .setDescription(`
                :x: Yetersiz Yetkiye Sahibim
                
                Gerekli Yetki: '**${botyetki}**'
                `)
                .setColor('Red')
                if (!interaction.guild.members.me.permissions.has(`${command.botyetki}`)) return interaction.reply({ embeds: [botyetkiyok] })
            }

            try {
                await command.execute(client, interaction)
            } catch (error) {
                console.error(error)
                await interaction.reply({ 
                    content: 'Komutu çalıştırırken bir hata oluştu!', 
                    ephemeral: true 
                })
            }
        }

       
        if (interaction.type === Discord.InteractionType.MessageComponent && interaction.componentType === Discord.ComponentType.Button) {
            
            if (interaction.customId.startsWith('remove_warn_')) {
                
                if (!interaction.member.permissions.has('ModerateMembers')) {
                    return interaction.reply({
                        content: '❌ Bu işlem için yetkiniz yok!',
                        ephemeral: true
                    });
                }

                
                await interaction.message.delete();
                await interaction.reply({
                    content: `✅ Uyarı başarıyla kaldırıldı!`,
                    ephemeral: true
                });
            }
        }
    }
}