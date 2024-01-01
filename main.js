import {getScoreKeeperInstance} from './ScoreKeeper.js';
import {createInterface} from 'readline';
// const Delivery = require('./Delivery.js');
import Delivery from './Delivery.mjs';

const readLine = createInterface({
    input: process.stdin,
    output: process.stdout
  });

const ballTypes = [ 'V', 'W', 'N', 'D' ];
const runTypes = [ '0', '1', '2', '3', '4', '6' ];

let currentDelivery = null;
const scoreKeeper = getScoreKeeperInstance();


function validateBallType(ballType){
  return ballTypes.indexOf(ballType) >= 0;
}

function validateRunType(runType){
  return runTypes.indexOf(runType) >= 0 || runType == 'O';
}

function handleBallInput(ballType){
  if(validateBallType(ballType)){
    console.log(`Ball Type is ${ballType}`);
    currentDelivery = new Delivery(-1, ballType);
    askRunType();
  }else{
    console.log('Invalid Ball Type!\n');
    askBallType();
  }
}

function handleRunsInput(runs){
  if(validateRunType(runs)){    
    currentDelivery.runs = runs;
    scoreKeeper.addDelivery(currentDelivery); 
    if(scoreKeeper.totalBalls <= 30){
      askBallType();
    }else{
      readLine.close();
      console.log('******************** Innings finished ************************');
    }       
  }else{
    console.log('Invalid Run Type!\n');
    askRunType()
  }
}

function askRunType(){
  readLine.question('Enter number of runs, O for [Out] - [0,1,2,3,4,6,O]\n', handleRunsInput);
}

function askBallType(){
  readLine.question('Enter ball type - Valid (V) Wide (W), No (N), Dead (D)\n', handleBallInput);
}

askBallType();

