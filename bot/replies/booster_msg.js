const fs = require('node:fs');
const path = require('node:path');
const nodeHtmlToImage = require('node-html-to-image');
const GIFEncoder = require('gif-encoder-2');
const { createCanvas, loadImage } = require('canvas');
const urlImages = [];
const frames = [];

const boosterMsg = {
	async execute(message) {
		const commandsPath = path.join('input');
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.png'));
		this.getImagesAndGenerateUrlImages(commandFiles, commandsPath, path);
		this.saveFramesToGif(path);
		nodeHtmlToImage({
			html: this.htmlTemplate(message),
			quality: 100,
			type: 'png',
			encoding: 'buffer',
			content: frames,
			transparent: true,
		}).then((res) => {
			this.generateCanvasAndSendGifByBuffer(message, res);
		}, (err) => {
			console.error('Error to generated image!', err);
		});
	},
	generateCanvasAndSendGifByBuffer: async (message, arrayBuffer) => {
		const canvas = createCanvas(800, 425);
		const ctx = canvas.getContext('2d');
		const stream = fs.createWriteStream(path.resolve('output', 'result.gif'));
		const encoder = new GIFEncoder(800, 425);
		encoder.createReadStream().pipe(stream);
		encoder.start();
		encoder.setDelay(70);
		for (const buffer of arrayBuffer) {
			const image = await loadImage(buffer);
			ctx.drawImage(image, 0, 0);
			encoder.addFrame(ctx, { resize: true });
		}
		encoder.finish();
		stream.on('finish', () => {
			message.channel.send({ files: [path.resolve('output', 'result.gif')], content: `Gracias por boostear el servidor <@${message.mentions.users.last().id}>` });
		});
	},
	getImagesAndGenerateUrlImages: (commandFiles, commandsPath) => {
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const image = fs.readFileSync(path.resolve(filePath));
			const base64Image = new Buffer.from(image).toString('base64');
			const urlImage = 'data:image/gif;base64,' + base64Image;
			urlImages.push(urlImage);
		}
	},
	saveFramesToGif: () => {
		for (let i = 0; i < urlImages.length; i++) {
			frames.push({ 'urlFromGif': urlImages[i], output: `${path.resolve('frames', 'frame' + i + '.png')}` });
		}
	},
	htmlTemplate: (message) => {
		return `<!DOCTYPE html>
		<html lang="en">
	  <head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="X-UA-Compatible" content="ie=edge" />
		<style>
		  body {
			font-family: "Poppins", Arial, Helvetica, sans-serif;
			color: #fff;
			max-width: 800px;
			max-height: 425px;
			width: 100%;
			height: 100%;
		  }
	
		  .app {
			padding: 20px;
			display: flex;
			flex-direction: row;
			background-image: url('{{urlFromGif}}');
			background-size: cover;
			background-repeat: round;
			align-items: center;
		  }
		  img {
			width: 360px;
			height: 380px;
			border-radius: 50%;
			padding: 5px;
      margin-left: -10px
		  }
		</style>
	  </head>
	  <body>
		<div class="app">
		<img src="${message.mentions.users.first().avatarURL()}" />
		</div>
	  </body>
    </html>
	`;
	},

};
module.exports = boosterMsg;