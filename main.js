let selectMenuInput = document.querySelector(
  "header .container .search .type .input"
);

let selectMenu = document.querySelector(
  "header .container .search .type .options"
);
let selectMenuOptions = document.querySelectorAll(
  "header .container .search .type .options li"
);
let searchButton = document.querySelector("header .container .search .button");
let apiKey = "RGAPI-98a64dc0-576d-495f-b304-442aeb1af7e9";
let dataContainer = document.querySelector("main .container");
let inputData = document.querySelector("header .container .search input");
let skillsArray = [];
let iconsArray = [];
// setting up select menu
let beforeActive = true;
selectMenuInput.addEventListener("click", function () {
  selectMenu.classList.toggle("active");
  if (beforeActive) {
    selectMenuInput.style.setProperty("--before", "0");
    selectMenuInput.style.setProperty("--after", "1");
    beforeActive = false;
  } else {
    selectMenuInput.style.setProperty("--before", "1");
    selectMenuInput.style.setProperty("--after", "0");
    beforeActive = true;
  }
});
selectMenuOptions.forEach((Option) => {
  if (Option.classList.contains("active")) {
    selectMenuInput.innerHTML = Option.innerHTML;
  }
  Option.addEventListener("click", function () {
    selectMenuInput.style.setProperty("--before", "1");
    selectMenuInput.style.setProperty("--after", "0");
    beforeActive = true;
    selectMenuOptions.forEach((one) => {
      one.classList.remove("active");
      this.classList.add("active");
      selectMenuInput.innerHTML = this.innerHTML;
      selectMenu.classList.remove("active");
    });
  });
});

searchButton.addEventListener("click", getData);

function getData() {
  let spinner = document.createElement("div");
  spinner.classList.add("spinner");
  let spinnerSpan = document.createElement("span");
  spinner.appendChild(spinnerSpan);
  spinner.appendChild(spinnerSpan.cloneNode(true));
  spinner.appendChild(spinnerSpan.cloneNode(true));
  dataContainer.innerHTML = "";
  dataContainer.appendChild(spinner);
  if (selectMenuInput.innerHTML.toLowerCase() === "player name") {
    getPlayerData(inputData.value);
  } else {
    getChampionData(inputData.value);
  }
}

async function getPlayerData(name) {
  try {
    let res = await fetch(
      `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${apiKey}`
    );
    let data = await res.json();
    let rankres = await fetch(
      `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.id}?api_key=${apiKey}`
    );
    let rankData = await rankres.json();
    dataContainer.innerHTML = "";
    let playerData = document.createElement("div");
    playerData.classList.add("playerData");
    let playerImg = document.createElement("img");
    playerImg.classList.add("plyayerImg");
    playerImg.src = `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/${data.profileIconId}.png`;
    let playerName = document.createElement("p");
    playerName.classList.add("playerName");
    playerName.innerHTML = `${data.name}`;
    let playerLevel = document.createElement("p");
    playerLevel.classList.add("playerLevel");
    playerLevel.innerHTML = `Level ${data.summonerLevel}`;
    let playerInfo = document.createElement("div");
    playerInfo.classList.add("playerInfo");
    let rankAndMatchsData = document.createElement("div");
    rankAndMatchsData.classList.add("rankAndMatchsData");
    if (rankData.length > 0) {
      rankData.forEach((rank) => {
        let rankContainer = document.createElement("div");
        rankContainer.classList.add("rank");
        let holder = document.createElement("div");
        let queueType = document.createElement("p");
        queueType.innerHTML = `${rank.queueType.replaceAll("_", " ")}`;
        let rankEmblem = document.createElement("img");
        rankEmblem.src = `ranked-emblems/Emblem_${rank.tier}.png`;
        let rankTier = document.createElement("p");
        rankTier.innerHTML = `${rank.tier} ${rank.rank}`;
        holder.appendChild(queueType);
        holder.appendChild(rankEmblem);
        holder.appendChild(rankTier);
        rankContainer.appendChild(holder);
        let wins = document.createElement("div");
        wins.classList.add("wins");
        let winsSvg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        let winsCircle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        winsCircle.setAttribute("cx", "52");
        winsCircle.setAttribute("cy", "52");
        winsCircle.setAttribute("r", "50");
        let winsNumber = document.createElement("p");
        winsNumber.innerHTML = rank.wins;
        let winsWord = document.createElement("P");
        winsWord.innerHTML = "Wins";
        winsSvg.appendChild(winsCircle);
        wins.appendChild(winsSvg);
        wins.appendChild(winsNumber);
        wins.appendChild(winsWord);
        let losses = document.createElement("div");
        losses.classList.add("losses");
        let lossesSvg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        let lossesCircle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        lossesCircle.setAttribute("cx", 52);
        lossesCircle.setAttribute("cy", 52);
        lossesCircle.setAttribute("r", 50);
        let lossesNumber = document.createElement("p");
        lossesNumber.innerHTML = rank.losses;
        let lossesWord = document.createElement("p");
        lossesWord.innerHTML = "Losses";
        lossesSvg.appendChild(lossesCircle);
        losses.appendChild(lossesSvg);
        losses.appendChild(lossesNumber);
        losses.appendChild(lossesWord);
        rankContainer.appendChild(wins);
        rankContainer.appendChild(losses);
        rankAndMatchsData.appendChild(rankContainer);
      });
    } else {
      let noRank = document.createElement("div");
      noRank.classList.add("notRanked");
      noRank.innerHTML = `${data.name} IS NOT RANKED THIS SEASON YET`;
      rankAndMatchsData.appendChild(noRank);
    }
    playerInfo.appendChild(playerImg);
    playerInfo.appendChild(playerName);
    playerInfo.appendChild(playerLevel);
    playerData.appendChild(playerInfo);
    playerData.appendChild(rankAndMatchsData);
    dataContainer.appendChild(playerData);
  } catch (error) {
    dataContainer.innerHTML = "";
    let invalidInput = document.createElement("p");
    invalidInput.classList.add("invalidInput");
    invalidInput.innerHTML = "INVALID PLAYER NAME";
    dataContainer.appendChild(invalidInput);
  }
}

async function getChampionData(name) {
  let championName = name[0].toUpperCase() + name.substr(1).toLowerCase();
  try {
    let res = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/12.18.1/data/en_US/champion/${championName}.json`
    );
    let data = await res.json();
    dataContainer.innerHTML = "";
    let championData = document.createElement("div");
    championData.classList.add("championData");
    //slider first box
    let firstBox = document.createElement("div");
    let imgholder = document.createElement("div");
    let champImg = document.createElement("img");
    champImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${data.data[championName].name}_0.jpg`;
    imgholder.appendChild(champImg);
    firstBox.appendChild(imgholder);
    let champInfo = document.createElement("div");
    let champName = document.createElement("p");
    champName.innerHTML = data.data[championName].name;
    champInfo.appendChild(champName);
    let champRoles = document.createElement("p");
    champRoles.innerHTML = data.data[championName].tags;
    champInfo.appendChild(champRoles);
    let champBlurb = document.createElement("p");
    champBlurb.innerHTML = data.data[championName].blurb;
    champInfo.appendChild(champBlurb);
    firstBox.appendChild(champInfo);
    championData.appendChild(firstBox);

    // slider second box
    let secondBox = document.createElement("div");
    let boxTitle = document.createElement("p");
    boxTitle.innerHTML = "BASE STATS";
    let stats = document.createElement("div");
    //hp
    let hp = document.createElement("div");
    let hpWord = document.createElement("p");
    hpWord.innerHTML = "HP";
    let hpIcon = document.createElement("span");
    hpIcon.className = "material-symbols-outlined";
    hpIcon.innerHTML = "favorite";
    let hpFullbar = document.createElement("div");
    let hpSmallBar = document.createElement("span");
    hpFullbar.appendChild(hpSmallBar);
    let hpNumber = document.createElement("p");
    hpNumber.innerHTML = data.data[championName].stats.hp;
    hp.appendChild(hpWord);
    hp.appendChild(hpIcon);
    hp.appendChild(hpFullbar);
    hp.appendChild(hpNumber);
    stats.appendChild(hp);
    //attack
    let attack = document.createElement("div");
    let attackWord = document.createElement("p");
    attackWord.innerHTML = "ATTACK";
    let attackIcon = document.createElement("span");
    attackIcon.className = "material-symbols-outlined";
    attackIcon.innerHTML = "swords";
    let attackFullBar = document.createElement("div");
    let attackSmallBar = document.createElement("span");
    attackFullBar.appendChild(attackSmallBar);
    let attackNumber = document.createElement("p");
    attackNumber.innerHTML = data.data[championName].stats.attackdamage;
    attack.appendChild(attackWord);
    attack.appendChild(attackIcon);
    attack.appendChild(attackFullBar);
    attack.appendChild(attackNumber);
    stats.appendChild(attack);
    //armor
    let armor = document.createElement("div");
    let armorWord = document.createElement("p");
    armorWord.innerHTML = "ARMOR";
    let armorIcon = document.createElement("span");
    armorIcon.className = "material-symbols-outlined";
    armorIcon.innerHTML = "shield";
    let armorFullBar = document.createElement("div");
    let armorSmallBar = document.createElement("span");
    armorFullBar.appendChild(armorSmallBar);
    let armorNumber = document.createElement("p");
    armorNumber.innerHTML = data.data[championName].stats.armor;
    armor.appendChild(armorWord);
    armor.appendChild(armorIcon);
    armor.appendChild(armorFullBar);
    armor.appendChild(armorNumber);
    stats.appendChild(armor);
    //magic resist
    let magicResist = document.createElement("div");
    let magicResistWord = document.createElement("p");
    magicResistWord.innerHTML = "MAGIC RESIST";
    let magicResistIcon = document.createElement("span");
    magicResistIcon.className = "material-symbols-outlined";
    magicResistIcon.innerHTML = "token";
    let magicResistFullBar = document.createElement("div");
    let magicResistSmallBar = document.createElement("span");
    magicResistFullBar.appendChild(magicResistSmallBar);
    let magicResistNumber = document.createElement("p");
    magicResistNumber.innerHTML = data.data[championName].stats.spellblock;
    magicResist.appendChild(magicResistWord);
    magicResist.appendChild(magicResistIcon);
    magicResist.appendChild(magicResistFullBar);
    magicResist.appendChild(magicResistNumber);
    stats.appendChild(magicResist);
    secondBox.appendChild(boxTitle);
    secondBox.appendChild(stats);
    championData.appendChild(secondBox);

    // slider third box

    let thirdBox = document.createElement("div");
    let Title = document.createElement("p");
    Title.innerHTML = "SKILLS";
    skillsArray = [];
    let skills = document.createElement("div");
    // passive Skill
    let passive = document.createElement("div");
    passive.classList.add("active");
    passive.dataset.name = "passive";
    passive.dataset.desc = data.data[championName].passive.description;
    passive.dataset.cooldown = "0";
    skillsArray.push(passive);
    let passiveImg = document.createElement("img");
    passiveImg.src = `https://ddragon.leagueoflegends.com/cdn/12.18.1/img/passive/${data.data[championName].passive.image.full}`;
    passive.appendChild(passiveImg);
    skills.appendChild(passive);
    data.data[championName].spells.forEach((spell, index) => {
      let spellDiv = document.createElement("div");
      spellDiv.dataset.name = spell.name;
      spellDiv.dataset.desc = data.data[championName].spells[index].description;
      spellDiv.dataset.cooldown =
        data.data[championName].spells[index].cooldownBurn;
      let spellImg = document.createElement("img");
      spellImg.src = `https://ddragon.leagueoflegends.com/cdn/12.18.1/img/spell/${data.data[championName].spells[index].image.full}`;
      spellDiv.appendChild(spellImg);
      skills.appendChild(spellDiv);
      skillsArray.push(spellDiv);
    });
    let spellInfo = document.createElement("p");
    let spellName = document.createElement("p");
    spellName.appendChild(passive.cloneNode(true));
    spellName.append(passive.dataset.name);
    let spellDesc = document.createElement("p");
    spellDesc.innerHTML = passive.dataset.desc.replaceAll(/<.*?>/gi, "");
    let spellCd = document.createElement("p");
    spellCd.innerHTML = `<p>Cooldown:</p> ${passive.dataset.cooldown}`;
    spellInfo.appendChild(spellName);
    spellInfo.appendChild(spellDesc);
    spellInfo.appendChild(spellCd);
    // setting up skills description

    skillsArray.forEach((div) => {
      div.addEventListener("click", function () {
        skillsArray.forEach((div) => div.classList.remove("active"));
        this.classList.add("active");
        spellName.innerHTML = "";
        spellName.appendChild(this.cloneNode(true));
        spellName.append(this.dataset.name);
        spellDesc.innerHTML = this.dataset.desc.replaceAll(/<.*?>/gi, "");
        spellCd.innerHTML = `<p>Cooldown:</p>${this.dataset.cooldown}`;
      });
    });
    thirdBox.appendChild(Title);
    thirdBox.appendChild(skills);
    thirdBox.appendChild(spellInfo);
    championData.appendChild(thirdBox);
    dataContainer.appendChild(championData);

    // slider fourth box

    let fourthBox = document.createElement("div");
    let fourthBoxTitle = document.createElement("p");
    fourthBoxTitle.innerHTML = "SKINS";
    let skinsImgDiv = document.createElement("div");
    skinsImgDiv.classList.add("skinsDiv");
    let iconsDiv = document.createElement("div");
    iconsArray = [];
    data.data[championName].skins.forEach((skin, index) => {
      let skinImg = document.createElement("img");
      skinImg.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_${skin.num}.jpg`;
      if (index === 0) {
        skinsImgDiv.appendChild(skinImg);
      }
      let iconAndName = document.createElement("div");
      let skinName = document.createElement("p");
      skinName.innerHTML = skin.name;
      let iconDiv = document.createElement("div");
      iconDiv.appendChild(skinImg.cloneNode(true));
      if (index === 0) {
        iconDiv.classList.add("active");
      }
      iconsArray.push(iconDiv);
      iconAndName.appendChild(iconDiv);
      iconAndName.appendChild(skinName);
      iconsDiv.appendChild(iconAndName);
    });
    // setting up skinns gallary
    iconsArray.forEach((icon) => {
      icon.addEventListener("click", function () {
        iconsArray.forEach((icon) => icon.classList.remove("active"));
        this.classList.add("active");
        document.querySelector(
          "main .championData > div:nth-child(4) > div:nth-child(2) img"
        ).src = this.firstChild.src;
      });
    });

    fourthBox.appendChild(fourthBoxTitle);
    fourthBox.appendChild(skinsImgDiv);
    fourthBox.appendChild(iconsDiv);
    championData.appendChild(fourthBox);
    dataContainer.appendChild(championData);

    // setting up the slider arrows
    let leftArrowIcon = document.createElement("span");
    leftArrowIcon.className = "material-symbols-outlined";
    leftArrowIcon.innerText = "arrow_back_ios";
    leftArrowIcon.classList.add("left");
    leftArrowIcon.classList.add("disabled");
    let rightArrowIcon = document.createElement("span");
    rightArrowIcon.className = "material-symbols-outlined";
    rightArrowIcon.innerText = "arrow_forward_ios";
    rightArrowIcon.classList.add("right");
    championData.appendChild(leftArrowIcon);
    championData.appendChild(rightArrowIcon);

    // setting up the slider functionality
    let boxsCounter = 1;
    document.querySelectorAll("main .championData > span").forEach((arrow) => {
      arrow.addEventListener("click", function () {
        if (arrow.classList.contains("right")) {
          document
            .querySelector("main .championData > div:nth-child(1)")
            .style.setProperty("margin-left", `calc(-104% *${boxsCounter}`);
          boxsCounter++;
          if (boxsCounter > 1) {
            leftArrowIcon.classList.remove("disabled");
          }
          if (boxsCounter === 4) {
            rightArrowIcon.classList.add("disabled");
          }
        } else {
          boxsCounter--;
          document
            .querySelector("main .championData > div:nth-child(1)")
            .style.setProperty("margin-left", `calc(-104% *${boxsCounter - 1}`);
          if (boxsCounter === 1) {
            leftArrowIcon.classList.add("disabled");
          }
          if (boxsCounter < 4) {
            rightArrowIcon.classList.remove("disabled");
          }
        }
      });
    });
  } catch (error) {
    dataContainer.innerHTML = "";
    let chmapionInvalidInput = document.createElement("p");
    chmapionInvalidInput.classList.add("invalidInput");
    chmapionInvalidInput.innerHTML = "INVALID CHAMPION NAME";
    dataContainer.appendChild(chmapionInvalidInput);
  }
}
