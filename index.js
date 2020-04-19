const moment = require('moment')
const axios = require('axios')
const term = require( 'terminal-kit' ).terminal;
const notifier = require('node-notifier');
const path = require('path');

const link = 'https://www.engineowning.com/shop/ajax/get-product-status?';
let timer;

term.on( 'key' , function( key ) {

  if(key === 'q' || key === 'CTRL_C'){
  	term.clear();
    process.exit();
  }
});

term.grabInput() ;

const init = async () => {
	const response = await axios.get(link)
	const gamesList = response.data.content.content.map(game => game.name)
	
	term.clear()
		.cyan('Choose the service you are going to track: \n' )
		.singleColumnMenu(gamesList, (error, response) => {
			const gameName = gamesList[response.selectedIndex];
			term.clear();
			checkStatus(gameName);
			timer = setInterval(() => checkStatus(gameName), 2000);
		});

}

const checkStatus = async (gameName) => {

	const response = await axios.get(link)
	const [{status}] = response.data.content.content.filter(game => game.name === gameName)
	const time = moment().format('MMMM Do YYYY, HH:mm:ss')

	if (status != 1) {
		term
			.clear()
			.cyan(time + ": Out of service." );
	} else {
		
		notifier.notify({
		  title: 'Service status update',
		  message: gameName +' is finally working!',
		  appID: 'EO service track',
		  icon: path.join(__dirname, 'navlogo.png')
		});

		clearInterval(timer)
		
		setTimeout(() => {
			term
			.clear()
			.cyan( gameName +' is finally working! Exit.');
			process.exit();
		}, 100)
		
	}	
}

init();

