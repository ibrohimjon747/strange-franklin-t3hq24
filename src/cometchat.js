import { CometChat } from "@cometchat-pro/chat";

const APP_ID = "28071916e9687d6f";
const REGION = "EU";
const AUTH_KEY = "41c1bfd1a4a873be8c374ed6b5b2d0cd6a408bd9";

export function initCometChat() {
  const settings = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(REGION)
    .build();
  return CometChat.init(APP_ID, settings);
}

export async function loginOrCreate(uid, name) {
  try {
    return await CometChat.login(uid, AUTH_KEY);
  } catch {
    const user = new CometChat.User(uid);
    user.setName(name);
    await CometChat.createUser(user, AUTH_KEY);
    return await CometChat.login(uid, AUTH_KEY);
  }
}

export async function sendText(toUid, text) {
  const msg = new CometChat.TextMessage(
    toUid,
    text,
    CometChat.RECEIVER_TYPE.USER
  );
  return CometChat.sendMessage(msg);
}

export function addMsgListener(cb) {
  const id = "L" + Date.now();
  CometChat.addMessageListener(
    id,
    new CometChat.MessageListener({ onTextMessageReceived: (m) => cb(m) })
  );
  return () => CometChat.removeMessageListener(id);
}
