const APP_ID="af8ff4a3a97f4fe0995ccd5df662fb98";let uid=sessionStorage.getItem("uid");uid||(uid=String(Math.floor(1e4*Math.random())),sessionStorage.setItem("uid",uid));let client,rtmClient,channel,audioTracks={localAudioTrack:null,remoteAudioTracks:{}},token=null;const queryString=window.location.search,urlParams=new URLSearchParams(queryString);let roomId=urlParams.get("room"),displayName=sessionStorage.getItem("display_name");displayName||(window.location="/");let localScreenTracks,localTracks=[],remoteUsers={},sharingScreen=!1,joinRoomInit=async()=>{rtmClient=await AgoraRTM.createInstance(APP_ID),await rtmClient.login({uid:uid,token:token}),await rtmClient.addOrUpdateLocalUserAttributes({name:displayName}),channel=await rtmClient.createChannel(roomId),await channel.join(),channel.on("MemberJoined",handleMemberJoined),channel.on("MemberLeft",handleMemberLeft),channel.on("ChannelMessage",handleChannelMessage),getMembers(),addBotMessageToDom(`Welcome to the room ${displayName}`),client=AgoraRTC.createClient({mode:"rtc",codec:"vp8"}),await client.join(APP_ID,roomId,token,uid),client.on("user-published",handleUserPublished),client.on("user-left",handleUserLeft)},joinStream=async()=>{document.getElementById("join-btn").style.display="none",document.getElementsByClassName("stream__actions")[0].style.display="flex",localTracks=await AgoraRTC.createMicrophoneAndCameraTracks({},{encoderConfig:{width:{min:640,ideal:1920,max:1920},height:{min:480,ideal:1080,max:1080}}});let e=`<div class="video__container" id="user-container-${uid}">\n                    <div class="video-player" id="user-${uid}"></div>\n                    <div class="user-rtc-${uid} username-wrapper" id="${uid}"></div>\n                 </div>`;document.getElementById("streams__container").insertAdjacentHTML("beforeend",e),document.getElementById(`user-container-${uid}`).addEventListener("click",expandVideoFrame),localTracks[1].play(`user-${uid}`),await localTracks[0].setMuted(!0),await localTracks[1].setMuted(!0),document.getElementById("mic-btn").classList.remove("active"),document.getElementById("camera-btn").classList.remove("active"),await client.publish([localTracks[0],localTracks[1]]),initVolumeIndicator()},switchToCamera=async()=>{let e=`<div class="video__container" id="user-container-${uid}">\n                    <div class="video-player" id="user-${uid}"></div>\n                <div class="user-rtc-${uid} username-wrapper" id="${uid}"></div>\n                 </div>`;displayFrame.insertAdjacentHTML("beforeend",e),document.getElementById("screen-btn").classList.remove("active"),document.getElementById(`user-container-${uid}`).addEventListener("click",expandVideoFrame),localTracks[1].play(`user-${uid}`),await client.publish([localTracks[1]])},handleUserPublished=async(e,t)=>{remoteUsers[e.uid]=e,await client.subscribe(e,t);let a=document.getElementById(`user-container-${e.uid}`);if(null===a&&(a=`<div class="video__container" id="user-container-${e.uid}">\n                <div class="video-player" id="user-${e.uid}"></div>\n                <div class="user-rtc-${e.uid} username-wrapper" id="${e.uid}"></div>\n            </div>`,document.getElementById("streams__container").insertAdjacentHTML("beforeend",a),document.getElementById(`user-container-${e.uid}`).addEventListener("click",expandVideoFrame)),displayFrame.style.display){let t=document.getElementById(`user-container-${e.uid}`);t.style.height="200px",t.style.width="200px"}"video"===t&&e.videoTrack.play(`user-${e.uid}`),"audio"===t&&e.audioTrack.play()},handleUserLeft=async e=>{delete remoteUsers[e.uid];let t=document.getElementById(`user-container-${e.uid}`);if(t&&t.remove(),userIdInDisplayFrame===`user-container-${e.uid}`){displayFrame.style.display=null;let e=document.getElementsByClassName("video__container");for(let t=0;e.length>t;t++)e[t].style.height="300px",e[t].style.width="300px"}},toggleMic=async e=>{let t=e.currentTarget;localTracks[0].muted?(await localTracks[0].setMuted(!1),t.classList.add("active"),document.getElementById("mic-line").style.display="none"):(await localTracks[0].setMuted(!0),t.classList.remove("active"),document.getElementById("mic-line").style.display="block")},toggleCamera=async e=>{let t=e.currentTarget;localTracks[1].muted?(await localTracks[1].setMuted(!1),t.classList.add("active"),document.getElementById("camera-line").style.display="none"):(await localTracks[1].setMuted(!0),t.classList.remove("active"),document.getElementById("camera-line").style.display="block")},toggleScreen=async e=>{let t=e.currentTarget,a=document.getElementById("camera-btn");if(sharingScreen)sharingScreen=!1,a.style.display="block",document.getElementById(`user-container-${uid}`).remove(),await client.unpublish([localScreenTracks]),document.getElementById("screen-line").style.display="block",switchToCamera();else{sharingScreen=!0,t.classList.add("active"),a.classList.remove("active"),a.style.display="none",localScreenTracks=await AgoraRTC.createScreenVideoTrack(),document.getElementById(`user-container-${uid}`).remove(),displayFrame.style.display="block";let e=`<div class="video__container" id="user-container-${uid}">\n                <div class="video-player" id="user-${uid}"></div>\n                <div class="user-rtc-${uid} username-wrapper" id="${uid}"></div>\n            </div>`;displayFrame.insertAdjacentHTML("beforeend",e),document.getElementById(`user-container-${uid}`).addEventListener("click",expandVideoFrame),userIdInDisplayFrame=`user-container-${uid}`,localScreenTracks.play(`user-${uid}`),await client.unpublish([localTracks[1]]),await client.publish([localScreenTracks]);let n=document.getElementsByClassName("video__container");for(let e=0;n.length>e;e++)n[e].id!=userIdInDisplayFrame&&(n[e].style.height="100px",n[e].style.width="100px");document.getElementById("screen-line").style.display="none"}},leaveStream=async e=>{e.preventDefault(),document.getElementById("join-btn").style.display="block",document.getElementsByClassName("stream__actions")[0].style.display="none";for(let e=0;localTracks.length>e;e++)localTracks[e].stop(),localTracks[e].close();if(await client.unpublish([localTracks[0],localTracks[1]]),localScreenTracks&&await client.unpublish([localScreenTracks]),document.getElementById(`user-container-${uid}`).remove(),userIdInDisplayFrame===`user-container-${uid}`){displayFrame.style.display=null;for(let e=0;videoFrames.length>e;e++)videoFrames[e].style.height="300px",videoFrames[e].style.width="300px"}channel.sendMessage({text:JSON.stringify({type:"user_left",uid:uid})})};document.getElementById("camera-btn").addEventListener("click",toggleCamera),document.getElementById("mic-btn").addEventListener("click",toggleMic),document.getElementById("screen-btn").addEventListener("click",toggleScreen),document.getElementById("join-btn").addEventListener("click",joinStream),document.getElementById("leave-btn").addEventListener("click",leaveStream),joinRoomInit();