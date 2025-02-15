// User service UUID: Change this to your generated service UUID
const USER_SERVICE_UUID         = '7db1ecee-39da-4795-a170-38b94918c03b'; // LED, Button
// User service characteristics
const LED_CHARACTERISTIC_UUID   = 'E9062E71-9E62-4BC6-B0D3-35CDCD9B027B';
const BTN_CHARACTERISTIC_UUID   = '62FBD229-6EDD-4D1A-B554-5C4E1BB29169';

// PSDI Service UUID: Fixed value for Developer Trial
const PSDI_SERVICE_UUID         = 'E625601E-9E55-4597-A598-76018A0D293D'; // Device ID
const PSDI_CHARACTERISTIC_UUID  = '26E2B12B-85F0-4F3F-9FDD-91D114270E6E';

// UI settings
let ledState = false; // true: LED on, false: LED off
let clickCount = 0;

// -------------- //
// On window load //
// -------------- //
window.onload = function (e) {
    // init で初期化。基本情報を取得。
    // https://developers.line.me/ja/reference/liff/#initialize-liff-app
    liff.init(function (data) {
        initializeApp(data);
    });

};

function initializeApp(data) {
    document.getElementById('languagefield').textContent = data.language;
    document.getElementById('viewtypefield').textContent = data.context.viewType;
    document.getElementById('useridfield').textContent = data.context.userId;
    document.getElementById('utouidfield').textContent = data.context.utouId;
    document.getElementById('roomidfield').textContent = data.context.roomId;
    document.getElementById('groupidfield').textContent = data.context.groupId;
}

// ----------------- //
// Handler functions //
// ----------------- //
const SOUND_PATH = "https://soundeffect-lab.info/sound/voice/mp3/line-girl1/line-girl1-otsukaresamadesu1.mp3";


function handlerToggleLed() {
    ledState = !ledState;

    uiToggleLedButton(ledState);
    liffToggleDeviceLedState(ledState);
}

// ------------ //
// UI functions //
// ------------ //

function uiToggleLedButton(state) {
    const el = document.getElementById("btn-led-toggle");
    el.innerText = state ? "トレーニング開始" : "トレーニング終了";
    const elCal = document.getElementById("cal-count");
    const elCount = document.getElementById("click-count");
    
    

    if (state) {
        el.classList.add("led-on");
        
        liff.sendMessages([
            {
                type:'text',
                text: elCount.textContent + 'ぐらい飛んだよー' + elCal.textContent + "ぐらい消費したよー"
            }

        ])
        .then(() => {
            console.log('message sent');
        })
        .catch((err) => {
            console.log('error', err);
        });
        liff.closeWindow();

    } else {
        el.classList.remove("led-on");
        elCal.innerText = "0kcal";
        elCount.innerText = "0";
    }
}

function uiCountPressButton() {
    clickCount++;

    const el = document.getElementById("click-count");
    const elCal = document.getElementById("cal-count");
    const elGender = document.getElementById("gender");
    const elWeight = document.getElementById("weight-text");
    const elAge = document.getElementById("age-text");


    //const elweight = document.getElementById("weight-text");
    //if (clickCount % 5 ==0) {
    if (clickCount == 10) {
        //10回
        //https://soundeffect-lab.info/sound/voice/mp3/info-girl1/info-girl1-zyu1.mp3
        //https://iizuka2019.github.io/line-things-starter/liff-app/10.mp3
        var audio1 = new Audio("https://iizuka2019.github.io/line-things-starter/liff-app/10.mp3");
        //audio1.play();

        //回
        //https://soundeffect-lab.info/sound/voice/mp3/info-girl1/info-girl1-kai1.mp3
        var audio2 = new Audio("https://iizuka2019.github.io/line-things-starter/liff-app/infovoicekai.mp3");
        //audio2.play();

        //経過
        //https://soundeffect-lab.info/sound/voice/mp3/info-girl1/info-girl1-keika1.mp3
        var audio3 = new Audio("https://iizuka2019.github.io/line-things-starter/liff-app/infovoicekeika.mp3");
        //audio3.play();
        
        var audio4 = new Audio("https://soundeffect-lab.info/sound/voice/mp3/line-girl1/line-girl1-ganbare1.mp3");
//https://soundeffect-lab.info/sound/voice/mp3/line-girl1/line-girl1-ganbare1.mp3
        audio1.play();
        audio1.addEventListener("ended",function(){
        audio2.play();
        audio2.addEventListener("ended", function(){
        audio3.play();
        audio3.addEventListener("ended", function(){
        audio4.play();
        }, false);
        }, false);
        }, false);
        
        //var audio = new Audio(SOUND_PATH);
        //audio.play();
    }
    if (clickCount == 20 || clickCount == 30 || clickCount == 40 || clickCount == 50) {
        var audio4 = new Audio("https://soundeffect-lab.info/sound/voice/mp3/line-girl1/line-girl1-ganbare1.mp3");
        audio4.play();
        
    }
    //体重【kg】×0.1532×時間【分】×補正係数
    //75×0.1532×10×0.96    
    el.innerText = clickCount + "回";
    
        
    // form要素内のラジオボタングループ(name="hoge")を取得
    var radioNodeList = elGender.genders ;
    // 選択状態の値(value)を取得 (Bが選択状態なら"b"が返る)
    var selGender = radioNodeList.value ;

    if( selGender == "male") {
        if(elAge.value >= 30 || elAge.value <= 39 ){
            elCal.innerText = Math.round(elWeight.value * 0.1532 * (clickCount/2/60) * 0.96) + "kcal" ;
        }
    }else {
        elCal.innerText = Math.round(elWeight.value * 0.1532 * (clickCount/2/60) * 0.87) + "kcal" ;
    }    
}

function uiToggleStateButton(pressed) {
    const el = document.getElementById("btn-state");

    if (pressed) {
        //el.classList.add("pressed");
        //el.innerText = "Pressed";
    } else {
        //el.classList.remove("pressed");
        //el.innerText = "Released";
    }
}

function uiToggleDeviceConnected(connected) {
    const elStatus = document.getElementById("status");
    const elControls = document.getElementById("controls");

    elStatus.classList.remove("error");

    if (connected) {
        // Hide loading animation
        uiToggleLoadingAnimation(false);
        // Show status connected
        elStatus.classList.remove("inactive");
        elStatus.classList.add("success");
        elStatus.innerText = "LINEと接続中";
        // Show controls
        elControls.classList.remove("hidden");
    } else {
        // Show loading animation
        uiToggleLoadingAnimation(true);
        // Show status disconnected
        elStatus.classList.remove("success");
        elStatus.classList.add("inactive");
        elStatus.innerText = "LINEと未接続";
        // Hide controls
        elControls.classList.add("hidden");
    }
}

function uiToggleLoadingAnimation(isLoading) {
    const elLoading = document.getElementById("loading-animation");

    if (isLoading) {
        // Show loading animation
        elLoading.classList.remove("hidden");
    } else {
        // Hide loading animation
        elLoading.classList.add("hidden");
    }
}

function uiStatusError(message, showLoadingAnimation) {
    uiToggleLoadingAnimation(showLoadingAnimation);

    const elStatus = document.getElementById("status");
    const elControls = document.getElementById("controls");

    // Show status error
    elStatus.classList.remove("success");
    elStatus.classList.remove("inactive");
    elStatus.classList.add("error");
    elStatus.innerText = message;

    // Hide controls
    elControls.classList.add("hidden");
}

function makeErrorMsg(errorObj) {
    return "Error\n" + errorObj.code + "\n" + errorObj.message;
}

// -------------- //
// LIFF functions //
// -------------- //

function initializeApp() {
    liff.init(() => initializeLiff(), error => uiStatusError(makeErrorMsg(error), false));
}

function initializeLiff() {
    liff.initPlugins(['bluetooth']).then(() => {
        liffCheckAvailablityAndDo(() => liffRequestDevice());
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffCheckAvailablityAndDo(callbackIfAvailable) {
    // Check Bluetooth availability
    liff.bluetooth.getAvailability().then(isAvailable => {
        if (isAvailable) {
            uiToggleDeviceConnected(false);
            callbackIfAvailable();
        } else {
            uiStatusError("Bluetooth not available", true);
            setTimeout(() => liffCheckAvailablityAndDo(callbackIfAvailable), 10000);
        }
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });;
}

function liffRequestDevice() {
    liff.bluetooth.requestDevice().then(device => {
        liffConnectToDevice(device);
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffConnectToDevice(device) {
    device.gatt.connect().then(() => {
        //document.getElementById("device-name").innerText = device.name;
        //document.getElementById("device-id").innerText = device.id;

        // Show status connected
        uiToggleDeviceConnected(true);

        // Get service
        device.gatt.getPrimaryService(USER_SERVICE_UUID).then(service => {
            liffGetUserService(service);
        }).catch(error => {
            uiStatusError(makeErrorMsg(error), false);
        });
        device.gatt.getPrimaryService(PSDI_SERVICE_UUID).then(service => {
            liffGetPSDIService(service);
        }).catch(error => {
            uiStatusError(makeErrorMsg(error), false);
        });

        // Device disconnect callback
        const disconnectCallback = () => {
            // Show status disconnected
            uiToggleDeviceConnected(false);

            // Remove disconnect callback
            device.removeEventListener('gattserverdisconnected', disconnectCallback);

            // Reset LED state
            ledState = false;
            // Reset UI elements
            uiToggleLedButton(false);
            uiToggleStateButton(false);

            // Try to reconnect
            initializeLiff();
        };

        device.addEventListener('gattserverdisconnected', disconnectCallback);
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffGetUserService(service) {
    // Button pressed state
    service.getCharacteristic(BTN_CHARACTERISTIC_UUID).then(characteristic => {
        liffGetButtonStateCharacteristic(characteristic);
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });

    // Toggle LED
    service.getCharacteristic(LED_CHARACTERISTIC_UUID).then(characteristic => {
        window.ledCharacteristic = characteristic;

        // Switch off by default
        liffToggleDeviceLedState(false);
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffGetPSDIService(service) {
    // Get PSDI value
    service.getCharacteristic(PSDI_CHARACTERISTIC_UUID).then(characteristic => {
        return characteristic.readValue();
    }).then(value => {
        // Byte array to hex string
        const psdi = new Uint8Array(value.buffer)
            .reduce((output, byte) => output + ("0" + byte.toString(16)).slice(-2), "");
        //20190715
        //document.getElementById("device-psdi").innerText = psdi;
        
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffGetButtonStateCharacteristic(characteristic) {
    // Add notification hook for button state
    // (Get notified when button state changes)
    characteristic.startNotifications().then(() => {
        characteristic.addEventListener('characteristicvaluechanged', e => {
            const val = (new Uint8Array(e.target.value.buffer))[0];
            if (val > 0) {
                // press
                uiToggleStateButton(true);
            } else {
                // release
                uiToggleStateButton(false);
                uiCountPressButton();
            }
        });
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffToggleDeviceLedState(state) {
    // on: 0x01
    // off: 0x00
    window.ledCharacteristic.writeValue(
        state ? new Uint8Array([0x01]) : new Uint8Array([0x00])
    ).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}
