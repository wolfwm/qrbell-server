var lang = navigator.language.split('-')[0]

$(document).ready(() => {
  switch (lang) {
    case "en":
        lang = 0
        break;
    case "pt":
        lang = 1
        break;
    case "es":
        lang = 2
        break;
    case "de":
        lang = 3
        break;
    case "fr":
        lang = 4
        break;
    default:
        lang = 0
  }
})

const strings = {
  s_your_name: [
    "Your name",
    "Seu nome",
    "Tu nombre",
    "Dein Name",
    "Votre nom"
  ],
  s_name: [
    "Name",
    "Nome",
    "Nombre",
    "Name",
    "Nom"
  ],
  s_doorbell_password: [
    "Doorbell password",
    "Senha da campainha",
    "Contraseña de timbre",
    "Türklingel-Passwort",
    "Mot de passe de sonnette"
  ],
  s_password: [
    "Password",
    "Senha",
    "Contraseña",
    "Passwort",
    "Mot de passe"
  ],
  s_ring_doorbell: [
    "Ring doorbell",
    "Tocar campainha",
    "Tocar timbre",
    "Klingeln",
    "Sonnerie de la porte"
  ],
  s_doorbell_not_found: [
    "Doorbell not found",
    "Campainha não encontrada",
    "Timbre no encontrado",
    "Türklingel nicht gefunden",
    "Sonnette introuvable"
  ],
  s_server_communication_error: [
    "Server communication error",
    "Erro de comunicação com o servidor",
    "Error de comunicación del servidor",
    "Server-Kommunikationsfehler",
    "Erreur de communication avec le serveur"
  ],
  s_undefined_doorbell: [
    "Undefined doorbell",
    "Campainha indefinida",
    "Timbre indefinido",
    "Undefinierte Türklingel",
    "Sonnette indéfinie"
  ],
  s_someone: [
    "Someone",
    "Alguém",
    "alguien",
    "Jemand",
    "quelqu'un"
  ],
  s_failed_while_sending_ring: [
    "Failed while sending ring",
    "Falha ao enviar o toque",
    "Error al enviar toque",
    "Fehler beim Klingeln",
    "Erreur d'envoi de la sonnerie"
  ],
  s_wrong_password: [
    "Wrong password",
    "Senha incorreta",
    "Contraseña incorrecta",
    "Falsches Passwort",
    "Mauvais mot de passe"
  ],
  s_ring_sent: [
    "Ring sent",
    "Toque enviado",
    "Toque enviado",
    "Klingel gesendet",
    "Sonnerie envoyée"
  ]
}