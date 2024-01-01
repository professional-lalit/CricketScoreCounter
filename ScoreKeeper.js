const BALLS_THRESHOLD = 30;

class ScoreKeeper{

    constructor(){                              
        this.batters = ['A', 'B', 'C', 'D', 'E'];
        this.bowlers = ['A', 'B', 'C', 'D', 'E'];   
        this.currentBatsman = this.batters[0];
        this.nextBatsman = this.batters[1];
        this.currentBaller = this.bowlers[0];
        this.deliveries = [];
        this.totalScore = 0;
        this.totalBalls = 0;
        this.battersScores = new Map();
        this.bowlersScores = new Map();
    }

    addDelivery(delivery) {         
        delivery.bowler = this.currentBaller;
        delivery.batsman = this.currentBatsman;

        if(delivery.ballType != 'V'){
           delivery.runs = +delivery.runs + 1; 
        }

        if(delivery.runs != 'O'){
            this.totalScore += parseInt(delivery.runs);
        }

        if(delivery.ballType == 'V'){                
            this.totalBalls++; 
        }

        this.deliveries.push(delivery);                           

        if(delivery.runs == 'O'){
            this.out();
        }

        if(this.totalBalls%6 == 0){
            this.overFinished();
            this.swapBatsman();
        }
        this.printScore();           
    }
    
    swapBatsman() {
        let temp = this.currentBatsman;
        this.currentBatsman = this.nextBatsman;
        this.nextBatsman = temp;    
    }

    out(){
        let batsman = this.batters[this.batters.indexOf(this.currentBatsman) + 1];                        
        if(batsman == this.nextBatsman){            
            batsman = this.batters[this.batters.indexOf(this.nextBatsman) + 1];        
        }
        if(batsman){
            this.currentBatsman = batsman;
        }else{
            this.inningsFinished();
        }
    }

    inningsFinished(){
        console.log('######################################################################');
        console.log('************************* Innings Finished ***************************');
        console.log('######################################################################');
    }

    overFinished(){        
        this.currentBaller = this.bowlers[this.bowlers.indexOf(this.currentBaller) + 1];                
    }

    getBatsmanScore(batsman){
        let sum = 0;
        this.deliveries.forEach(delivery => {
            if(delivery.batsman == batsman){
                if(delivery.runs != 'O'){
                    sum += parseInt(delivery.runs);           
                }
            } 
        });
        return sum;
    }

    getBowlerScore(bowler){
        let totalBalls = 0;
        let wideBalls = 0;
        let noBalls = 0;
        let deadBalls = 0;
        let wickets = 0;
        this.deliveries.forEach(delivery => {
            if(delivery.bowler == bowler){
                totalBalls++; 
                switch (delivery.ballType) {
                    case 'W':
                        wideBalls++;
                        break;
                    case 'N':
                        noBalls++;
                        break;
                    case 'D':
                        deadBalls++;
                        break;    
                    default:                        
                        break;
                }
                if(delivery.runs == 'O'){
                    wickets++
                }          
            } 
        });
        return `(${totalBalls}) deliveries | [ ${wideBalls} wides, ${noBalls} nos, ${deadBalls} deads, ${wickets} wickets  ]`
    }

    printScore(){            
        console.log(`
            Current Batsman = ${this.currentBatsman}: ${this.getBatsmanScore(this.currentBatsman)} \t
            Current Bowler = ${this.currentBaller}: ${this.getBowlerScore(this.currentBaller)} \n
            Overs = ${Math.trunc(this.totalBalls/6)}.${this.totalBalls%6} \n
            Total Runs = ${this.totalScore} \n
        `);
    }

    loadBattersScore(){
        let battersScores = new Map();
        let batterScore = 0;
        this.batters.forEach(batter =>{   
            this.deliveries.forEach(delivery => {             
                if(delivery.batsman == batter){
                    batterScore += +delivery.runs;
                }
            })
        });
        battersScores.set(delivery.batsman, batterScore);
        return battersScores;
    }

    loadBowlersScore(){
        let bowlersScores = new Map();
        let wickets = 0;
        this.bowlers.forEach( bowler =>{  
            this.deliveries.forEach(delivery => {
                if(delivery.bowler == bowler){
                    if(delivery.runs == 'O'){
                        +wickets++;
                    }
                }
            })                          
        })
        bowlersScores.set(delivery.bowler, wickets);
    }

    printInningsReport(){
        let bowlersScores = this.loadBowlersScore();
        let battersScores = this.loadBattersScore();

        let wickets = 0;
        bowlersScores.forEach(value => {
            wickets += +value;
        })

        let runs = 0;
        battersScores.forEach(value => {
            runs += +value;
        })

        console.log(`            
            Wickets = ${wickets}
            Runs = ${run}
            Overs = ${Math.trunc(this.totalBalls/6)}.${this.totalBalls%6} \n
            Total Runs = ${this.totalScore} \n
        `);
    }
}

export function getScoreKeeperInstance(){
    return new ScoreKeeper();
}