let thursdayDate; //still undefined
let week;

window.onload = function() {
    thursdayDate = new Date();
    initDateEvents(); //adds events to button previous/next week and datepicker
    initCalendar(thursdayDate); //calculate and render weekdays
    setWeek(); //set week output
    setDate(); //set datetime picker output
    loadTasks(); //loads localstorage data, builds list items and add events (inputNodelist() for each list item and initDOMEvents() for new entry)
}

const initCalendar = ((date) => {
    thursdayDate = thursdayOfDate(date); //this thursday
    week = calendarWeek(thursdayDate); //this calendar week
    //set date value here will be an endless loop: onchange -> initCalender -> onchange ....
    const weekdays = getCalenderWeekDays();
    renderCalenderWeekDays(weekdays);
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
        saveTasks();
        thursdayDate.setDate(thursdayDate.getDate() - 7);
        initCalendar(thursdayDate);
        loadTasks();
        setDate();
        setWeek();
    });

    const nextWeek = document.querySelector(".fa-angle-right");
    nextWeek.addEventListener("click", () => {
        saveTasks();
        thursdayDate.setDate(thursdayDate.getDate() + 7);
        initCalendar(thursdayDate);
        loadTasks();
        setDate();
        setWeek();
    });

    const currDate = document.getElementById("dtDate");
    currDate.addEventListener("change", () => {
        saveTasks();
        const input = currDate.value;
        if(input === "") {
            thursdayDate = new Date();
        } else {
            let[year, month, day] = input.split("-"); //stores separate strings in single variables
            thursdayDate = new Date(year, month - 1 , day);
        }
        initCalendar(thursdayDate);
        loadTasks();
        setWeek();
    });
});

const initDOMEvents = (() => {
    const txtAreas = document.querySelectorAll(".datecontent");
    txtAreas.forEach((txtArea) => {
        txtArea.style.height = (txtArea.scrollHeight) + "px"; //if page loads
    })

    /* was for testing, now added individually with function inputNodelist
    txtAreas.forEach((txtArea) => {
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
    */

    const inputs = document.querySelectorAll(".addNewEntry");
    inputs.forEach((input) => {
        input.addEventListener("keypress", (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                let newInput = input.value;
                input.nextElementSibling.appendChild(inputNodelist(newInput));
                saveTasks();
                input.value = '';
            }
        });
        //for animation start and stop use class="ball"
        const ani = input.previousElementSibling;
        input.addEventListener("focus", () => {
            const balls = ani.querySelectorAll("span");
            balls.forEach((ball) => {
                ball.classList.add("ball");
            })
        });
        input.addEventListener("focusout", () => {
            const balls = ani.querySelectorAll("span");
            balls.forEach((ball) => {
                ball.classList.remove("ball");
            })
        });
    });
});

const textAreaEvent = ((textArea) => {
    textArea.addEventListener("input", () => {
        textArea.style.height = (textArea.scrollHeight) + "px"; //if input event changes text
    });
});

const textAreaAnimEvent = ((textArea) => {
    //for animation start and stop use class="ball", separatly because in inputNodelist there are no parents available
    const ani = textArea.parentNode.parentNode.parentNode.previousElementSibling.previousElementSibling;
    textArea.addEventListener("focus", () => {            
        const balls = ani.querySelectorAll("span");
        balls.forEach((ball) => {
            ball.classList.add("ball");
        })
    });
    textArea.addEventListener("focusout", () => {
        const balls = ani.querySelectorAll("span");
        balls.forEach((ball) => {
            ball.classList.remove("ball");
        })
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
        function deleteElement() { //for yes button
            trash.parentNode.parentNode.remove();
            mod.style.display = "none";
            btnYes.removeEventListener("click", deleteElement);
            btnNo.removeEventListener("click", closeDialog);
        }
        function closeDialog() { //for no button
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
    textareaNode.classList.add("datecontent");
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
    let monday = new Date(thursdayDate.getFullYear(), thursdayDate.getMonth(), thursdayDate.getDate() - 3); //new Date(2022, 6, 11);
    let tuesday = new Date(thursdayDate.getFullYear(), thursdayDate.getMonth(), thursdayDate.getDate() - 2);
    let wednesday = new Date(thursdayDate.getFullYear(), thursdayDate.getMonth(), thursdayDate.getDate() - 1);
    let friday = new Date(thursdayDate.getFullYear(), thursdayDate.getMonth(), thursdayDate.getDate() + 1);
    let saturday = new Date(thursdayDate.getFullYear(), thursdayDate.getMonth(), thursdayDate.getDate() + 2);
    let sunday = new Date(thursdayDate.getFullYear(), thursdayDate.getMonth(), thursdayDate.getDate() + 3);
    return [monday, tuesday, wednesday, thursdayDate, friday, saturday, sunday];
}

function renderCalenderWeekDays(weekdays) {
    const sections = document.querySelectorAll(".dateelement");
    sections.forEach((section) => {
        section.remove();
    })
    weekdays.forEach((weekday) => {
        addSection(weekday);
    })
}

const addSection = ((date) => {
    //for adding events: <span class="fa fa-trash-o" onclick="trashEvent()"> or nodes
    let section = `
    <section class="dateelement" id="${date.toLocaleDateString()}">
        <form>
            <h4>${date.toLocaleDateString('en-US', {weekday: 'long'})} ${date.toLocaleDateString()}</h4>
            <div class="ani">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <input type="text" class="addNewEntry" name="txtNewEntry" placeholder="! Enter confirms bullet point !"/>
            <ul></ul>  
        </form>
    </section>`;
    document.getElementById("main").innerHTML += section;
});

/* local Storage data structure
    key => [
            [content=text1, done=true, highlighted=true]
            [content=text2, done=false, highlighted=false]
    ]
    22.06.22 => [
            [content=text1, done=true, highlighted=true]
            [content=text2, done=false, highlighted=false]
    ]
*/
function saveTasks() {
    const weekDays = getCalenderWeekDays(); // gets whole week
    let done;
    let highlighted;
    let content = '';
    let saveValues;
    weekDays.forEach((weekDay) => {
        saveValues = [];
        const key = weekDay.toLocaleDateString();
        const section = document.getElementById(key);
        const textAreaContents = section.querySelectorAll(".datecontent");
        textAreaContents.forEach((textAreaContent) => {
            done = false;
            highlighted = false;
            let divnode = textAreaContent.parentNode;
            if(divnode.querySelector(".fa-square-o, .fa-check-square-o").classList.contains("done")) { 
                done = true;
            }
            if(divnode.querySelector(".fa-star-o, .fa-star").classList.contains("fa-star")) {
                highlighted = true;
            }
            content = divnode.querySelector("textarea").value;
            saveValues.push([content, done, highlighted]);
        });
        const stringValues = JSON.stringify(saveValues);
        localStorage.setItem(key, stringValues);
    });
};

//todo: simplify double code in functions (DRY), but better readable at the moment
function loadTasks() {
    localStorageSize();
    const weekDays = getCalenderWeekDays(); // gets whole week
    weekDays.forEach((weekDay) => {
        const key = weekDay.toLocaleDateString();
        const section = document.getElementById(key);
        const stringValues = localStorage.getItem(key);
        const values = JSON.parse(stringValues);
        if(values === null)
            return;
        const ulnode = section.querySelector("ul");
        for(let i = 0; i < values.length;i++) {
            if(stringValues !== null) {
                let linode = inputNodelist(values[i][0]);
                ulnode.appendChild(linode);
                let divnode = linode.querySelector("div");
                let textarea = divnode.children[1];
                textAreaAnimEvent(textarea);
                if(values[i][1] === true) {
                    let done = divnode.children[0];
                    done.classList.remove(...done.classList);
                    done.classList.add("fa");
                    done.classList.add("fa-check-square-o");
                    done.classList.add("done");
                    done.nextElementSibling.readOnly = true;
                    done.nextElementSibling.classList.add("linethrough");
                }
                if(values[i][2] === true) {
                    let highlight = divnode.children[2];
                    highlight.classList.remove(...highlight.classList);
                    highlight.classList.add("fa");
                    highlight.classList.add("fa-star");
                    highlight.parentNode.parentNode.style.backgroundImage = "url('img/strike.svg')";
                    highlight.parentNode.parentNode.style.backgroundRepeat = "no-repeat";
                    highlight.parentNode.parentNode.style.backgroundPosition = "0% 10%";
                    highlight.parentNode.parentNode.style.backgroundSize = "contain";
                }
            }
        }
    });
    initDOMEvents();
}

function localStorageSize() {
    const warning = document.getElementById("warning");
    let size = JSON.stringify(localStorage).length;
    const units = ['Bytes', 'KB', 'MB'];
    let unitIndex = 0;
    while(size >= 1024 && ++unitIndex) {
        size = size/1024;
    }
    let sizeString = size.toFixed(unitIndex > 0 ? 2 : 0) + ' ' + units[unitIndex];
    warning.innerText = "~" + sizeString + " used in local storage memory"; //utf-16 format
    warning.style.display = "block";
}