import {
  saveCreds,
  sendMessage,
  simpleMessage,
  Sock,
  useStore,
  reconnect,
  store,
} from "../index.js"

useStore();

const startSock = async() => {

  try {

    const sock = Sock();
    store?.bind(sock.ev);

    /* ouvir eventos */
    sock.ev.process(

      async(events) => {

        if (events['connection.update']) {
          reconnect(events, startSock) // reconectar caso a conexão caia
        };

        if (events['creds.update']) {
          await saveCreds() // salvar credenciais
        };

        if (events['messages.upsert']) {
          const upsert = events['messages.upsert'];

          if (upsert.type !== "notify") return;
          const message = upsert.messages[0];
          if (message.key.fromMe) return;
          if (message.key.remoteJid === "status@broadcast") return;

          const mek = simpleMessage(message)
          const isGroup = mek?.head?.jid.endsWith("g.us") ? true: false;

          const sid = mek?.head?.sender || undefined;
          const sender = isGroup ? mek?.head?.jid: mek?.head?.sender;
          const quoted = message;

          console.log(mek)

          // envie "hi" para receber uma mensagem
          if (mek?.body?.text === "hi") {

            await sendMessage(sock, {
              to: sender,
              text: "Hello World!",
              quoted
            })

          }

        }

      })

    return sock;

  } catch (err) {
    console.warn(err)
  }

}
startSock()