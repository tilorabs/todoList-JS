let thursdayDate;
let week;

window.onload = function() {
    thursdayDate = new Date();
    initDateEvents();
    initCalendar(thursdayDate);
    setWeek();
    setDate();
}

const initCalendar = ((date) => {
    thursdayDate = thursdayOfDate(date); //this thursday
    week = calendarWeek(thursdayDate); //this calendar week
    //set date value here will be an endless loop: onchange -> initCalender -> onchange ....
    const weekdays = getCalenderWeekDays();
    renderCalenderWeekDays(weekdays);
    initDOMEvents();
});

const setWeek = (() => {
    const weekOutput = document.getElementById("week");
    weekOutput.innerText = week + " / 52";
});

const setDate = (() => {
    const currDate = document.getElementById("dtDate");
    currDate.valueAsDate = thursdayDate;
});

const initDateEvents = (() => {
    const prevWeek = document.querySelector(".fa-angle-left");
    prevWeek.addEventListener("click", () => {
        thursdayDate.setDate(thursdayDate.getDate() - 7);
        initCalendar(thursdayDate);
        setDate();
        setWeek();
    });

    const nextWeek = document.querySelector(".fa-angle-right");
    nextWeek.addEventListener("click", () => {
        thursdayDate.setDate(thursdayDate.getDate() + 7);
        initCalendar(thursdayDate);
        setDate();
        setWeek();
    });

    const currDate = document.getElementById("dtDate");
    currDate.addEventListener("change", () => {
        const input = currDate.value;
        if(input === "") {
            thursdayDate = new Date();
        } else {
            let[year, month, day] = input.split("-"); //stores separate strings in single variables
            thursdayDate = new Date(year, month - 1 , day);
        }
        initCalendar(thursdayDate);
        setWeek();
    });
});

const initDOMEvents = (() => {
    const txtAreas = document.querySelectorAll(".datecontent");
    txtAreas.forEach((txtArea) => {
        txtArea.style.height = (txtArea.scrollHeight) + "px"; //if page loads
        textAreaEvent(txtArea);
    })

    const stars = document.querySelectorAll(".fa-star-o, .fa-star");
    stars.forEach((star) => {
        starEvent(star);
    })

    const checks = document.querySelectorAll(".fa-square-o, .fa-check-square-o");
    checks.forEach((check) => {
        checkEvent(check);
    })

    const trashbin = document.querySelectorAll(".fa-trash-o")
    trashbin.forEach((trash) => {
        trashEvent(trash);
    });

    const inputs = document.querySelectorAll(".addNewEntry");
    inputs.forEach((input) => {
        input.addEventListener("keypress", (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                let newInput = input.value;
                input.nextElementSibling.appendChild(inputNodelist(newInput));
            }
        });
    });
});

const textAreaEvent = ((textArea) => {
        textArea.addEventListener("input", () => {
            textArea.style.height = (textArea.scrollHeight) + "px"; //if input event changes text
    });
});

const starEvent = ((star) => {
    star.addEventListener("click", () => {
        if (star.classList.contains("fa-star-o")) {
            star.classList.remove("fa-star-o");
            star.classList.add("fa-star");
            //star.parentNode.parentNode.style.backgroundColor = "hsla(63, 100%, 80%, 0.8)";
            star.parentNode.parentNode.style.backgroundImage = "url('img/strike.svg')"; 
            star.parentNode.parentNode.style.backgroundRepeat = "no-repeat"; 
            star.parentNode.parentNode.style.backgroundPosition = "0% 10%"; 
            star.parentNode.parentNode.style.backgroundSize = "contain"; 
        } else {
            star.classList.add("fa-star-o");
            star.classList.remove("fa-star");
            star.parentNode.parentNode.style.background = "transparent";
        }
    });
});

const checkEvent = ((check) => {
    check.addEventListener("click", () => {
        if (check.classList.contains("done")) {
            check.classList.add("fa-square-o");
            check.classList.remove("fa-check-square-o");
            check.classList.remove("done");
            check.nextElementSibling.readOnly = false;
            check.nextElementSibling.classList.remove("linethrough");
        } else {
            check.classList.remove("fa-square-o");
            check.classList.add("fa-check-square-o");
            check.classList.add("done");
            check.nextElementSibling.readOnly = true;
            check.nextElementSibling.classList.add("linethrough");
        }
    });
});

const trashEvent = ((trash) => {
    trash.addEventListener("click", (event) => {
        const mod = document.getElementById("trashConfirm");
        mod.style.display = "block";
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        //console.log(mouseX +':'+ mouseY);
        let dialogX = mouseX - 440;
        let dialogY = mouseY - 230;
        mod.style.top = dialogY + "px";
        if(document.body.clientWidth >= 900) {
            mod.style.left = dialogX + "px";
        } 
        else {
            mod.style.left = "50%";
            mod.style.transform = "translate(-50%,0%)";
        } 
        const btnYes = document.getElementById("removeYes");
        //removeEventListener after addEventListener does not work with anonymous function, only named function (= callback function)
        //https://www.mediaevent.de/javascript/add-event-listener-arguments.html
        //once: guaranteed addEventListener only once
        function deleteElement() {
            trash.parentNode.parentNode.remove();
            mod.style.display = "none";
            btnYes.removeEventListener("click", deleteElement);
            btnNo.removeEventListener("click", closeDialog);
        }
        function closeDialog() {
            mod.style.display = "none";
            btnYes.removeEventListener("click", deleteElement);
            btnNo.removeEventListener("click", closeDialog);
        }
        btnYes.addEventListener("click", deleteElement,{once:true});
        const btnNo = document.getElementById("removeNo");
        btnNo.addEventListener("click", closeDialog,{once:true});
    });
});

//Nodelist because ul.innerHTML for inserting new li removes already existing event handlers in ul
const inputNodelist = ((newInput) => {
    let linode = document.createElement("li");
    let divNode = document.createElement("div");
    let squareNode = document.createElement("span");
    squareNode.classList.add("fa");
    squareNode.classList.add("fa-square-o");
    checkEvent(squareNode);
    let starNode = document.createElement("span");
    starNode.classList.add("fa");
    starNode.classList.add("fa-star-o");
    starEvent(starNode);
    let trashNode = document.createElement('span');
    trashNode.classList.add("fa");
    trashNode.classList.add("fa-trash-o");
    trashEvent(trashNode);
    let textNode = document.createTextNode(newInput);
    let textareaNode = document.createElement("textarea");
    textAreaEvent(textareaNode);
    textareaNode.appendChild(textNode);
    divNode.appendChild(squareNode);
    divNode.appendChild(textareaNode);
    divNode.appendChild(starNode);
    divNode.appendChild(trashNode);
    linode.appendChild(divNode);
    return linode;
});

//Die erste Woche des Jahres ist definiert als die Woche, in die mindestens 4 der ersten 7 Januartage fallen, 
//also die Woche, in der der 4. Januar liegt bzw. - gleichbedeutend - der erste Donnerstag
//http://www.salesianer.de/util/kalwoch.html
function thursdayOfDate(date) {
    var thursday = new Date();
    thursday.setTime(date.getTime() + (3-((date.getDay()+6) % 7)) * 86400000);
    return thursday;
}

function calendarWeek(date) {
    thursdayCalWeek = thursdayOfDate(new Date(date.getFullYear(),0,4)); // first thursday of the year
    calWeek = Math.floor(1.5+(date.getTime()-thursdayCalWeek.getTime())/86400000/7);
    return calWeek;
}

function getCalenderWeekDays() {
    let dateArray = new Array();
    let monday = new Date(thursdayDate.getFullYear(), thursdayDate.getMonth(), thursdayDate.getDate() - 3);
    let tuesday = new Date(thursdayDate.getFullYear(), thursdayDate.getMonth(), thursdayDate.getDate() - 2);
    let wednesday = new Date(thursdayDate.getFullYear(), thursdayDate.getMonth(), thursdayDate.getDate() - 1);
    let friday = new Date(thursdayDate.getFullYear(), thursdayDate.getMonth(), thursdayDate.getDate() + 1);
    let saturday = new Date(thursdayDate.getFullYear(), thursdayDate.getMonth(), thursdayDate.getDate() + 2);
    let sunday = new Date(thursdayDate.getFullYear(), thursdayDate.getMonth(), thursdayDate.getDate() + 3);
    dateArray.push(monday);
    dateArray.push(tuesday);
    dateArray.push(wednesday);
    dateArray.push(thursdayDate);
    dateArray.push(friday);
    dateArray.push(saturday);
    dateArray.push(sunday);
    return dateArray;
}

function renderCalenderWeekDays(weekdays) {
    const sections = document.querySelectorAll(".dateelement");
    sections.forEach((section) => {
        section.remove();
    })

    weekdays.forEach((weekday) => {
        //here load data for a day from localstorage
        addSection(weekday);
    })
}

const addSection = ((date) => {
    let section = `<section class="dateelement">
        <form>
            <h4>${date.toLocaleDateString('en-US', {weekday: 'long'})} ${date.toLocaleDateString()}</h4> 
            <input type="text" class="addNewEntry" name="txtNewEntry" placeholder="! Enter confirms bullet point !"/>
            <ul>
                <li>
                    <div>
                        <span class="fa fa-square-o"></span>
                        <textarea class="datecontent">Highlighting this bullet point</textarea>
                        <span class="fa fa-star-o"></span>
                        <span class="fa fa-trash-o"></span>
                    </div>
                </li>
                <li>
                    <div>
                        <span class="fa fa-square-o"></span>
                        <textarea class="datecontent">Click line to edit</textarea>
                        <span class="fa fa-star-o"></span>
                        <span class="fa fa-trash-o"></span>
                    </div>
                </li>
                <li>
                    <div>
                        <span class="fa fa-square-o"></span>
                        <textarea class="datecontent">This task is finished</textarea>
                        <span class="fa fa-star-o"></span>
                        <span class="fa fa-trash-o"></span>
                    </div>
                </li>
            </ul>  
        </form>
    </section>`;
    document.getElementById("main").innerHTML += section;
});