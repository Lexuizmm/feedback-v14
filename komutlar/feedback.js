const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    slash: true,
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Ürün geri bildirimi gönder')
        .addStringOption(option =>
            option
                .setName('ürün')
                .setDescription('Hangi ürün hakkında geri bildirim yapıyorsunuz?')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('yorum')
                .setDescription('Ürün hakkındaki düşüncelerinizi yazın')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('puan')
                .setDescription('Ürüne kaç puan veriyorsunuz?')
                .setRequired(true)
                .addChoices(
                    { name: '5 - Çok İyi', value: '5' },
                    { name: '4 - İyi', value: '4' },
                    { name: '3 - Orta', value: '3' },
                    { name: '2 - Kötü', value: '2' },
                    { name: '1 - Çok Kötü', value: '1' }
                )
        )
        .addStringOption(option =>
            option
                .setName('tavsiye')
                .setDescription('Bu ürünü başkalarına tavsiye eder misiniz?')
                .setRequired(true)
                .addChoices(
                    { name: 'Kesinlikle Tavsiye Ederim', value: 'Kesinlikle Tavsiye Ederim' },
                    { name: 'Tavsiye Ederim', value: 'Tavsiye Ederim' },
                    { name: 'Kararsızım', value: 'Kararsızım' },
                    { name: 'Tavsiye Etmem', value: 'Tavsiye Etmem' },
                    { name: 'Kesinlikle Tavsiye Etmem', value: 'Kesinlikle Tavsiye Etmem' }
                )
        ),
    async execute(client, interaction) {
        
        if (interaction.channelId !== '1379597055240044694') {
            return interaction.reply({ 
                content: 'Bu komutu sadece <#1379597055240044694> kanalında kullanabilirsiniz!', 
                ephemeral: true 
            });
        }

        const urun = interaction.options.getString('ürün')
        const yorum = interaction.options.getString('yorum')
        const puan = parseInt(interaction.options.getString('puan'))
        const tavsiye = interaction.options.getString('tavsiye')

        
        const ratingDisplay = `${('<:yildiz:1379623513241157714>').repeat(puan)}`

        
        const colors = {
            5: 0xFF6B6B,  
            4: 0x4ECDC4,  
            3: 0xFFBE0B,  
            2: 0x95A5A6,  
            1: 0x2C3E50   
        }

        const embed = new EmbedBuilder()
            .setColor(colors[puan])
            .setTitle('Müşteri Değerlendirmesi')
            .setDescription(`Değerlendiren: ${interaction.user}`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .addFields(
                { 
                    name: 'Ürün',
                    value: urun,
                    inline: false 
                },
                { 
                    name: 'Değerlendirme',
                    value: `${ratingDisplay}`,
                    inline: false 
                },
                {
                    name: 'Müşteri Yorumu',
                    value: yorum,
                    inline: false
                },
                {
                    name: 'Tavsiye Durumu',
                    value: `\`${tavsiye}\``,
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ 
                text: `Development By Bot Studio`, 
                iconURL: interaction.guild.iconURL({ dynamic: true }) 
            })

        // Butonları oluştur
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('onay_button')
                    .setLabel('Onaylıyorum')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('✅'),
                new ButtonBuilder()
                    .setCustomId('red_button')
                    .setLabel('Düzelt')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('❌'),
                new ButtonBuilder()
                    .setLabel('Bot Studio')
                    .setURL('https://discord.gg/botstudio')
                    .setStyle(ButtonStyle.Link)
            )

        
        const logEmbed = new EmbedBuilder()
            .setColor(colors[puan])
            .setTitle('Yeni Feedback Bildirimi')
            .setDescription(`
                **Kullanıcı:** ${interaction.user} (${interaction.user.tag})
                **Kullanıcı ID:** ${interaction.user.id}
                **Sunucu:** ${interaction.guild.name}
                **Kanal:** ${interaction.channel}
                
                **Değerlendirilen Ürün:** ${urun}
                **Müşteri Yorumu:** ${yorum}
                **Verilen Puan:** ${ratingDisplay}
                **Tavsiye Durumu:** ${tavsiye}
                
                **Tarih:** <t:${Math.floor(Date.now() / 1000)}:F>
            `)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ 
                text: `Feedback ID: ${interaction.id}`, 
                iconURL: interaction.guild.iconURL({ dynamic: true }) 
            })

        
        const logChannel = client.channels.cache.get('1379627039484542997')
        if (logChannel) {
            await logChannel.send({ embeds: [logEmbed] })
        }

       
        await interaction.channel.send({ 
            embeds: [embed],
            components: [row]
        })

        
        await interaction.reply({ 
            content: `${interaction.user}, değerlendirmeniz için teşekkür ederiz! Görüşleriniz bizim için çok değerli. 🙏`,
            ephemeral: true 
        })
    }
}
