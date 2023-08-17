const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios");
const { userToken } = require('../../config.json');
const { webhook } = require('../../config.json');
const { guildId } = require('../../config.json');
const { wickVerifiedRole } = require('../../config.json');
const { membersRole } = require('../../config.json');
const { NoTSCGuildID } = require('../../config.json');

axios.defaults.headers.common['Authorization'] = userToken;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Verification system.'),
	async execute(interaction) {
		const userId2 = interaction.member.id;
		const targetId = NoTSCGuildID;
    const username = interaction.user.username;
    const joinedDate = interaction.member.joinedAt;

		async function tsc() {
    const Ban = {
			method: 'put',
			url: `https://discord.com/api/v9/guilds/${guildId}/bans/` + userId2,
			headers: { 'Authorization': `${userToken}` }
	}
	
	let res = await axios(Ban)

	console.log(res.data)
}

async function webhookPassed() {
  const payload = {
    "content": null,
    "embeds": [
      {
        "title": `${username}'s AntiTuanSoCool Verification Result`,
        "description": `Member : ${username} (${userId2})\nJoined : ${joinedDate}\n\nStatus : Passed! ✅`,
        "color": null,
        "author": {
          "name": "Test"
        }
      }
    ],
    "attachments": []
  }

  const passed = {
    method: 'post',
    url: webhook,
    data: payload
}

let res = await axios(passed)
}

async function webhookFailed() {
  const payload = {
    "content": null,
    "embeds": [
      {
        "title": `${username}'s AntiTuanSoCool Verification Result`,
        "description": `Member : ${username} (${userId2})\nJoined : ${joinedDate}\n\nStatus : Failed ❌`,
        "color": null,
        "author": {
          "name": "Test"
        }
      }
    ],
    "attachments": []
  }

  const failed = {
    method: 'post',
    url: webhook,
    data: payload
}

let res = await axios(failed)
}

async function complete() {
  const payload = {
    "roles": [`${wickVerifiedRole}`, `${membersRole}`]
  };

  const giveRole = {
    method: 'patch',
    url: `https://discord.com/api/v9/guilds/${guildId}/members/${userId2}`,
    headers: {
      'Authorization': `${userToken}`
    },
    data: payload
  };

  try {
    const res = await axios(giveRole);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function Success() {
		complete();
    interaction.editReply('Success!');
		await new Promise(resolve => setTimeout(resolve, 2540));
    webhookPassed();
  };


  async function Failed() {
    webhookFailed();
    await new Promise(resolve => setTimeout(resolve, 2540));
		tsc();
  };
		await interaction.reply({ content: `Please wait...`, ephemeral: true });

		axios.get('https://discord.com/api/v9/users/' + userId2 + '/profile?with_mutual_guilds=true&with_mutual_friends_count=false')
		.then(resp => {
	
			const mutualGuilds = resp.data.mutual_guilds;
	
			const found = mutualGuilds.find(guild => guild.id === targetId);	
	
			if (found) {
				Failed();
			} else {
				Success();
			}
		})
	},
};
