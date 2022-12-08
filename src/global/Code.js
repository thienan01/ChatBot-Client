function Code() {
  return `
    <script>
            var secretKey = "SECRETKEY_REPLACE";
            var scriptId = "SCRIPTID_REPLACE";
            var currentNodeId = "_BEGIN";
    </script>
    <div class="containerChat">
        <div class="chatbox" style="position:fixed">
            <div class="chatbox__support">
                <div class="chatbox__header">
                    <div class="chatbox__content--header">
                        <h4 class="chatbox__heading--header">Chat support</h4>
                    </div>
                </div>
                <div class="chatbox__messages">
                        
                </div>
                <div class="chatbox__footer">
                    <img src="https://cdn.jsdelivr.net/gh/thienan01/new/emojis.svg" alt="">
                    <img src="https://cdn.jsdelivr.net/gh/thienan01/new/microphone.svg" alt="">
                    <input type="text" placeholder="Write a message..." id="inputMessage">
                    <p class="chatbox__send--footer" id="btnSend" onclick="handleSendMsg()" style="margin-top:16px">Send</p>
                    <img src="https://cdn.jsdelivr.net/gh/thienan01/new/attachment.svg" alt="">
                </div>
            </div>
            <div class="chatbox__button">
                <button>button</button>
            </div>
        </div>
    </div>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;1,300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/thienan01/new/chat.min.css">
    <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/thienan01/new/handleChat.min.js"></script>
    `;
}
export default Code;
