const servIpTitle = document.querySelector("#serv-ip");
const servUp = document.querySelector("#status");
const playerTemp = document.querySelector("template#player")
const playerList = document.querySelector(".player-list")
const urlParams = new URLSearchParams(window.location.search);
const servIP = urlParams.get("ip");
const error = urlParams.get("error");
const servPort = urlParams.get("port") ? urlParams.get("port") : 25565;
const cachedat = document.querySelector("#cachedat")

let loaded = false;

console.log("url info", servIP, servPort)

async function getStats() {
    const servStats = await fetch(`https://mc-api.io/server/JAVA/${servIP}`);
    const servStatsJson  = await servStats.json();
    return servStatsJson;
}

function showServInput() {
    document.querySelector(".section-player-list").style.display = "none";
        document.querySelector("#status").style.display = "none";

        document.querySelector("#submit").style.display = "block";
        document.querySelector("#serv-in").style.display = "block";

        document.querySelector("#submit").addEventListener("click", () => {
            document.location.href= "?ip=" + document.querySelector("#serv-in").value;
        })
}

function showServInputWithError() {
    document.querySelector(".error-list").style.display ="flex";
    showServInput();

}

async function showServInfo() {
    if (error !== null) {
        console.log("error")
        showServInputWithError();
        return null;
    }

    if (!servIP) {
        showServInput();              
        return null;
    }

    
    const servStats = await getStats();
    console.log("servStats", servStats);
    
    console.log("serv", servStats["status"]);

    if (!loaded) {
        servIpTitle.textContent = servIP;
        servIpTitle.style.display = "block";
        window.typeWriter(servIpTitle);
    }
    servUp.innerHTML = "up: <span>" + servStats["online"] + "</span> players: " + servStats["onlinePlayers"] + "/" + servStats["maxPlayers"];
    if (servStats["online"] == true){
        servUp.classList.remove("down");
    }

    cachedat.innerHTML = "Last checked: " + (new Date(servStats["cachedAt"])).toLocaleTimeString("en-US");
    
    playerList.innerHTML = "";
    for (const playerName of servStats["players"]){
        newPlayer = playerTemp.content.cloneNode(true);
        newPlayer.querySelector("#player-name").innerHTML = playerName
        newPlayer.querySelector("img").src = "https://api.mcheads.org/head/" + playerName + "/64"
        playerList.appendChild(newPlayer);
    }

    loaded = true;
    
    if (servStats["protocol"] == -1) {
        let tempError = document.createElement("p");
        tempError.innerHTML = "😢: Unknown protocol";
        playerList.appendChild(tempError);
    }
}

showServInfo();
setInterval(showServInfo, 30000);