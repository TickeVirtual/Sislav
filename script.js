// ========== 1. Mostrar valores en campos visibles del ticket ==========

// Asignamos los valores previamente obtenidos a sus respectivos elementos HTML
document.getElementById("nro_boleta_id").textContent = nro_boleta;
document.getElementById("fecha").textContent = fecha;
document.getElementById("nombre_client").textContent = nombre_cliente;
document.getElementById("puntos").textContent = puntos;
document.getElementById("fecha_entrega").textContent = fecha_entrega;
document.getElementById("total").textContent = parseFloat(total).toFixed(2);
document.getElementById("descuento").textContent = parseFloat(descuento).toFixed(2);
document.getElementById("a_cuenta").textContent = parseFloat(a_cuenta).toFixed(2);
document.getElementById("a_cuenta_dos").textContent = parseFloat(a_cuenta_dos).toFixed(2);
document.getElementById("total_por_pagar").textContent = parseFloat(total_por_pagar).toFixed(2);
document.getElementById("estado").textContent = estado;
document.getElementById("total_prendas").textContent = total_prendas;

// ========== 2. Ocultar botones si la URL contiene "sharelink=1" ==========

const whatsappButton = document.getElementById('sendMessageButton');
const impresoraButton = document.getElementById('impresoraButton');
const currentURL = window.location.href;

// Si la URL incluye "sharelink=1", se ocultan los botones para evitar reenvíos o impresiones desde la vista del cliente
if (currentURL.includes('sharelink=1')) {
  whatsappButton.style.display = 'none';
  impresoraButton.style.display = 'none';
}

console.log(`Teléfono obtenido: ${telefono}`);

// ========== 3. Función para acortar URL utilizando TinyURL ==========

async function shortURL(url) {
  const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
  if (response.ok) {
    return await response.text();
  } else {
    throw new Error("Error al acortar la URL");
  }
}

// ========== 4. Lista de mensajes aleatorios para WhatsApp ==========

const mensajes = [
  "Hola! Enviamos su ticket de atención: {link}",
  "Saludos! adjuntamos su ticket de atención: {link}",
  "Estimado usuario!! , adjuntamos su ticket: {link}",
  "Buen día! enviamos su nota de atención: {link}",
  "Estimado cliente, su ticket está disponible en el siguiente link: {link}",
  "Hola! en el siguiente link podrá visualizar su ticket de venta: {link}",
  "Saludos! para verificar su ticket, clic en el siguiente link: {link}",
  "Hola, adjuntamos el ticket de atención por el servicio: {link}",
  "Estimado usuario, en el siguiente link podrá encontrar su ticket: {link}",
  "Hola! para revisar el detalle de su ticket, clic en el siguiente link: {link}"
];

// ========== 5. Evento al hacer clic en el botón de WhatsApp ==========

document.getElementById('sendMessageButton').addEventListener('click', async function () {
  const statusMessage = document.getElementById('statusMessage');

  // Mostrar estado de envío
  statusMessage.style.display = 'block';
  statusMessage.textContent = 'Enviando mensaje...';
  statusMessage.className = 'loading';
  whatsappButton.disabled = true;

  // Configurar datos para envío vía API de WhatsApp
  const url = "https://mensajero-evolution-api.ykf6ye.easypanel.host/message/sendMedia/botinstancia";
  const apikey = "556044B2B9E0-4FF4-B76D-5C9C50EBCA12";
  const numeroTelefono = `+51${telefono}`;
  const longURL = window.location.href;

  try {
    // Acortar la URL
    const shortedURL = await shortURL(longURL);

    // Generar un índice para seleccionar un mensaje aleatorio basado en la hora
    const ahora = new Date();
    const index = (ahora.getHours() + ahora.getMinutes() + ahora.getSeconds()) % mensajes.length;

    // Construir el mensaje de WhatsApp
    const captionMessage = `*Ticket de LAVANDERÍA*\n\n${mensajes[index].replace("{link}", shortedURL)}`;

    const body = {
      number: numeroTelefono,
      mediatype: "image",
      mimetype: "image/png",
      caption: captionMessage,
      media: "https://iili.io/3eyLHWG.png",
      fileName: "Imagem.png",
      delay: 1200,
      quoted: {
        key: { id: "MESSAGE_ID" },
        message: { conversation: "CONTENT_MESSAGE" }
      },
      mentionsEveryOne: false,
      mentioned: ["51931200418"]
    };

    // Enviar mensaje
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey
      },
      body: JSON.stringify(body)
    });

    const responseData = await response.json();

    if (response.ok) {
      setTimeout(() => {
        statusMessage.textContent = '¡Envío exitoso!';
        statusMessage.className = 'success';
        whatsappButton.disabled = true;
        whatsappButton.style.opacity = "0.5";
        whatsappButton.style.cursor = "not-allowed";
      }, 3000);
    } else {
      console.error('Error en la respuesta:', responseData);
      statusMessage.textContent = `Error: ${responseData.message || 'Problema desconocido'}`;
      statusMessage.className = 'error';
      whatsappButton.disabled = false;
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    statusMessage.textContent = `Error en la solicitud: ${error.message}`;
    statusMessage.className = 'error';
    whatsappButton.disabled = false;
  }
});
