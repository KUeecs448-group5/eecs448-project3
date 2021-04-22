//overall game function
import debug from './Executive.js';
import Character from './character.js';
import {names, enames, music, playerIdleGifs, enemyIdleGifs, background, charId, nameId, values, bAattack, bAaoe, bAitem, bAheal, bTattack, bTaoe, bTitem, bTheal, bANattack, bANdamage, healthId, manaId, deathId} from './data.js';
    const playerArray = []; //player character array
    const enemyArray = []; //enemy character array
function newGame(world){
    var menu = document.getElementById("start");
    menu.style.visibility = "hidden";
    gameMode = world;
    worldChange();
    document.getElementById(music[gameMode]).play();
    playerArray[0] = new Character(100,10,names[gameMode][0],3);
    playerArray[1] = new Character(100,100,names[gameMode][1],4);
    playerArray[2] = new Character(100,100,names[gameMode][2],5);

    enemyArray[0] = new Character(100,100,enames[gameMode][0],0);
    enemyArray[1] = new Character(200,100,enames[gameMode][1],1);
    enemyArray[2] = new Character(100,100,enames[gameMode][2],2);
    
    setOwnPlayer(0);
}

let gameMode = 0;

let actionBox = document.getElementById("infoBox2");

function worldChange(){
    console.log("Changing worlds");
    document.getElementById("background").src = background[gameMode];
    for(let i=0;i<=2;i++){//loop for changing the enemies
        charId[i].src = enemyIdleGifs[gameMode][i];
    }
    for(let i=0;i<=2;i++){//loop for changing the players
        charId[i+3].src = playerIdleGifs[gameMode][i];
    }
    for(let i=0;i<=2;i++){//loop for changing player names
        nameId[i].innerHTML = names[gameMode][i];
        nameId[i+3].innerHTML = enames[gameMode][i];
    }
    for(let i=4;i<=6;i++){//loop for changing enemy damage values
        values[i][1] = values[i][1] + (gameMode*5);
    }
    if(gameMode == 1){//conditional for adjusting some image scales
        charId[3].style.transform = "scale(0.85)";
        charId[4].style.width = "200px";
        charId[5].style.transform = "scale(0.85)";
        //document.getElementById("player1").style.border = "solid 1px transparent"
    }
    if(gameMode == 2){//conditional for adjusting some image scales
        charId[2].style.marginTop = "3%";
    }
    document.getElementById("heal icon").src = bAheal[gameMode];//heal button has to be changed here}
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
async function enemyAttack(){
    await sleep(2000)
    actionBox.innerHTML = "Enemy's Turn."
    await sleep(2000)
    for(let i = 0; i < enemyArray.length; i++){
        console.log("\n\n");
        if(enemyArray[i].health !== 0){
            document.getElementById("name"+(4+i)).style.borderBottom = "solid yellow";
            enemyAction(enemyArray, playerArray, enemyArray[i])
            await sleep(3000);
            document.getElementById("name"+(3+i)).style.borderBottom = "none";
        }
        if(checkWin(playerArray)){
            alert("You Lost. Press the banner to play again.");
            document.getElementById("youDW").src = "assets/youdied.png";
            document.getElementById("loseLink").style.visibility = "visible";
        }
    }
    await sleep(2000)
    for(let i=0; i<playerArray.length; i++){
        if(playerArray[i].health !== 0){
            actionBox.innerHTML = "It is now "+names[gameMode][0]+"'s turn";
        }
        i=playerArray.length;
    }
}

function setOwnPlayer(player){
    playerAction(playerArray,enemyArray, player);
}

function playerAction(playerArray,enemyArray,player){
    //actionBox.innerHTML = "BEGIN " + playerArray[player].getName() + " ACTION"	
    //actionBox.innerHTML = "It is now " + playerArray[player].getName() + "'s turn"
    document.getElementById("name"+(player+1)).style.borderBottom = "solid yellow";
    //change button assets
    document.getElementById("weapon icon").src = bAattack[gameMode][player];
    document.getElementById("spell icon").src = bAaoe[gameMode][player];
    document.getElementById("item icon").src = bAitem[gameMode][player];
    var attack = document.getElementById("Attack");
    attack.addEventListener("mouseover",function(){
        document.getElementById("action").innerHTML = bTattack[gameMode][player];
        document.getElementById("infoBox").innerHTML = "Attack a single enemy with your "+bTattack[gameMode][player]+".<br />Damage: 10-25<br />Mana cost: 10";
    })
    var aoe = document.getElementById("AOE");
    aoe.addEventListener("mouseover",function(){
        document.getElementById("action").innerHTML = bTaoe[gameMode][player];
        document.getElementById("infoBox").innerHTML = "Attack all enemies with "+bTaoe[gameMode][player]+".<br />Damage: 5-15 (per enemy)<br />Mana cost: 15";
    })
    var heal = document.getElementById("Heal");
    heal.addEventListener("mouseover",function(){
        document.getElementById("action").innerHTML = bTheal[gameMode];
        document.getElementById("infoBox").innerHTML = "Heal ally with "+bTheal[gameMode]+"<br />Heal: 10-20<br />Mana cost: 10";
    })
    var item = document.getElementById("Item");
    item.addEventListener("mouseover",function(){
        document.getElementById("action").innerHTML = bTitem[gameMode][player];
        document.getElementById("infoBox").innerHTML = "Use "+bTitem[gameMode][player]+" on a single enemy.<br />Damage: 20-30<br />Mana cost: 0<br />Inventory: "+playerArray[player].item;
    })
    attack.onclick =  function(){
        console.clear();
        //var select = parseInt(prompt("who would you like to attack (0-2)?:"));
        //var select = verifyTarget(enemyArray, 0, "attack");
        for(let i = 0; i <= 2; i++){
            
            charId[i].onmouseover = function(){this.style.border = "dashed red 2.5px"}; //highlight potential target
            charId[i].onmouseleave = function(){this.style.border = "none"}; //remove highlight
            charId[i].onclick = async function(){
                this.style.border = "solid red 2.5px"; //highlight target
                if(preVerifyTarget(i,enemyArray, 0, "attack")){
                    for(let i = 0; i <= 5; i++){//disable buttons
                            charId[i].onclick = function(){};
                        }
                    attack.onclick = function(){};
                    aoe.onclick = function(){};
                    heal.onclick = function(){};
                    item.onclick = function(){}; 
                    if(playerArray[player].getMana()<values[0][1]){   
                        playerArray[player].magic= playerArray[player].magic+10;
                        if(playerArray[player].getNumberValue()>2){
                            document.getElementById(manaId[playerArray[player].getNumberValue()]).innerHTML = playerArray[player].magic;
                            document.getElementById(manaId[playerArray[player].getNumberValue()-3]).value = playerArray[player].magic;
                    }
                }// recharge mana
                else{            
                    playerArray[player].damage_single(enemyArray[i],values[0]);
                    charId[player+3].src = bANattack[gameMode][player];
                }
                    await sleep(4000);
                    this.style.border = "none"; //remove highlight from target
                    charId[player+3].src = playerIdleGifs[gameMode][player];
                    document.getElementById("name"+(player+1)).style.borderBottom = "none";
                    document.getElementById("MP"+(player+1)).style.borderBottom = "none";
                    //actionBox.innerHTML = "BEGIN " + playerArray[player].getName() + " ACTION";
                    var next = getNext(player, playerArray, enemyArray);
                    if(next === -1){
                        console.log("Enemy's turn");
                        enemyAttack();
                        if(!playerArray || playerArray.length == 0){
                            alert("Team is dead");
                        }
                        else{
                            setOwnPlayer(getNext(-1,playerArray,enemyArray));
                        }
                    }
                    else{
                        actionBox.innerHTML = "It is now " + playerArray[next].getName() + "'s turn";
                        setOwnPlayer(next);
                    }
                }
            }
        }  
    }

    aoe.onclick = async function(){
        for(let i = 0; i < 3; i++){ //highlight targets
            charId[i].style.border = "solid red 2.5px";
        }
        console.clear();
        attack.onclick = function(){};//disable buttons to prevent spam click
        aoe.onclick = function(){};
        heal.onclick = function(){};
        item.onclick = function(){};
        for(let i = 0; i <= 5; i++){//disable buttons
            charId[i].onclick = function(){};
        }
        playerArray[player].damage(enemyArray,values[1]);
        charId[player+3].src = bANattack[gameMode][player];
        await sleep(4000);
        for(let i = 0; i < 3; i++){  //remove highlight from targets
            charId[i].style.border = "none";
        }
        charId[player+3].src = playerIdleGifs[gameMode][player];
        document.getElementById("name"+(player+1)).style.borderBottom = "none";
        document.getElementById("MP"+(player+1)).style.borderBottom = "none";
        var next = getNext(player, playerArray, enemyArray);
        if(next === -1){
            console.log("Enemy's turn");
            enemyAttack();
            if(!playerArray || playerArray.length == 0){
                alert("Team is dead");
            }
            else{
                setOwnPlayer(getNext(-1,playerArray,enemyArray));
            }
        }else{
            actionBox.innerHTML = "It is now " + playerArray[next].getName() + "'s turn";
            setOwnPlayer(next);
        }
    }

    heal.onclick = async function(){
        console.clear();
        for(let i = 3; i <= 5; i++){
            charId[i].onmouseover = function(){this.style.border = "dashed orange 2.5px"}; //highlight potential target
            charId[i].onmouseleave = function(){this.style.border = "none"}; //remove highlight
            charId[i].onclick = async function(){
                if(preVerifyTarget((i-3),playerArray, 100, "heal")){
                    for(let i = 0; i <= 5; i++){//disable buttons
                            charId[i].onclick = function(){};
                        }
                    attack.onclick = function(){};
                    aoe.onclick = function(){};
                    heal.onclick = function(){};
                    item.onclick = function(){};
                    playerArray[player].heal_single(playerArray[i-3],values[2]);
                    for(let j = 0; j < 4; j++){
                    charId[i].src = bAheal[gameMode];
                    await sleep(500);
                    charId[i].src = playerIdleGifs[gameMode][i-3];
                    await sleep(500);
                    }
                    document.getElementById("name"+(player+1)).style.borderBottom = "none";
                    document.getElementById("MP"+(player+1)).style.borderBottom = "none";
                    var next = getNext(player, playerArray, enemyArray);
                    if(next === -1){
                        console.log("Enemy's turn");
                        enemyAttack();
                        if(!playerArray || playerArray.length == 0){
                            alert("Team is dead");
                        }
                        else{
                            setOwnPlayer(getNext(-1,playerArray,enemyArray));
                        }
                    }
                    else{
                        actionBox.innerHTML = "It is now " + playerArray[next].getName() + "'s turn";
                        setOwnPlayer(next);
                    }
                }
            }
        }
    }

    item.onclick = async function(){
        console.clear();
        for(let i = 0; i <= 2; i++){
            charId[i].onmouseover = function(){this.style.border = "dashed red 2.5px"}; //highlight potential target
            charId[i].onmouseleave = function(){this.style.border = "none"}; //remove highlight
            charId[i].onclick = async function(){
                this.style.border = "solid red 2.5px"; //highlight target
                if(preVerifyTarget(i,enemyArray, 0, "attack")){
                    for(let i = 0; i <= 5; i++){//disable buttons
                            charId[i].onclick = function(){};
                        }
                    attack.onclick = function(){};
                    aoe.onclick = function(){};
                    heal.onclick = function(){};
                    item.onclick = function(){};
                         
                    playerArray[player].useItem(enemyArray[i],values[3]);
                    charId[player+3].src = bANattack[gameMode][player];
                    await sleep(4000);
                    this.style.border = "none"; //remove highlight from target
                    charId[player+3].src = playerIdleGifs[gameMode][player];
                    document.getElementById("name"+(player+1)).style.borderBottom = "none";
                    var next = getNext(player, playerArray, enemyArray);
                    if(next === -1){
                        console.log("Enemy's turn");
                        enemyAttack();
                        if(!playerArray || playerArray.length == 0){
                            alert("Team is dead");
                        }
                        else{
                            setOwnPlayer(getNext(-1,playerArray,enemyArray));
                        }
                    }
                    else{
                        actionBox.innerHTML = "It is now " + playerArray[next].getName() + "'s turn";
                        setOwnPlayer(next);
                    }
                }
            }
        }
    }
}

/*function verifyTarget(group, invalidVal, action){
    var retSelect = parseInt(prompt("Who would you like to " + action + "?:"));
    if(retSelect >= group.length || retSelect < 0){
        alert("Target " + retSelect + " is an invalid target. Please try again.");
        return verifyTarget(group, invalidVal, action);
    }
    else if(group[retSelect].health == invalidVal ||(group[retSelect].health === 0 && action === "heal")){
        alert("Cannot " + action + " " + group[retSelect].getName() + ". Please try again.");
        return verifyTarget(group, invalidVal, action);
    }
    else {
        return retSelect;
    }
}
*/

function preVerifyTarget(retSelect,group, invalidVal, action){
    if(retSelect >= group.length || retSelect < 0){
        alert("Target " + retSelect + " is an invalid target. Please try again.");
        return false;
    }
    else if(group[retSelect].health == invalidVal ||(group[retSelect].health === 0 && action === "heal")){
        alert("Cannot " + action + " " + group[retSelect].getName() + ". Please try again.");
        return false;
    }
    else {
        return true;
    }
}

async function enemyAction(enemyArray, playerArray, toAct){
    var action = Math.floor(Math.random() * (checkHeal(enemyArray) ? 4 : 3));
    var target = Math.floor(Math.random() * playerArray.length);
    
    
    if(action === 0){
        toAct.damage_single(playerArray[target],values[4]);
        charId[target+3].src = bANdamage[gameMode][target];
        await sleep(2500);
        charId[target+3].src = playerIdleGifs[gameMode][target];
    } else if(action === 1){
        toAct.damage(playerArray,values[5]);
        for(let i = 0; i < 3; i++){
            charId[i+3].src = bANdamage[gameMode][i];
        }
        await sleep(2500);
        for(let i = 0; i < 3; i++){
            charId[i+3].src = playerIdleGifs[gameMode][i];
        }
    } else if(action === 2){
        toAct.useItem(playerArray[target],values[3]);
        charId[target+3].src = bANdamage[gameMode][target];
        await sleep(2500);
        charId[target+3].src = playerIdleGifs[gameMode][target];
    } else if(action === 3){ //heal MUST be last to remove possibility of AI choosing to heal when impossible (all allys are at full heath)
        target = retLowestHealth(enemyArray);
        toAct.heal_single(enemyArray[target],values[6]);
        for(let i = 0; i < 3; i++){
            charId[target].src = bAheal[gameMode];
            await sleep(400);
            charId[target].src = enemyIdleGifs[gameMode][target];
            await sleep(400);
        }
    }
    for(let i = 0; i < 3; i++){
        charId[i].src = enemyIdleGifs[gameMode][i];
    }
    for(let i = 0; i < 3; i++){
        charId[i+3].src = playerIdleGifs[gameMode][i];
    }
}

function checkWin(array){
    for( let i = 0; i < array.length; i++){
        if(array[i].isAlive()){ 
            return(false);
        }  
    }
    return(true);
}

function getNext(current, group, oppGroup){
    if(checkWin(oppGroup)){
        alert("You won! Press the banner to play again.");
        document.getElementById("youDW").src = "assets/victory.png";
            document.getElementById("loseLink").style.visibility = "visible";
    }else if(current + 1 === group.length){
        return(-1); //enemy turn
    }
    else if(group[current+1].health <= 0){
        return(getNext(current+1, group, oppGroup));
    }
    else{
        return(current+1);
    }
}

function checkHeal(array) { //returns false if whole team has full health
    for(let i = 0; i < array.length; i++){
        if(array[i].health !== array[i].max_health && array[i].health !== 0){
            return(true);
        }
    }
    return(false);
}

function retLowestHealth(array) { //can be used in special enemy attack AI. necessary for enemy healing AI
    //var retNum = Math.floor(Math.random() * array.length); //set initial return value to random character index
    var minGap = 0;
    var retNum;
    for(let i = 0; i < array.length; i++){
        if(array[i].max_health - array[i].health > minGap && array[i].health != 0){
            retNum = i; //set return value to lowest heath value in index
            minGap = array[i].max_health - array[i].health;
        }
    }
    return(retNum);
}

export {newGame,playerAction,checkHeal,retLowestHealth}; //add checkwin
