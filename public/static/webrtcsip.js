// We make use of this 'server' variable to provide the address of the
// REST Janus API. By default, in this example we assume that Janus is
// co-located with the web server hosting the HTML pages but listening
// on a different port (8088, the default for HTTP in Janus), which is
// why we make use of the 'window.location.hostname' base address. Since
// Janus can also do HTTPS, and considering we don't really want to make
// use of HTTP for Janus if your demos are served on HTTPS, we also rely
// on the 'window.location.protocol' prefix to build the variable, in
// particular to also change the port used to contact Janus (8088 for
// HTTP and 8089 for HTTPS, if enabled).
// In case you place Janus behind an Apache frontend (as we did on the
// online demos at http://janus.conf.meetecho.com) you can just use a
// relative path for the variable, e.g.:
//
// 		var server = "/janus";
//
// which will take care of this on its own.
//
//
// If you want to use the WebSockets frontend to Janus, instead, you'll
// have to pass a different kind of address, e.g.:
//
// 		var server = "ws://" + window.location.hostname + ":8188";
//
// Of course this assumes that support for WebSockets has been built in
// when compiling the server. WebSockets support has not been tested
// as much as the REST API, so handle with care!
//
//
// If you have multiple options available, and want to let the library
// autodetect the best way to contact your server (or pool of servers),
// you can also pass an array of servers, e.g., to provide alternative
// means of access (e.g., try WebSockets first and, if that fails, fall
// back to plain HTTP) or just have failover servers:
//
//		var server = [
//			"ws://" + window.location.hostname + ":8188",
//			"/janus"
//		];
//
// This will tell the library to try connecting to each of the servers
// in the presented order. The first working server will be used for
// the whole session.
//
var server = "wss://xcx.ldin.cc:18989";

var webrstc2sipThat;
var janus = null;
var sipcall = null;
var opaqueId = "siptest-" + Janus.randomString(12);

var spinner = null;

var selectedApproach = "secret";


var incoming = null;

var od = null;




let janusObj = {
    extension: extension, //坐席
    WebIP: fsinternal, //id
    freeswitchport: freeswitchport, //端口
    pass: extensionpassword,
    sipserver: `sip:${this.fshost}:${this.freeswitchport}`,
    username: `sip:${this.extension}@${this.fshost}:${this.freeswitchport}`,
    //sipserver: "sip:192.168.1.39:2280",
    //username: "sip:cs001@192.168.1.39:2280"
}
console.log(janusObj.WebIP, janusObj.username)
Object.freeze(janusObj);
console.log(janusObj.sipserver, janusObj.username);
// toastr.options = {
// 	closeButton: false,
// 	debug: false,
// 	progressBar: false,
// 	positionClass: "toast-top-center",
// 	onclick: null,
// 	showDuration: "300",
// 	hideDuration: "1000",
// 	timeOut: "1000",
// 	extendedTimeOut: "1000",
// 	showEasing: "swing",
// 	hideEasing: "linear",
// 	showMethod: "fadeIn",
// 	hideMethod: "fadeOut"
// };  

window.onload = (function () {

    //初始化参数
    var mm = {
        debug: "all",
        callback: function () {
            // Use a button to start the demo yhy
            // $('#start').one('click', function() {
            //	$(this).attr('disabled', true).unbind('click');
            // Make sure the browser supports WebRTC
            if (!Janus.isWebrtcSupported()) {
                //alert("");
                console.log("No WebRTC support... 1111111111111111111111")
                return;
            }

            // Create session
            // 注册话机、通话事件、呼叫等配置
            janus = new Janus({
                server: server,
                iceServers: [{ urls: "turn:36.156.154.131:3478", username: "tyc", credential: "123456" }],
                success: function () {
                    // Attach to echo test plugin
                    sipstatu = 0;
                    janus.attach({
                        plugin: "janus.plugin.sip",
                        //opaqueId: od || opaqueId,
                        opaqueId: opaqueId,
                        success: function (pluginHandle) {
                            //console.log(this.opaqueId, 99999999999);
                            od = this.opaqueId;

                            sipcall = pluginHandle;
                            Janus.log("Plugin attached! (" + sipcall.getPlugin() + ", id=" + sipcall.getId() + ")");


                            //自动注册;
                            if (auToRegisterUsername) {

                                registerUsername();
                            }
                            //sipcall.offerlessInvite
                        },
                        error: function (error) {

                            Janus.error("错误原因:", error);
                            //alert("错误原因: " + error);
                            console.log(error)
                        },
                        consentDialog: function (on) {

                            Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
                            if (on) {
                                // Darken screen and show hint
                                //$.blockUI({
                                //	message: '<div>566<img src="up_arrow.png"/></div>',
                                //	css: {
                                //		border: 'none',
                                //		padding: '15px',
                                //		backgroundColor: 'transparent',
                                //		color: '#aaa',
                                //		top: '10px',
                                //		left: (navigator.mozGetUserMedia ? '-100px' : '300px')
                                //	}
                                //});
                            } else {
                                // Restore screen
                                //$.unblockUI();
                            }
                        },
                        mediaState: function (medium, on) {
                            Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
                        },
                        webrtcState: function (on) {
                            Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                            //$("#videoleft").parent().unblock();
                        },
                        onmessage: function (msg, jsep) {
                            Janus.debug(" ::: Got a message :::");
                            Janus.debug(msg);
                            console.log(msg, jsep);
                            // Any error?
                            var error = msg["error"];
                            if (error != null && error != undefined) {
                                if (!registered) {
                                    $('#server').removeAttr('disabled');
                                    $('#username').removeAttr('disabled');
                                    //yhy $('#authuser').removeAttr('disabled');
                                    //$('#displayname').removeAttr('disabled');
                                    $('#password').removeAttr('disabled');
                                    $('#register').removeAttr('disabled').click(registerUsername);
                                    $('#registerset').removeAttr('disabled');
                                } else {
                                    // Reset status
                                    sipcall.hangup();
                                    $('#dovideo').removeAttr('disabled').val('');
                                    //$('#peer').removeAttr('disabled').val('');
                                    $('#call').removeAttr('disabled').html('Call')
                                        .removeClass("btn-danger").addClass("btn-success")
                                        .unbind('click');
                                }
                                //alert(error);
                                console.log(error)
                                return;
                            }
                            var result = msg["result"];
                            if (result !== null && result !== undefined && result["event"] !== undefined && result["event"] !== null) {
                                var event = result["event"];
                                if (event === 'registration_failed') {
                                    Janus.warn("Registration failed: " + result["code"] + " " + result["reason"]);
                                    //console.log("话机注册失败:账号或密码不正确");
                                    $('#server').removeAttr('disabled');
                                    $('#username').removeAttr('disabled');
                                    //yhy $('#authuser').removeAttr('disabled');
                                    //$('#displayname').removeAttr('disabled');
                                    $('#password').removeAttr('disabled');
                                    $('#register').removeAttr('disabled').click(registerUsername);
                                    $('#registerset').removeAttr('disabled');
                                    //alert(result["code"] + " " + result["reason"]);
                                    //console.log(result["code"] , result["reason"])
                                    return;
                                }
                                if (event === 'registered') {

                                    Janus.log("Successfully registered as " + result["username"] + "!");
                                    //alert("注册成功")
                                    console.log("注册成功");
                                    $('#you').removeClass('hide').show().text("Registered as '" + result["username"] + "'");
                                    // TODO Enable buttons to call now
                                    if (!registered) {
                                        registered = true;
                                        $('#phone').removeClass('hide').show();
                                        $('#call').unbind('click');
                                        $('#peer').focus();
                                    }
                                } else if (event === 'calling') {
                                    //var comingcall = confirm("您有新的电话接入,是否接听");
                                    //if (!comingcall) {
                                    //	doHangup();
                                    //}
                                    //console.log("calling", 999998888);
                                    //$("#Dashboard_index7_calling_a ").css({ backgroundColor:"green" })

                                    $("#Dashboard_index7_calling_a text").text("拨打");
                                    Janus.log("Waiting for the peer to answer...");
                                    // TODO Any ringtone?
                                    $('#call').removeAttr('disabled').html('Hangup')
                                        .removeClass("btn-success").addClass("btn-danger")
                                        .unbind('click');
                                } else if (event === 'incomingcall') {
                                    //console.log("incomingcall", 999998888);
                                    //var comingcall = confirm("您有新的电话接入,是否接听");
                                    //if (!comingcall) {
                                    //	doHangup();
                                    //}
                                    //toastr.info("拨打中...");
                                    $("#bodastate7777777").text("拨打中...").css({ color: "#46b8da" })
                                    Janus.log("Incoming call22 from " + result["username"] + "!");
                                    var doAudio = true,
                                        doVideo = true;
                                    var offerlessInvite = false;
                                    if (jsep !== null && jsep !== undefined) {
                                        // What has been negotiated?
                                        doAudio = (jsep.sdp.indexOf("m=audio ") > -1);
                                        doVideo = (jsep.sdp.indexOf("m=video ") > -1);
                                        Janus.debug("Audio " + (doAudio ? "has" : "has NOT") + " been negotiated");
                                        Janus.debug("Video " + (doVideo ? "has" : "has NOT") + " been negotiated");
                                    } else {
                                        Janus.log("This call doesn't contain an offer... we'll need to provide one ourselves");
                                        offerlessInvite = true;
                                        // In case you want to offer video when reacting to an offerless call, set this to true
                                        doVideo = false;
                                    }
                                    // Any security offered? A missing "srtp" attribute means plain RTP
                                    var rtpType = "";
                                    var srtp = result["srtp"];
                                    if (srtp === "sdes_optional")
                                        rtpType = " (SDES-SRTP offered)";
                                    else if (srtp === "sdes_mandatory")
                                        rtpType = " (SDES-SRTP mandatory)";
                                    // Notify user
                                    //bootbox.hideAll();
                                    var extra = "";
                                    if (offerlessInvite)
                                        extra = " (no SDP offer provided)"
                                    incoming = null; //yhy �Զ�Ӧ��
                                    //var body = { "request": "decline" };
                                    //sipcall.send({"message": body});		
                                    //yhy $('#peer').val(result["username"]).attr('disabled', true);
                                    var myuser = "";
                                    myuser = result["username"].substring(4);
                                    myuser = myuser.substring(0, myuser.indexOf('@'));
                                    $('#peer').val(myuser);
                                    //console.log('jsep',jsep);
                                    // Notice that we can only answer if we got an offer: if this was
                                    // an offerless call, we'll need to create an offer ourselves
                                    var sipcallAction = (offerlessInvite ? sipcall.createOffer : sipcall.createAnswer);
                                    console.log('11111111111111111', offerlessInvite, sipcallAction, jsep)
                                    sipcallAction({
                                        jsep: jsep,
                                        media: { audio: doAudio, video: doVideo },
                                        success: function (jsep) {
                                            Janus.debug("Got SDP " + jsep.type + "! audio=" + doAudio + ", video=" + doVideo);
                                            Janus.debug(jsep);
                                            var body = { request: "accept" };
                                            // Note: as with "call", you can add a "srtp" attribute to
                                            // negotiate/mandate SDES support for this incoming call.
                                            // The default behaviour is to automatically use it if
                                            // the caller negotiated it, but you may choose to require
                                            // SDES support by setting "srtp" to "sdes_mandatory", e.g.:
                                            //		var body = { request: "accept", srtp: "sdes_mandatory" };
                                            // This way you'll tell the plugin to accept the call, but ONLY
                                            // if SDES is available, and you don't want plain RTP. If it
                                            // is not available, you'll get an error (452) back. You can
                                            // also specify the SRTP profile to negotiate by setting the
                                            // "srtp_profile" property accordingly (the default if not
                                            // set in the request is "AES_CM_128_HMAC_SHA1_80")
                                            sipcall.send({ "message": body, "jsep": jsep });
                                            $('#call').removeAttr('disabled').html('Hangup')
                                                .removeClass("btn-success").addClass("btn-danger")
                                                .unbind('click');
                                        },
                                        error: function (error) {
                                            Janus.error("WebRTC error:", error);
                                            //alert("WebRTC error... " + JSON.stringify(error));
                                            console.log(JSON.stringify(error))
                                            // Don't keep the caller waiting any longer, but use a 480 instead of the default 486 to clarify the cause
                                            var body = { "request": "decline", "code": 480 };
                                            sipcall.send({ "message": body });
                                        }
                                    });
                                    //console.log('sipcallAction',1111111111111)
                                } else if (event === 'accepting') {
                                    //console.log("accepting", 999998888);
                                    // Response to an offerless INVITE, let's wait for an 'accepted'

                                } else if (event === 'progress') {
                                    $("#bodastate7777777").text("拨打中...").css({ color: "#46b8da" })
                                    Janus.log("There's early media from " + result["username"] + ", wairing for the call!");
                                    Janus.log(jsep);
                                    // Call can start already: handle the remote answer
                                    if (jsep !== null && jsep !== undefined) {
                                        sipcall.handleRemoteJsep({ jsep: jsep, error: doHangup });
                                    }

                                } else if (event === 'accepted') {
                                    //console.log("accepted", 999998888);
                                    nowDialing = true;
                                    //console.log(1213432132132)
                                    iphonestatue = 1;
                                    $("#Dashboard_index7_calling_a ").removeClass("btn-success").addClass("btn-danger")
                                    $("#Dashboard_index7_calling_a text").text("接通")
                                    $("#bodastate7777777").text("接通中...").css({ color: "#4cae4c" });
                                    $(webrstc2sipThat).attr("disabled", "disabled");
                                    $("#Dashboard_index7_calling_a")
                                        //.css("background-color", "#FFAC38")
                                        .css("border-radius", "4px")
                                        .attr("title", "拨号键盘")
                                        .unbind("click")
                                        .click(function () {
                                            //console.log(112121);
                                            doHangup();
                                            //$("#shuzipan").css({
                                            //	display: "block",
                                            //	top: 70,
                                            //	right: 180,

                                            //});
                                            //$("#shuzipan").focus();
                                        })

                                    //setTimefn();
                                    Janus.log(result["username"] + " accepted the call!");
                                    Janus.log(jsep);
                                    // Call can start, now: handle the remote answer
                                    if (jsep !== null && jsep !== undefined) {
                                        sipcall.handleRemoteJsep({ jsep: jsep, error: doHangup });
                                    };

                                    //toastr.success("接通中..."); 
                                } else if (event === 'hangup') {
                                    let msgObj = msg;
                                    console.log(msg.result.code, typeof msg.result.code);
                                    if (msg.result.code >= 400) {

                                        console.log("号码无法接通");
                                    }
                                    //PlayTipAudio();
                                    //msg.result.code
                                    iphonestatue = 0;
                                    nowDialing = false;
                                    //console.log("hangip1321324");
                                    $("#Dashboard_index7_calling_a ").removeClass("btn-danger").addClass("btn-success");
                                    //clearTimeout(falsetto);
                                    //toastr.error("挂断");
                                    $("#Dashboard_index7_calling_a text").text("挂断");
                                    $("#bodastate7777777").text("挂断").css({ color: "#d43f3a" });
                                    $(webrstc2sipThat).attr("disabled", null);
                                    if (incoming != null) {
                                        incoming.modal('hide');
                                        incoming = null;
                                    }
                                    Janus.log("Call hung up (" + result["code"] + " " + result["reason"] + ")!");
                                    //alert(result["code"] + " " + result["reason"]);
                                    // Reset status
                                    $("#Dashboard_index7_calling_a")
                                        //.css("background-color", "#FFAC38")
                                        .css("border-radius", "4px")
                                        .attr("title", "拨号键盘")
                                        .unbind("click")
                                        .click(function () {
                                            //console.log(112121)
                                            $("#shuzipan").css({
                                                display: "block",
                                                top: 70,
                                                right: 180,

                                            });
                                            $("#shuzipan").focus();
                                        })
                                    sipcall.hangup();
                                    $('#dovideo').removeAttr('disabled').val('');
                                    //$('#peer').removeAttr('disabled').val('');
                                    $('#call').removeAttr('disabled').html('Call')
                                        .removeClass("btn-danger").addClass("btn-success")
                                        .unbind('click');

                                }
                            }
                            //console.log(31212332)

                        },
                        onlocalstream: function (stream) {
                            //alert("dsds");
                            Janus.debug(" ::: Got a local stream :::");
                            Janus.debug(stream);
                            //$('#videos').removeClass('hide').show();
                            if ($('#myvideo').length === 0)
                                $('#videoleft').append('<video class="rounded centered" id="myvideo" width=320 height=240 autoplay playsinline muted="muted"/>');
                            Janus.attachMediaStream($('#myvideo').get(0), stream);
                            $("#myvideo").get(0).muted = "muted";
                            if (sipcall.webrtcStuff.pc.iceConnectionState !== "completed" &&
                                sipcall.webrtcStuff.pc.iceConnectionState !== "connected") {
                                $("#videoleft").parent().block({
                                    message: '<b>Calling...</b>',
                                    css: {
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        color: 'white'
                                    }
                                });
                                // No remote video yet
                                $('#videoright').append('<video class="rounded centered" id="waitingvideo" width=320 height=240 />');
                                if (spinner == null) {
                                    var target = document.getElementById('videoright');
                                    spinner = new Spinner({ top: 100 }).spin(target);
                                } else {
                                    spinner.spin();
                                }
                            }
                            var videoTracks = stream.getVideoTracks();
                            if (videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
                                // No webcam
                                $('#myvideo').hide();
                                if ($('#videoleft .no-video-container').length === 0) {
                                    /*$('#videoleft').append(
                                        '<div class="no-video-container">' +
                                            '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
                                            '<span class="no-video-text">No webcam available</span>' +
                                        '</div>');*/
                                }
                            } else {
                                $('#videoleft .no-video-container').remove();
                                $('#myvideo').removeClass('hide').show();
                            }
                        },
                        onremotestream: function (stream) {
                            Janus.debug(" ::: Got a remote stream :::");
                            Janus.debug(stream);
                            if ($('#remotevideo').length === 0) {
                                //$('#videoright').parent().find('h3').html('Send DTMF: <span id="dtmf" class="btn-group btn-group-xs"></span>');
                                $('#videoright').append(
                                    '<video class="rounded centered hide" id="remotevideo" width=320 height=240 autoplay playsinline/>');
                                for (var i = 0; i < 12; i++) {
                                    if (i < 10)
                                        $('#dtmf').append('<button class="btn btn-info dtmf">' + i + '</button>');
                                    else if (i == 10)
                                        $('#dtmf').append('<button class="btn btn-info dtmf">#</button>');
                                    else if (i == 11)
                                        $('#dtmf').append('<button class="btn btn-info dtmf">*</button>');
                                }
                                $('.dtmf').click(function () {
                                    // Send DTMF tone (inband)
                                    sipcall.dtmf({ dtmf: { tones: $(this).text() } });
                                    // Notice you can also send DTMF tones using SIP INFO
                                    // 		sipcall.send({message: {request: "dtmf_info", digit: $(this).text()}});
                                });
                                // Show the peer and hide the spinner when we get a playing event
                                $("#remotevideo").bind("playing", function () {
                                    $('#waitingvideo').remove();
                                    if (this.videoWidth)
                                        $('#remotevideo').removeClass('hide').show();
                                    if (spinner !== null && spinner !== undefined)
                                        spinner.stop();
                                    spinner = null;
                                });
                            }
                            Janus.attachMediaStream($('#remotevideo').get(0), stream);
                            var videoTracks = stream.getVideoTracks();
                            if (videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
                                // No remote video
                                $('#remotevideo').hide();
                                if ($('#videoright .no-video-container').length === 0) {
                                    /*$('#videoright').append(
                                        '<div class="no-video-container">' +
                                            '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
                                            '<span class="no-video-text">No remote video available</span>' +
                                        '</div>');*/
                                }
                            } else {
                                $('#videoright .no-video-container').remove();
                                $('#remotevideo').removeClass('hide').show();
                            }
                        },
                        oncleanup: function () {
                            Janus.log(" ::: Got a cleanup notification :::");
                            $('#myvideo').remove();
                            $('#waitingvideo').remove();
                            $('#remotevideo').remove();
                            $('.no-video-container').remove();
                            $('#videos').hide();
                            $('#dtmf').parent().html("Remote UA");
                        }
                    });
                },
                error: function (error) {
                    sipstatu = 1;
                    Janus.error(error);
                    //alert(连接服务器失败, function () {
                    //	//window.location.reload();
                    //	//重新初始化
                    //	Janus.init(mm);
                    //	console.log("chs")
                    //});
                    //layer.confirm("服务器连接超时，请重试！", function () {
                    //	layer.closeAll('dialog');
                    //})
                    initNum++;
                    if (initNum > 5) {
                        layer.confirm("服务器连接超时！", function () {
                            layer.closeAll('dialog');
                        })
                    } else {
                        setTimeout(() => {
                            Janus.init(mm);
                        }, 2000)
                    }

                    //console.log("chs");
                    //console.log("连接服务器失败");

                },
                destroyed: function () {
                    sipstatu = 2;
                    //window.location.reload();
                    //重新初始化
                    Janus.init(mm);
                }
            });

            //yhy });

        }


    }

    Janus.init(mm);



});

function checkEnter(field, event) {
    var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    if (theCode == 13) {
        if (field.id == 'server' || field.id == 'username' || field.id == 'password') // || field.id == 'displayname')
            registerUsername();
        else if (field.id == 'peer')
            doCall();
        return false;
    } else {
        return true;
    }
}

function senddtmf(dd) {
    sipcall.dtmf({ dtmf: { tones: dd } });
}
/**
 * 注册话机
 */
function registerUsername() {
    //console.log("dsad")
    if (selectedApproach === null || selectedApproach === undefined) {
        //alert("Please select a registration approach from the dropdown menu");
        return;
    }
    // Try a registration
    $('#server').attr('disabled', true);
    $('#username').attr('disabled', true);
    //yhy $('#authuser').attr('disabled', true);
    //$('#displayname').attr('disabled', true);
    $('#password').attr('disabled', true);
    $('#register').attr('disabled', true).unbind('click');
    $('#registerset').attr('disabled', true);
    // Let's see if the user provided a server address
    // 		NOTE WELL! Even though the attribute we set in the request is called "proxy",
    //		this is actually the _registrar_. If you want to set an outbound proxy (for this
    //		REGISTER request and for all INVITEs that will follow), you'll need to set the
    //		"outbound_proxy" property in the request instead. The two are of course not
    //		mutually exclusive. If you set neither, the domain part of the user identity
    //		will be used as the target of the REGISTER request the plugin might send.
    //var sipserver = $('#server').val(); 
    var sipserver = janusObj.sipserver
    //var sipserver = "sip:36.155.115.244:2280";
    if (sipserver !== "" && sipserver.indexOf("sip:") != 0 && sipserver.indexOf("sips:") != 0) {
        alert("Please insert a valid SIP server (e.g., sip:192.168.0.1:5060)");
        $('#server').removeAttr('disabled');
        $('#username').removeAttr('disabled');
        //yhy $('#authuser').removeAttr('disabled');
        //$('#displayname').removeAttr('disabled');
        $('#password').removeAttr('disabled');
        $('#register').removeAttr('disabled').click(registerUsername);
        $('#registerset').removeAttr('disabled');
        return;
    }
    if (selectedApproach === "guest") {
        // We're registering as guests, no username/secret provided
        var register = {
            "request": "register",
            "type": "guest"
        };
        if (sipserver !== "") {
            register["proxy"] = sipserver;
            // Uncomment this if you want to see an outbound proxy too
            //~ register["outbound_proxy"] = "sip:outbound.example.com";
        }
        /*var username = "sip:cs001@36.155.115.244:2280";*/
        var username = janusObj.username;
        //var username = $('#username').val();
        if (!username === "" || username.indexOf("sip:") != 0 || username.indexOf("@") < 0) {
            alert("Please insert a valid SIP address (e.g., sip:goofy@example.com): this doesn't need to exist for guests, but is required");
            $('#server').removeAttr('disabled');
            $('#username').removeAttr('disabled');
            $('#register').removeAttr('disabled').click(registerUsername);
            $('#registerset').removeAttr('disabled');
            return;
        }
        //register.force_udp = true;//yhy2019-08-07
        register.username = username;
        var displayname = username // $('#displayname').val();
        if (displayname) {
            register.display_name = displayname;
        }
        if (sipserver === "") {
            bootbox.confirm("You didn't specify a SIP Registrar to use: this will cause the plugin to try and conduct a standard (<a href='https://tools.ietf.org/html/rfc3263' target='_blank'>RFC3263</a>) lookup. If this is not what you want or you don't know what this means, hit Cancel and provide a SIP Registrar instead'",
                function (result) {
                    if (result) {
                        sipcall.send({ "message": register });
                        //console.log(register, 888888);
                    } else {
                        $('#server').removeAttr('disabled');
                        $('#username').removeAttr('disabled');
                        //yhy $('#authuser').removeAttr('disabled');
                        //$('#displayname').removeAttr('disabled');
                        $('#register').removeAttr('disabled').click(registerUsername);
                        $('#registerset').removeAttr('disabled');
                    }
                });
        } else {
            sipcall.send({ "message": register });
            //console.log(register, 888888);
        }
        return;
    }
    //var username = "sip:cs001@36.155.115.244:2280"
    var username = janusObj.username;
    if (username === "" || username.indexOf("sip:") != 0 || username.indexOf("@") < 0) {
        alert('Please insert a valid SIP identity address (e.g., sip:goofy@example.com)');
        $('#server').removeAttr('disabled');
        $('#username').removeAttr('disabled');
        $('#password').removeAttr('disabled');
        $('#register').removeAttr('disabled').click(registerUsername);
        $('#registerset').removeAttr('disabled');
        return;
    }
    var password = janusObj.pass
    if (password === "") {
        alert("Insert the username secret (e.g., mypassword)");
        $('#server').removeAttr('disabled');
        $('#username').removeAttr('disabled');
        $('#password').removeAttr('disabled');
        $('#register').removeAttr('disabled').click(registerUsername);
        $('#registerset').removeAttr('disabled');
        return;
    }
    var register = {
        "request": "register",
        "username": username
    };
    // By default, the SIP plugin tries to extract the username part from the SIP
    // identity to register; if the username is different, you can provide it here
    var authuser = username.substring(4, username.indexOf('@')); //yhy //yhy $('#authuser').val();
    if (authuser !== "") {
        register.authuser = authuser;
    }
    // The display name is only needed when you want a friendly name to appear when you call someone
    var displayname = authuser //	$('#displayname').val();
    if (displayname !== "") {
        register.display_name = displayname;
    }
    register.force_udp = true; //yhy2019-08-08
    if (selectedApproach === "secret") {
        // Use the plain secret
        register["secret"] = password;
    } else if (selectedApproach === "ha1secret") {
        var sip_user = username.substring(4, username.indexOf('@')); /* skip sip: */
        var sip_domain = username.substring(username.indexOf('@') + 1);
        register["ha1_secret"] = md5(sip_user + ':' + sip_domain + ':' + password);
    }
    if (sipserver === "") {
        bootbox.confirm("You didn't specify a SIP Registrar: this will cause the plugin to try and conduct a standard (<a href='https://tools.ietf.org/html/rfc3263' target='_blank'>RFC3263</a>) lookup. If this is not what you want or you don't know what this means, hit Cancel and provide a SIP Registrar instead'",
            function (result) {
                if (result) {
                    sipcall.send({ "message": register });
                    //console.log(register, 88888);
                } else {
                    $('#server').removeAttr('disabled');
                    $('#username').removeAttr('disabled');
                    //yhy $('#authuser').removeAttr('disabled');
                    //	$('#displayname').removeAttr('disabled');
                    $('#password').removeAttr('disabled');
                    $('#register').removeAttr('disabled').click(registerUsername);
                    $('#registerset').removeAttr('disabled');
                }
            });
    } else {
        register["proxy"] = sipserver;
        // Uncomment this if you want to see an outbound proxy too
        //~ register["outbound_proxy"] = "sip:outbound.example.com";
        sipcall.send({ "message": register });
        //console.log(register, 88888);
    }
}
/**
 * 呼叫电话的方法
 * @param {*} that 
 * @param {*} phone 
 * @returns 
 */
function doCall(phone) {

    //phoneS = $("#peer").val();
    //webrstc2sipThat = that;
    var strid = `WebCall_0_${companyid}_0_${$("#peer").val()}`;
    ViewBagid = 0;
    ViewBagprojectid = 0;
    ViewBagphone = 0;
    // Call someone
    //	$('#peer').attr('disabled', true);
    // $('#call').attr('disabled', true).unbind('click');
    // $('#dovideo').attr('disabled', true);
    //yhy var username = $('#peer').val();
    var myuser = janusObj.username;
    //var username = "sip:" + $('#peer').val() + myuser.substring(myuser.indexOf('@'));
    //var username = "sip:" + strid + myuser.substring(myuser.indexOf('@'));
    //var username = "sip:" + strid + `@${janusObj.WebIP}:${janusObj.freeswitchport}`;
    //var username = "sip:" + strid + `@${janusObj.WebIP}:${janusObj.freeswitchport}`;
    var username = "sip:" + strid + `@${fshost}:${freeswitchport}`;
    //var username = "sip:" + $('#peer').val() + myuser.substring(myuser.indexOf('@'));
    //var username = "sip:" + "9000" + "@36.155.115.244:2280";
    console.log(username);
    //if($('#peer').val() === "") {
    //	//alert('Please insert a valid SIP address (e.g:1001)');
    //	console.log("请输入电话号码")
    //	//$('#peer').removeAttr('disabled');
    //	$('#dovideo').removeAttr('disabled');
    //	$('#call').removeAttr('disabled').click(doCall);
    //	return;
    //}
    //if(username.indexOf("sip:") != 0 || username.indexOf("@") < 0) {
    //	console.log("Please insert a valid SIP address (e.g:1001)")
    //	$('#dovideo').removeAttr('disabled').val("");
    //	$('#call').removeAttr('disabled').click(doCall);
    //	return;
    //}
    // Call this URI
    doVideo = $('#dovideo').is(':checked');
    Janus.log("This is a SIP " + (doVideo ? "video" : "audio") + " call (dovideo=" + doVideo + ")");
    sipcall.createOffer({
        media: {
            audioSend: true,
            audioRecv: true, // We DO want audio
            videoSend: doVideo,
            videoRecv: doVideo // We MAY want video
        },
        success: function (jsep) {
            console.log("🚀 ~ file: webrtcsip.js:801 ~ doCall ~ jsep:", jsep)
            Janus.debug("Got SDP!");
            Janus.debug(jsep);
            // By default, you only pass the SIP URI to call as an
            // argument to a "call" request. Should you want the
            // SIP stack to add some custom headers to the INVITE,
            // you can do so by adding an additional "headers" object,
            // containing each of the headers as key-value, e.g.:
            //		var body = { request: "call", uri: $('#peer').val(),
            //			headers: {
            //				"My-Header": "value",
            //				"AnotherHeader": "another string"
            //			}
            //		};
            //yhy var body = { request: "call", uri: $('#peer').val() };
            var body = { request: "call", uri: username };
            //var body = { request: "call", uri: "sip:123@pgy.tycvoip.com:2280" };
            //console.log(body,999999);
            // Note: you can also ask the plugin to negotiate SDES-SRTP, instead of the
            // default plain RTP, by adding a "srtp" attribute to the request. Valid
            // values are "sdes_optional" and "sdes_mandatory", e.g.:
            //		var body = { request: "call", uri: $('#peer').val(), srtp: "sdes_optional" };
            // "sdes_optional" will negotiate RTP/AVP and add a crypto line,
            // "sdes_mandatory" will set the protocol to RTP/SAVP instead.
            // Just beware that some endpoints will NOT accept an INVITE
            // with a crypto line in it if the protocol is not RTP/SAVP,
            // so if you want SDES use "sdes_optional" with care.
            sipcall.send({ "message": body, "jsep": jsep });
            //console.log({ "message": body, "jsep": jsep }, 999999999);

        },
        error: function (error) {
            console.log(JSON.stringify(error))
            Janus.error("WebRTC error...", error);
            //alert("WebRTC error... " + JSON.stringify(error));
        }
    });
}

function doCall2(that, phone) {
    webrstc2sipThat = that;
    var strid = `WebCall_${ViewBagid}_${$.cookie("corid")}_${ViewBagprojectid}_${ViewBagphone}`;
    ViewBagid = 0;
    ViewBagprojectid = 0;
    ViewBagphone = 0;
    // Call someone
    //	$('#peer').attr('disabled', true);
    $('#call').attr('disabled', true).unbind('click');
    $('#dovideo').attr('disabled', true);
    //yhy var username = $('#peer').val();
    var myuser = janusObj.username;
    //var username = "sip:" + $('#peer').val() + myuser.substring(myuser.indexOf('@'));
    //var username = "sip:" + strid + myuser.substring(myuser.indexOf('@'));
    var username = "sip:" + strid + `@${fsNalip}:${fsPort}`;
    //var username = "sip:" + $('#peer').val() + myuser.substring(myuser.indexOf('@'));
    //var username = "sip:" + "9000" + "@36.155.115.244:2280";
    console.log(username);
    //if($('#peer').val() === "") {
    //	//alert('Please insert a valid SIP address (e.g:1001)');
    //	console.log("请输入电话号码")
    //	//$('#peer').removeAttr('disabled');
    //	$('#dovideo').removeAttr('disabled');
    //	$('#call').removeAttr('disabled').click(doCall);
    //	return;
    //}
    //if(username.indexOf("sip:") != 0 || username.indexOf("@") < 0) {
    //	console.log("Please insert a valid SIP address (e.g:1001)")
    //	$('#dovideo').removeAttr('disabled').val("");
    //	$('#call').removeAttr('disabled').click(doCall);
    //	return;
    //}
    // Call this URI
    doVideo = $('#dovideo').is(':checked');
    Janus.log("This is a SIP " + (doVideo ? "video" : "audio") + " call (dovideo=" + doVideo + ")");
    sipcall.createOffer({
        media: {
            audioSend: true,
            audioRecv: true, // We DO want audio
            videoSend: doVideo,
            videoRecv: doVideo // We MAY want video
        },
        success: function (jsep) {
            Janus.debug("Got SDP!");
            Janus.debug(jsep);
            // By default, you only pass the SIP URI to call as an
            // argument to a "call" request. Should you want the
            // SIP stack to add some custom headers to the INVITE,
            // you can do so by adding an additional "headers" object,
            // containing each of the headers as key-value, e.g.:
            //		var body = { request: "call", uri: $('#peer').val(),
            //			headers: {
            //				"My-Header": "value",
            //				"AnotherHeader": "another string"
            //			}
            //		};
            //yhy var body = { request: "call", uri: $('#peer').val() };
            var body = { request: "call", uri: username };
            //var body = { request: "call", uri: "sip:123@pgy.tycvoip.com:2280" };
            //console.log(body, 999999);
            // Note: you can also ask the plugin to negotiate SDES-SRTP, instead of the
            // default plain RTP, by adding a "srtp" attribute to the request. Valid
            // values are "sdes_optional" and "sdes_mandatory", e.g.:
            //		var body = { request: "call", uri: $('#peer').val(), srtp: "sdes_optional" };
            // "sdes_optional" will negotiate RTP/AVP and add a crypto line,
            // "sdes_mandatory" will set the protocol to RTP/SAVP instead.
            // Just beware that some endpoints will NOT accept an INVITE
            // with a crypto line in it if the protocol is not RTP/SAVP,
            // so if you want SDES use "sdes_optional" with care.
            sipcall.send({ "message": body, "jsep": jsep });
            //console.log({ "message": body, "jsep": jsep }, 999999999);

        },
        error: function (error) {
            console.log(JSON.stringify(error))
            Janus.error("WebRTC error...", error);
            ////alert("WebRTC error... " + JSON.stringify(error));

        }
    });
}

function doHangup() {
    //event.preventDefault();
    //console.log("hangup9999999");
    $("#peer").val("");
    // Hangup a call
    $('#call').attr('disabled', true).unbind('click');
    var hangup = { "request": "hangup" };
    sipcall.send({ "message": hangup });
    console.log(hangup);
    //console.log(register, 777777);
    sipcall.hangup();
}

//键盘输入
function demo2(obj, tip) {
    if (tip == 1) {
        var con = document.getElementById("peer").value;
        document.getElementById("peer").value = con + obj.innerHTML;
        if (iphonestatue == 1) {
            senddtmf(obj.innerHTML);
        }
        //console.log( con , obj.innerHTML)
    } else if (tip == 2) {
        document.getElementById("peer").value = "";
    } else if (tip == 3) {
        var con = document.getElementById("peer").value;
        document.getElementById("peer").value = con.slice(0, -1);
        console.log(con.slice(0, -1))
    }
    //console.log(obj);

}



//状态
extensionstatus = {
    Ready: "就绪",
    Registering: "正在注册",
    Registered: "注册成功",
    UnRegister: "取消注册",
    FailRegister: "注册失败",
    Calling: "呼叫中",
    Called: "被叫",
    Answered: "通话中",
    Callafter: "话后",
    QueueState: "队列中"

};
/**
 * 呼叫号码
 * @param {any} num
 */
function Callnumber(num) {
    console.log("num: " + num, extensionstatus);
    currentextensionstatus = extensionstatus.Calling;
    var handle = null ? helpers[helperId].sipcall : sipcall;
    actuallyDoCall(handle, "sip:" + num + "@" + fsNalip + ":" + fsPort, false); //actuallyDoCall(handle, "sip:" + num + "@" + WebIP + ":" + '25080', false);
}
/**${fsNalip}:${fsPort}
 * 调用Janus拨打
 * @param {any} handle
 * @param {any} uri
 * @param {any} doVideo
 * @param {any} referId
 */
function actuallyDoCall(handle, uri, doVideo, referId) {
    handle.createOffer({
        media: {
            audioSend: true,
            audioRecv: true, // We DO want audio
            //videoSend: doVideo, videoRecv: doVideo	// We MAY want video
        },
        success: function (jsep) {
            Janus.debug("Got SDP!");
            Janus.debug(jsep);
            var body = { request: "call", uri: uri };
            console.log(body);
            if (referId) {
                // In case we're originating this call because of a call
                // transfer, we need to provide the internal reference ID
                body["refer_id"] = referId;
            }
            handle.send({ "message": body, "jsep": jsep });
        },
        error: function (error) {
            Janus.error("WebRTC error...", error); // Janus.error(prefix + "WebRTC error...", error);
            alert("WebRTC 错误请联系管理员... " + JSON.stringify(error));
        }
    });
}