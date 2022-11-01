# maggio-baileys

Um framework simples para começar a usar <a href="https://github.com/adiwajshing/Baileys">Baileys</a>.

## Iniciando

```javascript
import {
  saveCreds,
  sendMessage,
  simpleMessage,
  Sock,
  reconnect
} from "maggio-baileys"

const startSock = async() => {

  try {

    const sock = Sock();

    sock.ev.process(

      async(events) => {

        if (events['connection.update']) {
          reconnect(events, startSock)
        };

        if (events['creds.update']) {
          await saveCreds()
        };

        if (events['messages.upsert']) {
          const upsert = events['messages.upsert'];

          if (upsert.type !== "notify") return;
          const message = upsert.messages[0];
          //if (message.key.fromMe) return;
          //if (message.key.remoteJid === "status@broadcast") return;

          const mek = simpleMessage(message)

          console.log(mek)

        }

      })

    return sock;

  } catch (err) {
    console.warn(err)
  }

}
startSock()
```

## Enviando mensagens:

``` javascript
// mensagem de texto
sendMessage(sock, {
  to: sender,
  text: "Hello World"
})
}
```

```javascript
// imagem/video
let mediaOptions = {
image: "./image.jpeg", // pode ser uma URL
caption: "Hello World"
}

sendMessage(sock, {
to: sender,
mediaOptions
})
```

```javascript
// áudio
let mediaOptions = {
audio: "./audio.mp3"
}

sendMessage(sock, {
to: sender,
ptt: true, // enviar como nota de voz
mediaOptions
})
}
```

```javascript
// botões
let buttons = [{
id: 1,
text: "button 1"
},
{
id: 2,
text: "button 2"
}];

let buttonOptions = {
text: "Hello World!",
footer: "description"
};

sendMessage(sock, {
to: sender,
buttons,
buttonOptions
})
```

```javascript
// lista
let itens = [{
id: 1,
text: "opção 1"
},
{
id: 2,
text: "opção 2"
}];

let listOptions = {
title: "My List",
text: "Hello World",
footer: "Descrição"
}

sendMessage(sock, {
to: sender,
itens,
listOptions
})
```

```javascript
// template
let buttons = [
  {
    text: "clique aki!",
    url: "https://google.com"
  },
  {
    text: "me ligue!",
    phone: "+12 34 5678910"
  },
  {
    id: "meu id",
    text: "like button"
    
  }
  ];
  
  let templateOptions = {
    text: "Hello World",
    footer: "Descrição"
  }
  
  sendMessage(sock, {
    to: sender,
    buttons,
    templateOptions
  }
```

```javascript
// envie uma mensagem de botões com imagens
let buttons = [{
id: 1,
text: "button 1"
},
{
id: 2,
text: "button 2"
}];

let buttonOptions = {
image: "./example.jpeg",
text: "Hello World!",
footer: "description"
};

sendMessage(sock, {
to: sender,
buttons,
buttonOptions
})
```

```javascript
/*
você pode compartilhar um produto/catálogo, mas você precisa tê-lo criado antes.
*/
let productOptions = {
  text: "Visite à minha loja",
  title: "Meu produto",
  thumb: "./image.jpeg",
  url: "url do catálogo.com"
};

sendMessage(sock, {
  to: sender,
  productOptions
})
```