let displayFrame=document.getElementById("stream__box"),videoFrames=document.getElementsByClassName("video__container"),userIdInDisplayFrame=null,expandVideoFrame=e=>{let t=displayFrame.children[0];t&&document.getElementById("streams__container").appendChild(t),displayFrame.style.display="block",displayFrame.appendChild(e.currentTarget),userIdInDisplayFrame=e.currentTarget.id;for(let e=0;videoFrames.length>e;e++)videoFrames[e].id!=userIdInDisplayFrame&&(videoFrames[e].style.height="100px",videoFrames[e].style.width="100px")};for(let e=0;videoFrames.length>e;e++)videoFrames[e].addEventListener("click",expandVideoFrame);let hideDisplayFrame=()=>{userIdInDisplayFrame=null,displayFrame.style.display=null;let e=displayFrame.children[0];document.getElementById("streams__container").appendChild(e);for(let e=0;videoFrames.length>e;e++)videoFrames[e].style.height="350px",videoFrames[e].style.width="450px"};displayFrame.addEventListener("click",hideDisplayFrame);const membersContainer=document.getElementById("members__container"),messageContainer=document.getElementById("messages__container");let activeMemberContainer=!0,activeMessageContainer=!0;function togglemember(){membersContainer.style.display=activeMemberContainer?"none":"block",activeMemberContainer=!activeMemberContainer}function togglemessage(){messageContainer.style.display=activeMessageContainer?"none":"block",activeMessageContainer=!activeMessageContainer}function updateTime(){const e=document.getElementById("time"),t=new Date;const a=(t.getHours()%12||12).toString().padStart(2,"0")+":"+t.getMinutes().toString().padStart(2,"0")+" |";a&&(e.textContent=a)}updateTime(),setInterval(updateTime,1e3);