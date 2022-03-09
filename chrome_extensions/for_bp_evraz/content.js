// Inform the background page that 
// this tab should have a page-action.
chrome.runtime.sendMessage({
  from: 'content',
  subject: 'showPageAction',
});

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function log(res) {
	console.log(res);
	window.open("https://eu.cloudcall.kz/card/v2/?phone="+res?.data?.interactions[0]?.phone_number + "&giid=" + res?.data?.interactions[0]?.global_id + "&agentId=" + res?.data.agent_id);
}

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {

  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
	
	setTimeout(()=>{ 
		bpspat.api.getState(log); 
	
	}, 2600);
  }
});



let bpspat = window.bpspat || {};

bpspat.api = (function () {

    let origin;
    let targetWindow;
    let listeners = [
        'STATE_CHANGED',
        'INTERACTION_RENDERED',
        'INTERACTION_COMPLETED',
        'LOGIN_CHANGED',
        'CALL_RECORDING_STATUS',
        'SCREEN_RECORDING_STATUS',
        '_I_CALL_OFFERED',
        '_I_CALL_ANSWERED',
        '_O_CALL_DIALING',
        '_O_CALL_CONNECTED',
        '_CALL_HELD',
        '_CALL_RESUMED',
        '_CALL_ENDED',
        '_BLIND_TRANSFER',
        '_CONSULT_TRANSFER',
    ];
    let callbacks = {};
    let requestId = 0;

    function postWindowMessage(request, callback) {
        if (targetWindow) {
            if (callback) {
                registerCallback(request, callback);
            }

            targetWindow.contentWindow.postMessage(JSON.stringify(request), "*");
        }
    }

    function registerCallback(request, callback) {
        let method = request.command;
        if (listeners.includes(method)) {
            if (callbacks[method]) {
                callbacks[method].push(callback);
            } else {
                callbacks[method] = [callback];
            }
        } else {
            // API methods that are not listeners needs an ID in case they are call multiple times in an async manner.
            request.request_id = String(requestId++);
            callbacks['#' + request.request_id] = [callback];
        }
        return method;
    }

    function invokeCallbacks(data) {
        let type = data.command.toUpperCase();
        let reqId = data.request_id;
        if (!!reqId) {
            type = "#" + reqId;
        }
        for (let methodName in callbacks) {
            if (callbacks.hasOwnProperty(methodName) && type === methodName) {
                for (let i in callbacks[type]) {
                    if (callbacks[type].hasOwnProperty(i)) {
                        callbacks[type][i](data);
                    }
                }
                if (!listeners.includes(type)) {
                    delete callbacks[type];
                }
            }
        }
    }

    window.addEventListener("message", function (data) {
        if (data.origin === origin) {
            try {
                let parse = JSON.parse(data.data);
                if (!!parse) {
                    invokeCallbacks(parse);
                }
            } catch (e) {

            }
        }
    });

    return {

        init: function (value) {
            origin = value;

            if(targetWindow) {
                targetWindow.parent.removeChild(targetWindow);
                targetWindow = null;
            }

            targetWindow = document.createElement("iframe");
            targetWindow.style.position = "absolute";
            targetWindow.src = origin + '/agentdesktop/AgentDesktopSdkProxy.jsp';
            targetWindow.style.top = "-1000px";

            let body = document.getElementsByTagName("body")[0];
            if(body) {
                body.appendChild(targetWindow);
            } else {
                console.error("init() needs to be invoked after page load, or from inside <body>");
            }
        },

        //Agent Status

        getState: function (callback) {
            postWindowMessage({
                command: 'GET_STATE'
            }, callback);
        },

        setStatus: function (state, reason) {
            postWindowMessage({
                command: 'CHANGE_STATE',
                data: {
                    state: state,
                    reason: reason
                }
            });
        },

        //Dialing, transfers

        dialNumber: function (number) {
            postWindowMessage({
                command: 'DIAL_NUMBER',
                number: number
            });
        },

        logout: function () {
            postWindowMessage({
                command: 'LOGOUT'
            });
        },

        selectService: function (name) {
            postWindowMessage({
                command: 'SELECT_SERVICE',
                data: name
            });
        },

        singleStepConference: function (number) {
            postWindowMessage({
                command: 'SINGLE_STEP_CONFERENCE',
                number: number
            });
        },

        singleStepTransfer: function (number) {
            postWindowMessage({
                command: 'SINGLE_STEP_TRANSFER',
                number: number
            });
        },

        //Completing and terminating an interaction

        setDisposition: function (item_id, code) {
            postWindowMessage({
                command: 'SET_DISPOSITION',
                item_id: item_id,
                code: code
            });
        },

        setDispositionByName: function (item_id, name) {
            postWindowMessage({
                command: 'SET_DISPOSITION_BY_NAME',
                item_id: item_id,
                name: name
            });
        },

        postVariable: function (item_id, name, value) {
            postWindowMessage({
                command: 'POST_VARIABLE',
                item_id: item_id,
                name: name,
                value: value
            });
        },

        setRescheduleWindow: function(item_id, phone_number, from_date, to_date, timezone) {
            postWindowMessage({
                command: 'SET_RESCHEDULE_WINDOW',
                item_id: item_id,
                from_date: from_date,
                to_date: to_date,
                phone_number: phone_number,
                timezone: timezone,
            });
        },

        setNotes: function (item_id, notes) {
            postWindowMessage({
                command: 'SET_NOTES',
                item_id: item_id,
                notes: notes
            });
        },

        terminateInteraction: function (item_id) {
            postWindowMessage({
                command: 'TERMINATE_INTERACTION_FROM_API',
                data: item_id,
            });
        },

        getCallRecordingStatus: function (item_id) {
            postWindowMessage({
                command: 'CALL_RECORDING_STATUS',
                item_id: item_id
            });
        },

        startCallRecording: function (item_id) {
            postWindowMessage({
                command: 'START_CALL_RECORDING',
                item_id: item_id
            });
        },

        stopCallRecording: function (item_id) {
            postWindowMessage({
                command: 'STOP_CALL_RECORDING',
                item_id: item_id
            });
        },

        muteCallRecording: function (item_id) {
            postWindowMessage({
                command: 'MUTE_CALL_RECORDING',
                item_id: item_id
            });
        },

        unmuteCallRecording: function (item_id) {
            postWindowMessage({
                command: 'UNMUTE_CALL_RECORDING',
                item_id: item_id
            });
        },

        muteCallRecordings: function () {
            postWindowMessage({
                command: 'MUTE_CALL_RECORDINGS'
            });
        },

        unmuteCallRecordings: function () {
            postWindowMessage({
                command: 'UNMUTE_CALL_RECORDINGS'
            });
        },

        getScreenRecordingStatus: function (item_id) {
            postWindowMessage({
                command: 'SCREEN_RECORDING_STATUS',
                item_id: item_id
            });
        },

        muteScreenRecording: function (item_id) {
            postWindowMessage({
                command: 'MUTE_SCREEN_RECORDING',
                item_id: item_id
            });
        },

        unmuteScreenRecording: function (item_id) {
            postWindowMessage({
                command: 'UNMUTE_SCREEN_RECORDING',
                item_id: item_id
            });
        },

        stopScreenRecording: function (item_id) {
            postWindowMessage({
                command: 'STOP_SCREEN_RECORDING',
                item_id: item_id
            });
        },

        muteScreenRecordings: function () {
            postWindowMessage({
                command: 'MUTE_SCREEN_RECORDINGS'
            });
        },

        unmuteScreenRecordings: function () {
            postWindowMessage({
                command: 'UNMUTE_SCREEN_RECORDINGS'
            });
        },

        completeInteraction: function (item_id) {
            postWindowMessage({
                command: 'COMPLETE_INTERACTION_FROM_API',
                data: item_id,
            });
        },

        completeInteractionWithDisp: function (item_id, code, notes) {
            postWindowMessage({
                command: 'COMPLETE_INTERACTION_WITH_DISPOSITION',
                item_id: item_id,
                code: code,
                notes: notes
            });
        },

        //Events

        addAgentLoginHandler: function (callback) {
            registerCallback({command: 'LOGIN_CHANGED'}, callback);
        },

        addInteractionRenderedHandler: function (callback) {
            registerCallback({command: 'INTERACTION_RENDERED'}, callback);
        },

        addInteractionCompletedHandler: function (callback) {
            registerCallback({command: 'INTERACTION_COMPLETED'}, callback);
        },

        addStatusChangeHandler: function (callback) {
            registerCallback({command: 'STATE_CHANGED'}, callback);
        },

        addInboundCallOfferedHandler: function (callback) {
            registerCallback({command: '_I_CALL_OFFERED'}, callback);
        },

        addInboundCallAnsweredHandler: function (callback) {
            registerCallback({command: '_I_CALL_ANSWERED'}, callback);
        },

        addOutboundCallDialingHandler: function (callback) {
            registerCallback({command: '_O_CALL_DIALING'}, callback);
        },

        addOutboundCallConnectedHandler: function (callback) {
            registerCallback({command: '_O_CALL_CONNECTED'}, callback);
        },

        addCallEndedHandler: function (callback) {
            registerCallback({command: '_CALL_ENDED'}, callback);
        },

        addCallHoldedHandler: function (callback) {//for compatibility
            registerCallback({command: '_CALL_HELD'}, callback);
        },

        addCallHeldHandler: function (callback) {
            registerCallback({command: '_CALL_HELD'}, callback);
        },

        addCallResumedHandler: function (callback) {
            registerCallback({command: '_CALL_RESUMED'}, callback);
        },

        addBlindTransferHandler: function (callback) {
            registerCallback({command: '_BLIND_TRANSFER'}, callback);
        },

        addConsultTransferHandler: function (callback) {
            registerCallback({command: '_CONSULT_TRANSFER'}, callback);
        },

        addCallRecordingStatusHandler: function (callback) {
            registerCallback({command: 'CALL_RECORDING_STATUS'}, callback);
        },

        addScreenRecordingStatusHandler: function (callback) {
            registerCallback({command: 'SCREEN_RECORDING_STATUS'}, callback);
        },

    };

})();

bpspat.api.init('https://demov5_kz.hostedcc.ru');

//setTimeout(()=>{ bpspat.api.getState(log); }, 2200);

