export function simpleMessage(message) {
  try {

    message = JSON.parse(JSON.stringify(message))

    let jid = message.key.remoteJid;
    let fromMe = message.key.fromMe;
    let id = message.key.id;
    let sender = message?.key?.participant || message.key.remoteJid;
    let timestamp = message.messageTimestamp;
    let date = (new Date(timestamp * 1000).toString()).split(" GMT")[0];

    let type = message?.message?.conversation ?
    "conversation": message?.message?.stickerMessage ?
    "stickerMessage": message?.message?.extendedTextMessage ?
    "extendedTextMessage": message?.message?.audioMessage ?
    "audioMessage": message?.message?.imageMessage ?
    "imageMessage": message?.message?.videoMessage ?
    "videoMessage": message?.message?.reactionMessage ?
    "reactionMessage": message?.message?.buttonsResponseMessage ?
    "buttonsResponseMessage": message?.message?.listResponseMessage ?
    "listResponseMessage":
    message?.message?.templateButtonReplyMessage ?
    "templateButtonReplyMessage": "undefined";

    var composeResponse = {};

    const head = {
      type,
      jid,
      fromMe,
      pushName: message?.pushName,
      id,
      sender,
      timestamp,
      date
    };
    const mek = message.message;

    if (type === "conversation") composeResponse = {
      head,
      body: {
        text: mek?.conversation || undefined
      },
      quoted: undefined
    };

    if (type === "extendedTextMessage") composeResponse = {
      head,
      body: {
        text: mek?.extendedTextMessage?.text || undefined,
        previewType: mek?.extendedTextMessage?.previewType || undefined,
        inviteLinkGroupTypeV2: mek?.extendedTextMessage?.inviteLinkGroupTypeV2 || undefined,
        canonicalUrl: mek?.extendedTextMessage?.canonicalUrl || undefined,
        matchedText: mek?.extendedTextMessage?.matchedText || undefined
      },
      quoted: mek?.extendedTextMessage?.contextInfo?.quotedMessage ?
      {
        type: mek?.extendedTextMessage?.contextInfo?.quotedMessage ? Object.keys(mek?.extendedTextMessage?.contextInfo?.quotedMessage)[0]: undefined,
        stanzaId: mek.extendedTextMessage.contextInfo.stanzaId,
        sender: mek.extendedTextMessage.contextInfo.participant,
        extraInfo: mek.extendedTextMessage.contextInfo.quotedMessage
      }: undefined
    };

    if (type === "stickerMessage") composeResponse = {
      head,
      body: {
        url: mek?.stickerMessage?.url,
        fileSha256: mek?.stickerMessage?.fileSha256,
        fileEncSha256: mek?.stickerMessage?.fileEncSha256,
        mediaKey: mek?.stickerMessage?.mediaKey,
        mimetype: mek?.stickerMessage?.mimetype,
        height: mek?.stickerMessage?.height,
        width: mek?.stickerMessage?.width,
        directPath: mek?.stickerMessage?.directPath,
        fileLength: mek?.stickerMessage?.fileLength,
        mediaKeyTimestamp: mek?.stickerMessage?.mediaKeyTimestamp,
        isAnimated: mek?.stickerMessage?.isAnimated
      },
      quoted: mek?.stickerMessage?.contextInfo?.quotedMessage ?
      {
        type: Object.keys(mek?.stickerMessage?.contextInfo?.quotedMessage)[0],
        stanzaId: mek.stickerMessage.contextInfo.stanzaId,
        sender: mek.stickerMessage.contextInfo.participant,
        extraInfo: mek.stickerMessage.contextInfo.quotedMessage
      }: undefined
    };

    if (type === "audioMessage") composeResponse = {
      head,
      body: {
        url: mek?.audioMessage?.url,
        mimetype: mek?.audioMessage?.mimetype,
        fileSha256: mek?.audioMessage?.fileSha256,
        fileEncSha256: mek?.audioMessage?.fileEncSha256,
        fileLength: mek?.audioMessage?.fileLength,
        seconds: mek?.audioMessage?.seconds,
        ptt: mek?.audioMessage?.ptt,
        mediaKey: mek?.audioMessage?.mediaKey,
        directPath: mek?.audioMessage?.directPath,
        mediaKeyTimestamp: mek?.audioMessage?.mediaKeyTimestamp,
        waveform: mek?.audioMessage?.waveform
      },
      quoted: mek?.audioMessage?.contextInfo?.quotedMessage ?
      {
        type: Object.keys(mek?.audioMessage?.contextInfo?.quotedMessage)[0],
        stanzaId: mek.audioMessage.contextInfo.stanzaId,
        sender: mek.audioMessage.contextInfo.participant,
        extraInfo: mek.audioMessage.contextInfo.quotedMessage
      }: undefined
    };

    if (type === "imageMessage") composeResponse = {
      head,
      body: {
        canonicalUrl: mek?.imageMessage?.canonicalUrl || undefined,
        matchedText: mek?.imageMessage?.matchedText || undefined,
        url: mek?.imageMessage.url,
        mimetype: mek?.imageMessage?.mimetype,
        fileSha256: mek?.imageMessage?.fileSha256,
        fileEncSha256: mek?.imageMessage?.fileEncSha256,
        fileLength: mek?.imageMessage?.fileLength,
        height: mek?.imageMessage?.height,
        width: mek?.imageMessage?.width,
        mediaKey: mek?.imageMessage?.mediaKey,
        directPath: mek?.imageMessage?.directPath,
        mediaKeyTimestamp: mek?.imageMessage?.mediaKeyTimestamp,
        jpegThumbnail: mek?.imageMessage?.jpegThumbnail
      },
      quoted: mek?.imageMessage?.contextInfo?.quotedMessage ?
      {
        type: Object.keys(mek?.imageMessage?.contextInfo?.quotedMessage)[0],
        stanzaId: mek.imageMessage.contextInfo.stanzaId,
        sender: mek.imageMessage.contextInfo.participant,
        extraInfo: mek.imageMessage.contextInfo.quotedMessage
      }: undefined
    };

    if (type === "videoMessage") composeResponse = {
      head,
      body: {
        canonicalUrl: mek?.videoMessage?.canonicalUrl || undefined,
        matchedText: mek?.videoMessage?.matchedText || undefined,
        url: mek?.videoMessage?.url,
        mimetype: mek?.videoMessage?.mimetype,
        fileSha256: mek?.videoMessage?.fileSha256,
        fileEncSha256: mek?.videoMessage?.fileEncSha256,
        fileLength: mek?.videoMessage?.fileLength,
        seconds: mek?.videoMessage?.seconds,
        mediaKey: mek?.videoMessage?.mediaKey,
        height: mek?.videoMessage?.height,
        width: mek?.videoMessage?.width,
        directPath: mek?.videoMessage?.directPath,
        mediaKeyTimestamp: mek?.videoMessage?.mediaKeyTimestamp,
        jpegThumbnail: mek?.videoMessage?.jpegThumbnail
      },
      quoted: mek?.videoMessage?.contextInfo?.quotedMessage ?
      {
        type: Object.keys(mek?.videoMessage?.contextInfo?.quotedMessage)[0],
        stanzaId: mek.videoMessage.contextInfo.stanzaId,
        sender: mek.videoMessage.contextInfo.participant,
        extraInfo: mek.videoMessage.contextInfo.quotedMessage
      }: undefined
    };

    if (type === "reactionMessage") composeResponse = {
      head,
      body: {
        key: mek?.reactionMessage?.key,
        text: mek?.reactionMessage?.text
      },
      quoted: undefined
    };

    if (type === "buttonsResponseMessage") composeResponse = {
      head,
      body: {
        buttonId: mek?.buttonsResponseMessage?.selectedButtonId,
        buttonText: mek?.buttonsResponseMessage?.selectedDisplayText
      },
      quoted: mek?.buttonsResponseMessage?.contextInfo?.quotedMessage ?
      {
        type: Object.keys(mek?.buttonsResponseMessage?.contextInfo?.quotedMessage)[0],
        stanzaId: mek.buttonsResponseMessage.contextInfo.stanzaId,
        sender: mek.buttonsResponseMessage.contextInfo.participant,
        extraInfo: mek.buttonsResponseMessage.contextInfo.quotedMessage
      }: undefined
    };

    if (type === "listResponseMessage") composeResponse = {
      head,
      body: {
        listType: mek?.listResponseMessage?.listType,
        rowId: mek?.listResponseMessage?.singleSelectReply?.selectedRowId,
        rowText: mek?.listResponseMessage?.title
      },
      quoted: mek?.listResponseMessage?.contextInfo?.quotedMessage ?
      {
        type: Object.keys(mek?.listResponseMessage?.contextInfo?.quotedMessage)[0],
        stanzaId: mek.listResponseMessage.contextInfo.stanzaId,
        sender: mek.listResponseMessage.contextInfo.participant,
        extraInfo: mek.listResponseMessage.contextInfo.quotedMessage
      }: undefined
    };

    if (type === "templateButtonReplyMessage") composeResponse = {
      head,
      body: {
        buttonText: mek?.templateButtonReplyMessage?.selectedDisplayText,
        buttonId: mek?.templateButtonReplyMessage?.selectedId
      },
      quoted: mek?.templateButtonReplyMessage?.contextInfo?.quotedMessage ?
      {
        type: Object.keys(mek?.templateButtonReplyMessage?.contextInfo?.quotedMessage)[0],
        stanzaId: mek.templateButtonReplyMessage.contextInfo.stanzaId,
        sender: mek.templateButtonReplyMessage.contextInfo.participant,
        extraInfo: mek.templateButtonReplyMessage.contextInfo.quotedMessage
      }: undefined
    };


    if (type === "undefined") composeResponse = {
      head,
      details: mek
    }

    return composeResponse;

  } catch(err) {
    throw err;
  }
}