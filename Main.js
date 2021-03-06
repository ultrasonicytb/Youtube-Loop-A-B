var click = true;
var click2 = true;
var popupContainer;
var country_code = document.getElementById('country-code').innerHTML;
var table;
var data;
var loop;

function startup() {
    document.getElementById('country-code').innerHTML = "MOD"; // Replace the country code with MOD (just for fun)
    createPopup();
    addButton();
}

function addButton() {
    if (!document.body.contains(document.getElementById("Button-YtL-a-b"))) {
        var player_bar_left = document.getElementsByClassName('ytp-left-controls');
        var image = browser.runtime.getURL("imgs/b-to-a.png");
        var button = `<button id="Button-YtL-a-b" class = "playerButton ytp-button" title = "Create a repeat sequence" aria-label = "Create a repeat sequence">
                            <img id = "Button-YtL-a-b-image" class = "YtL-Button-Image" src = "${image}"></img>
                        </button>`
        player_bar_left[0].insertAdjacentHTML("beforeend", button);
        document.getElementById("Button-YtL-a-b").addEventListener("click", showPopup);
    }
}

function giveCurrentTime(elem, to) {
    /* 
    Get the current time of the player (given in seconds with milliseconds)
    Transform the current time into a string with the format 'h,m:s.ms'

    The parameter 'elem' equals to the wrappedJSObject of the player
    The parameter 'to' equals to a text input
    */
    var nb = elem.getCurrentTime() // get current time in seconds with milliseconds (ex : 20.25896)
    nb = nb * 100000 // transform the current time into milliseconds
    var str = ''
    if (nb >= 60 * 60 * 100000) {
        str += Math.floor(nb / (60 * 60 * 100000)).toString() + ',';
        nb = nb % (60 * 60 * 100000)
    } // if the time exceed one hour, convert the miliseconds into hour(s) and and keep the remaining of the miliseconds
    if (nb >= 60 * 100000) {
        str += Math.floor(nb / (60 * 100000)).toString() + ':';
        nb = nb % (60 * 100000)
    }else{str += '0:'} // if the time exceed one minute, convert the miliseconds into minute(s) and and keep the remaining of the miliseconds else add 0 to the end of the string
    if (nb >= 100000) {
        str += Math.floor(nb / (100000)).toString();
        nb = nb % (100000)
    }else{str += '0'} // if the time exceed one second, convert the miliseconds into second(s) and and keep the remaining of the miliseconds else add 0 to the end of the string
    if (nb > 0) {
        str += '.' + Math.floor(nb).toString();
    } // the remaining miliseconds
    to.value = str;
}

function decodeCurrentTime(str) {
    /*
    Get the string repesenting the time created by the giveCurrentTime function
    Transform the string to a float repesenting the time in seconds with milliseconds
    
    The parameter 'str' is a string created by the giveCurrentTime function
    */
    nb = 0
    if (str.includes(',')) {
        nb += parseInt(str.split(',')[0]) * (60 * 60)
        str = str.split(',')[1]
    } // if the string has one hour or more then we convert it to seconds
    if (str.includes(':')) {
        nb += parseInt(str.split(':')[0]) * (60) + parseFloat(str.split(':')[1])
    }     
    return nb // convert the minutes into seconds and adding the rest of the seconds and milliseconds to the final number if there is no minutes add the seconds and milliseconds
}

function loop_video(button, elem, time, start, end) {
    /* the main function
    This function create a Interval object calling the checkTime function
    if the button is clicked then the checkTime function will be called 
    if the button is clicked an another time it clears the interval
    
    The parameter button is the button to activate the loop
    The parameter elem is the wrappedJSObject of the player
    The parameter time is the milliseconds to wait to execute the checkTime function by the Interval
    The parameter start is the start of the loop
    The parameter end is the end of the loop
    */
    if (click2) {
        loop = setInterval(checkTime, time, elem, start, end, document.URL)
        button.textContent = 'Unloop !'
        click2 = false;
    } else {
        clearInterval(loop)
        button.textContent = 'Loop !'
        click2 = true;
    }
}

function callback1() {
    giveCurrentTime(data, document.getElementById('YtL-time1'))
}

function callback2() {
    giveCurrentTime(data, document.getElementById('YtL-time2'))
}

function callback3() {
    var time;
    var custom = document.getElementById('YtL-Custom-input');
    document.getElementsByName('YtL-test').forEach(element => {
        if (element.checked) {
            if (element.labels[0].innerHTML === 'High'){
                time = 50
            }else if (element.labels[0].innerHTML === 'Medium'){
                time = 150
            }else{
                time = 300
            }
        }
    })
    if (time === undefined && !isNaN(parseInt(custom.value))){
        time = parseInt(custom.value)
    }
    if (time === undefined){
        time = 100
    }
    console.log('bruh')
    loop_video(
        document.getElementById('YtL-Loop-Button'),
        data,
        time,
        decodeCurrentTime(document.getElementById('YtL-time1').value),
        decodeCurrentTime(document.getElementById('YtL-time2').value))
}

function createPopup() {
    if (!document.body.contains(document.getElementById('YtL-a-b-PopupContainer'))) {
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", browser.runtime.getURL("code.css"))
        document.getElementsByTagName("head")[0].appendChild(fileref)
        var video_player = document.getElementById("movie_player");
        popupContainer = document.createElement('div');
        var all = `<table id = "YtL-a-b-Table">
                        <tr class = 'YtL-Row'>
                            <td>
                                <img id = "Table-YtL-a-b-logo">
                                <span class = "YtL-popup-text">Youtube Loop A-B</span>
                            </td>
                        </tr>
                        <tr class = 'YtL-Row' style = 'height: 50px;'>
                            <td>
                                <span class = "YtL-popup-text">Choose your timings :</span>
                            </td>	
                        </tr>
                        <tr>
                            <td>
                                <span id = "YtL-current1" class = "YtL-span-button">Current</span>
                                <input id = "YtL-time1" class = "YtL-popup-input" type = 'text'>
                                <span class = "YtL-popup-text" >to</span>
                                <input id = "YtL-time2"  class = "YtL-popup-input" type = 'text'>
                                <span id = "YtL-current2" class = "YtL-span-button">Current</span>
                            </td>
                        </tr>
                        <td>
                            <input id = "YtL-radio-button1" class = "YtL-radio-button" type="radio" name="YtL-test"><label for="YtL-radio-button1" >High</label>
                            <input id = "YtL-radio-button2" class = "YtL-radio-button" type="radio" name="YtL-test"><label for = "YtL-radio-button2" >Medium</label>
                            <input id = "YtL-radio-button3" class = "YtL-radio-button" type="radio" name="YtL-test"><label for = "YtL-radio-button3" >Low</label>
                            <input id = "YtL-Custom-input" class = "YtL-popup-input" type="text" placeholder = "Custom (in ms)"></input>
                            <button id = "YtL-Loop-Button" class = "YtL-Button" >Loop !</button>
                        </td>
                    </table>`
        popupContainer.id = 'YtL-a-b-PopupContainer';
        popupContainer.insertAdjacentHTML("beforeend", all);
        video_player.appendChild(popupContainer);
        document.getElementById('Table-YtL-a-b-logo').src = browser.runtime.getURL("imgs/b-to-a.png");
        table = document.getElementById('YtL-a-b-Table');
        table.style.display = 'None';
        data = window.wrappedJSObject.document.getElementById("movie_player")
        document.getElementById('YtL-time1').addEventListener('keydown',function (event) {event.stopPropagation();});
        document.getElementById('YtL-time2').addEventListener('keydown',function (event) {event.stopPropagation();});
        document.getElementById('YtL-Custom-input').addEventListener('keydown',function (event) {
            event.stopPropagation();
            document.getElementsByName('YtL-test').forEach(element => {element.checked = false})
        });
        document.getElementById('YtL-current1').addEventListener("click", callback1);
        document.getElementById('YtL-current2').addEventListener("click", callback2);
        document.getElementById('YtL-Loop-Button').addEventListener("click", callback3);

    }
}

function delete_elems(){
    clearInterval(loop)
    document.getElementById('YtL-a-b-PopupContainer').remove();
    document.getElementById("Button-YtL-a-b").remove();
    document.getElementById('country-code').innerHTML = country_code;

}

function showPopup() {
    if (click) {
        table.style.display = 'unset';
        click = false;
    } else {
        table.style.display = 'None';
        click = true;
    }
}

function checkTime(element, start, end, url){
    /*
    The function checks the current time of the player
    If the current time exceed the boundaries (|start -> end|) it puts the video to the start time 
    
    The parameter elem is the wrappedJSObject of the player
    The parameter start is the start of the loop
    The parameter end is the end of the loop
    The parameter url is the url of the video
    */
    if (element.getCurrentTime() < start){
        element.seekTo(start);
    }
    if (element.getCurrentTime() > end){
        element.seekTo(start);
    }
    if (url != document.URL){
        click2 = true;
        document.getElementById('YtL-Loop-Button').textContent = 'Loop !'
        clearInterval(loop)
    }
}

browser.runtime.onMessage.addListener((message) => {
    if (message.command === 'run'){
        startup()
    }else if (message.command === 'stop'){
        delete_elems()
    }else if (message.command === 'loaded'){
        if (document.body.contains(document.getElementById("Button-YtL-a-b")) && document.body.contains(document.getElementById("YtL-a-b-PopupContainer"))){
            browser.runtime.sendMessage({
                result: true
            })
        }else{
            browser.runtime.sendMessage({
                result: false
            })
        }
    }
})
