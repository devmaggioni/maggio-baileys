import {
  promises as fs
} from "fs";
import {
  readmore
} from "./readmore.js"

export function sendMessage(sock, {
  to, text, quoted, mentions, latitude, longitude, contact, buttonOptions, buttons, templateOptions, react, itens, listOptions, urlOptions, productOptions, mediaOptions, forward
}) {
  try {

    if (!sock) throw new Error("miss sock parameter");
    if (!to) throw new Error("miss destination on message")

    if (buttonOptions && typeof buttonOptions !== "object" || buttons && typeof buttons !== "object" || contact && typeof contact !== "object" || mentions && typeof mentions !== "object" || itens && typeof itens !== "object") throw new Error("This error originated because you didn't pass a parameter as object")

    if (!templateOptions && buttonOptions && !buttons || !templateOptions && buttons && !buttonOptions) throw new Error("You need to pass both parameters: buttons and buttonOptions")

    if (latitude && !longitude || longitude && !latitude) throw new Error("You need to pass both parameters: latitude and longitude")

    if (itens && !listOptions || listOptions && !itens) throw new Error("You need to pass both parameters: itens and listOptions");

    var type = "message";
    if (latitude || longitude) type = "location"
    if (contact) type = "contact";
    if (buttonOptions) type = "button";
    if (buttonOptions?.image || buttonOptions?.video) type = "buttonImage";
    if (templateOptions) type = "template";
    if (templateOptions?.image || templateOptions?.video) type = "templateImage";
    if (react) type = "react";
    if (listOptions) type = "list";
    if (urlOptions) type = "url";
    if (productOptions) type = "product";
    if (mediaOptions) type = "media";
    /*if (listOptions?.image || listOptions?.video) type = "listImage";*/

    if (type === "message") {

      return sock.sendMessage(to,
        {
          text, mentions: mentions ? mentions: [],
          contextInfo: {
            forwardingScore: forward || 0, isForwarded: forward ? true: false
          }
        },
        {
          quoted: quoted ? quoted: null
        }
      )

    } else if (type === "location") {

      return sock.sendMessage(to,
        {
          location: {
            degreesLatitude: latitude, degreesLongitude: longitude
          }},
      )

    } else if (type === "contact") {

      let name = contact.name;
      let org = contact?.org || undefined;
      let fone = contact.phone;
      let fone2 = fone.replace(/ -()+/g, '')

      let vcard = 'BEGIN:VCARD\n' // metadata of the contact card
      + 'VERSION:3.0\n'
      + `FN:${name}\n` // full name
      + `ORG:${org ? org: ""};\n` // the organization of the contact
      + `TEL;type=CELL;type=VOICE;waid=${fone2}:${fone}\n` // WhatsApp ID + phone number
      + 'END:VCARD'

      return sock.sendMessage(to,
        {
          contacts: {
            displayName: name,
            contacts: [{
              vcard
            }]
          }
        }
      )

    } else if (type === "button") {

      let array_buttons = []
      for (let i = 0; i < buttons.length; i++) {

        array_buttons.push(
          {
            buttonId: buttons[i].id,
            buttonText: {
              displayText: buttons[i].text
            },
            type: 1
          }
        )

      }

      return sock.sendMessage(to,
        {
          text: buttonOptions.text,
          mentions: mentions ? mentions: [],
          footer: buttonOptions?.footer || "",
          buttons: array_buttons,
          headerType: 1,
          contextInfo: {
            forwardingScore: forward || 0, isForwarded: forward ? true: false
          }
        },
        {
          quoted: quoted ? quoted: null
        }
      )

    } else if (type === "buttonImage") {

      let array_buttons = []
      for (let i = 0; i < buttons.length; i++) {

        array_buttons.push(
          {
            buttonId: buttons[i].id,
            buttonText: {
              displayText: buttons[i].text
            },
            type: 1
          }
        )

      }

      let image = buttonOptions?.image ? buttonOptions.image: false;
      let video = buttonOptions.video ? buttonOptions.video: false;

      let theFile;
      if (image) theFile = {
        image: {
          url: image
        }};
      if (video) theFile = {
        video: {
          url: video
        }};

      return sock.sendMessage(to,
        {
          ...theFile,
          caption: buttonOptions.text,
          mentions: mentions ? mentions: [],
          footer: buttonOptions?.footer || "",
          buttons: array_buttons,
          headerType: 1,
          contextInfo: {
            forwardingScore: forward || 0, isForwarded: forward ? true: false
          }
        },
        {
          quoted: quoted ? quoted: null
        }
      )

    } else if (type === "template") {

      let array_buttons = [];
      for (let i = 0; i < buttons.length; i++) {

        if (buttons[i]?.url) {
          array_buttons.push({
            index: i + 1,
            urlButton: {
              displayText: buttons[i].text, url: buttons[i].url
            }
          })
        }
        if (buttons[i]?.phone) {
          array_buttons.push({
            index: i+1,
            callButton: {
              displayText: buttons[i].text,
              phoneNumber: buttons[i].phone
            }
          })
        }
        if (buttons[i]?.id) {
          array_buttons.push({
            index: i+1,
            quickReplyButton: {
              displayText: buttons[i].text,
              id: buttons[i].id
            }
          })
        }

      }

      return sock.sendMessage(to,
        {
          text: templateOptions.text,
          mentions: mentions ? mentions: [],
          footer: templateOptions?.footer || "",
          templateButtons: array_buttons,
          contextInfo: {
            forwardingScore: forward || 0, isForwarded: forward ? true: false
          }
        }
      )

    } else if (type === "templateImage") {

      let array_buttons = [];
      for (let i = 0; i < buttons.length; i++) {

        if (buttons[i]?.url) {
          array_buttons.push({
            index: i + 1,
            urlButton: {
              displayText: buttons[i].text, url: buttons[i].url
            }
          })
        }
        if (buttons[i]?.phone) {
          array_buttons.push({
            index: i+1,
            callButton: {
              displayText: buttons[i].text,
              phoneNumber: buttons[i].phone
            }
          })
        }
        if (buttons[i]?.id) {
          array_buttons.push({
            index: i+1,
            quickReplyButton: {
              displayText: buttons[i].text,
              id: buttons[i].id
            }
          })
        }

      }

      let image = templateOptions?.image ? templateOptions.image: false;
      let video = templateOptions.video ? templateOptions.video: false;

      let theFile;
      if (image) theFile = {
        image: {
          url: image
        }};
      if (video) theFile = {
        video: {
          url: video
        }};

      return sock.sendMessage(to,
        {
          ...theFile,
          caption: templateOptions.text,
          mentions: mentions ? mentions: [],
          footer: templateOptions?.footer || "",
          templateButtons: array_buttons,
          contextInfo: {
            forwardingScore: forward || 0, isForwarded: forward ? true: false
          }
        }
      )

    } else if (type === "react") {

      return sock.sendMessage(to,
        {
          react: {
            text: react.emoji,
            key: react.key
          }
        })

    } else if (type === "list") {

      let sections = [];
      let rows = [];
      for (let i = 0; i < itens.length; i++) {
        rows.push({
          title: itens[i].text,
          rowId: itens[i].id,
          description: itens[i]?.desc ? itens[i].desc: ""
        })
      }
      if (!listOptions?.sectionTitle) sections.push({
        rows: rows
      });
      if (listOptions?.sectionTitle) sections.push({
        title: listOptions.sectionTitle, rows: rows
      })

      return sock.sendMessage(to, {
        text: listOptions.text,
        mentions: mentions ? mentions: [],
        footer: listOptions?.footer,
        title: listOptions.title,
        buttonText: listOptions?.buttonText ? listOptions.buttonText: "View list",
        sections,
        contextInfo: {
          forwardingScore: forward || 0, isForwarded: forward ? true: false
        }
      },
        {
          quoted: quoted ? quoted: null
        }
      )

    } else if (type === "url") {
      return (async() => {

        let thumb;
        if (urlOptions?.thumb) {
          thumb = await fs.readFile(urlOptions.thumb)
        }

        return sock.sendMessage(to, {

          forward: {
            key: {
              fromMe: true
            },
            message: {
              extendedTextMessage: {
                text: urlOptions?.text,
                matchedText: urlOptions?.url,
                canonicalUrl: urlOptions?.url,
                title: urlOptions?.title,
                description: urlOptions?.desc,
                previewType: 1,
                jpegThumbnail: thumb
              }
            }
          }

        })

      })()
    } else if (type === "product") {
      (async ()=> {

        let thumb = productOptions?.thumb ? await fs.readFile(productOptions.thumb): null;

        return sock.sendMessage(to, {

          forward: {
            key: {
              fromMe: true
            },
            message: {
              extendedTextMessage: {
                text: productOptions?.text ? productOptions.text + `${readmore}\n${productOptions.url}`: readmore + productOptions.url,
                matchedText: productOptions.url,
                title: productOptions?.title || "Product",
                previewType: 0,
                jpegThumbnail: thumb,
                inviteLinkGroupTypeV2: 0
              }
            }
          }

        })
      })()
    } else if (type === "media") {

      let mediaType = {};
      if (mediaOptions?.image) mediaType = {
        image: {
          url: mediaOptions.image
        }};
      if (mediaOptions?.video) mediaType = {
        video: {
          url: mediaOptions.video
        }
      }
      if (mediaOptions?.gif) mediaType = {
        video: {
          url: mediaOptions.gif
        }
      }
      if (mediaOptions?.audio) mediaType = {
        audio: {
          url: mediaOptions.audio
        }
      }
      if (mediaOptions?.sticker) mediaType = {
        sticker: {
          url: mediaOptions.sticker
        }
      }

      if (mediaOptions?.image || mediaOptions?.video) {
        return sock.sendMessage(to, {
          ...mediaType,
          caption: mediaOptions?.caption || "",
          gifPlayback: mediaOptions?.gif ? true: false,
          contextInfo: {
            forwardingScore: forward || 0, isForwarded: forward ? true: false
          }
        },
          {
            quoted: quoted ? quoted: null
          }
        )
      } else if (mediaOptions?.audio) {

        return sock.sendMessage(to, {
          ...mediaType,
          mimetype: 'audio/mp4',
          ptt: mediaOptions?.ptt ? true: false,
          contextInfo: {
            forwardingScore: forward || 0, isForwarded: forward ? true: false
          }
        },
          {
            quoted: quoted ? quoted: null
          }
        )

      } else if (mediaOptions?.sticker) {

        return sock.sendMessage(to, {
          ...mediaType,
          contextInfo: {
            forwardingScore: forward || 0, isForwarded: forward ? true: false
          }
        },
          {
            quoted: quoted ? quoted: null
          }
        )

      }

    }

  } catch (err) {
    throw err;
  }
}