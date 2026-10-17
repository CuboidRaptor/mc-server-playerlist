const servIpTitle = document.querySelector("#serv-ip");
const servUp = document.querySelector("#status");
const playerTemp = document.querySelector("template#player")
const playerList = document.querySelector(".player-list")
const favicon = document.querySelector("#favicon");
const servIcon = document.querySelector("img#serv-icon");
const urlParams = new URLSearchParams(window.location.search);
const servIP = urlParams.get("ip");
const error = urlParams.get("error");
const servPort = urlParams.get("port") ? urlParams.get("port") : 25565;

servIpTitle.innerHTML = servIP;

console.log("url info", servIP, servPort)

async function getStats() {
    const servStats = await fetch(`https://mcapi.us/server/status?ip=${servIP}&port=${servPort}`);
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

    if (await servStats["status"] == "success"){
        servIpTitle.style.display = "block";
        servUp.innerHTML = "up : <span>" + servStats["online"] + "</span>  now : " + servStats["players"]["now"] + "  max : " + servStats["players"]["max"];
        if (servStats["online"] == true){
            servUp.classList.remove("down");
        }
        
        playerList.innerHTML = "";
        for (const playerInfo of servStats["players"]["sample"] ){
            newPlayer = playerTemp.content.cloneNode(true);
            newPlayer.querySelector("#player-name").innerHTML = playerInfo["name"]
            newPlayer.querySelector("img").src = "https://mc-heads.net/avatar/" + playerInfo["name"]
            playerList.appendChild(newPlayer);
        }

        favicon.href = servStats["favicon"];
        servIcon.src = servStats["favicon"];
    }
    else if (servStats["status"] == "error") {
        console.log("Redirect error");
        document.location.href="?error";
    }
    
    if (servStats["server"]["protocol"] == -1) {
        let tempError = document.createElement("p");
        tempError.innerHTML = "😢: Unknown protocol";
        playerList.appendChild(tempError);
    }
}

showServInfo();
