import Baileys from "@adiwajshing/baileys";
import {
  Boom
} from "@hapi/boom";
import Pino from "pino";

const {
  default: makeWASocket,
    /*default: makeCacheableSignalKeyStore,*/
    AnyMessageContent,
    delay,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    MessageRetryMap,
    useMultiFileAuthState
  } = Baileys;

  const MAIN_LOGGER = Pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
  })
  const logger = MAIN_LOGGER.child({})
  logger.level = 'trace'

  const useStore0 = !process.argv.includes('--no-store')

  var msgRetryCounterMap = {};

  const Store = () => useStore0 ? makeInMemoryStore({
    logger
  }): undefined

  const storeReadFromFile = (store) => store?.readFromFile('./files/baileys_store_multi.json')

  const saveEveryTenSeconds = (store) => setInterval(() => {
    store?.writeToFile('./files/baileys_store_multi.json')
  }, 10_000)

  export const store = Store();
  export function useStore() {
    storeReadFromFile(store);
    saveEveryTenSeconds(store)
  }

  const {
    state,
    saveCreds
  } = await useMultiFileAuthState('./files/baileys_auth_info')
  // fetch latest version of WA Web
  const {
    version,
    isLatest
  } = await fetchLatestBaileysVersion();


  export const Sock = () => makeWASocket({
    logger: Pino({
      level: "silent"
    }),
    printQRInTerminal: true,
    auth: state,
    msgRetryCounterMap,
    markOnlineOnConnect: true,
    receivedPendingNotifications: true,
    generateHighQualityLinkPreview: true
  })

  export function reconnect(events, startFunction) {
    try {
      const update = events['connection.update']
      const {
        connection,
        lastDisconnect
      } = update
      if (connection === 'close') {
        // reconnect if not logged out
        var _a,
        _b;
        if (((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0: lastDisconnect.error) === null || _a === void 0 ? void 0: _a.output) === null || _b === void 0 ? void 0: _b.statusCode) !== DisconnectReason.loggedOut) {
          startFunction()
        } else {
          console.log('Connection closed. You are logged out.')
        }
      }

      console.log('connection update', update)
    } catch(err) {
      throw new Error(err)
    }
  }

  export {
    saveCreds,
    DisconnectReason
  }