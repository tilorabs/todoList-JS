window.onload = function() {
    let today = new Date();
    console.log(today.toLocaleDateString());
    //http://www.salesianer.de/util/kalwoch.html
    thursdayDate = thursday(today);
    yearCalWeek = thursdayDate.getFullYear();
    thursdayCalWeek = thursday(new Date(yearCalWeek,0,4));
    calWeek = Math.floor(1.5+(thursdayDate.getTime()-thursdayCalWeek.getTime())/86400000/7)
    console.log(calWeek);
}

function thursday(date) {
    var thursday = new Date();
    thursday.setTime(date.getTime() + (3-((date.getDay()+6) % 7)) * 86400000);
    return thursday;
}

const inputs = document.querySelectorAll(".addNewEntry");
    inputs.forEach((input) => {
        input.addEventListener("keypress", (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                let bulletPoint = input.value;
                let listBulletPoint = addInputInnerHTML(bulletPoint);
                input.nextElementSibling.innerHTML += listBulletPoint;
                //Using innerHTML to rewrite element content will destroy the handlers defined on it
                addAllEvents(); //todo: optimize
            }
        });
    });

const addInputInnerHTML = ((newInput) => {
    return `<li>
                <div>
                    <span class="fa fa-square-o"></span>
                    <textarea>${newInput}</textarea>
                    <span class="fa fa-star-o"></span>
                    <span class="fa fa-trash-o"></span>
                </div>
            </li>`;
});

/* const addInputNodelist = ((newInput) => {
    let linode = document.createElement("li");
    let divNode = document.createElement("div");
    let textareaNode = document.createElement("textarea");
    let squareNode = document.createElement("span");
    let starNode = document.createElement("span");
    let trashNode = document.createElement('span');
    let textNode = document.createTextNode(newInput);
}); */

const starEvent = ((star) => {
    star.addEventListener("click", () => {
        if (star.classList.contains("fa-star-o")) {
            star.classList.remove("fa-star-o");
            star.classList.add("fa-star");
            star.parentNode.parentNode.style.backgroundColor = "hsla(63, 100%, 80%, 0.8)";
        } else {
            star.classList.add("fa-star-o");
            star.classList.remove("fa-star");
            star.parentNode.parentNode.style.background = "transparent";
        }
    });
});

const tickEvent = ((tick) => {
    tick.addEventListener("click", () => {
        if (tick.classList.contains("done")) {
            tick.classList.add("fa-square-o");
            tick.classList.remove("fa-check-square-o");
            tick.classList.remove("done");
            tick.nextElementSibling.classList.remove("linethrough");
        } else {
            tick.classList.remove("fa-square-o");
            tick.classList.add("fa-check-square-o");
            tick.classList.add("done");
            tick.nextElementSibling.classList.add("linethrough");
        }
    });
});

const trashEvent = ((trash) => {
    trash.addEventListener("click", (event) => {
        const mod = document.getElementById("trashConfirm");
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        //console.log(mouseX +':'+ mouseY);
        let dialogX = mouseX - 300;
        let dialogY = mouseY - 150;
        mod.style.top = dialogY + "px";
        mod.style.left = dialogX + "px";
        mod.style.display = "block";
        const btnYes = document.getElementById("removeYes");
        btnYes.addEventListener("click", () => {
            trash.parentNode.parentNode.remove();
            mod.style.display = "none";
        })
        const btnNo = document.getElementById("closeDialog");
        btnNo.addEventListener("click", () => {
            mod.style.display = "none";
        })
    })
});

const addAllEvents = (() => {
    const stars = document.querySelectorAll(".fa-star-o, .fa-star");
    stars.forEach((star) => {
        starEvent(star);
    })

    const tickbox = document.querySelectorAll(".fa-square-o, .fa-check-square-o");
    tickbox.forEach((tick) => {
        tickEvent(tick);
    })

    const trashbin = document.querySelectorAll(".fa-trash-o")
    trashbin.forEach((trash) => {
        trashEvent(trash);
    });
});

addAllEvents();