import { useState, useRef, useEffect } from "react";

const FAQ = [
  {
    keywords: ["réserver", "réservation", "book", "comment réserver"],
    answer: "Pour réserver un hôtel, cliquez sur la carte de l'hôtel souhaité puis sur le bouton 'Réserver'. Vous devrez être connecté pour finaliser votre réservation."
  },
  {
    keywords: ["prix", "tarif", "coût", "combien"],
    answer: "Les prix sont affichés en F CFA sur chaque carte d'hôtel. Le tarif indiqué est le prix par nuit."
  },
  {
    keywords: ["annuler", "annulation", "remboursement"],
    answer: "Pour annuler une réservation, rendez-vous dans votre espace 'Mes réservations' et cliquez sur 'Annuler'. Les conditions d'annulation varient selon l'hôtel."
  },
  {
    keywords: ["compte", "inscription", "s'inscrire", "créer compte"],
    answer: "Pour créer un compte, cliquez sur 'S'inscrire' en haut de la page. Remplissez le formulaire et validez votre email avec le code reçu."
  },
  {
    keywords: ["connexion", "connecter", "login", "mot de passe"],
    answer: "Cliquez sur 'Se connecter' et entrez votre email et mot de passe. Si vous avez oublié votre mot de passe, cliquez sur 'Mot de passe oublié'."
  },
  {
    keywords: ["hôtel", "hotels", "liste", "trouver", "chercher", "recherche"],
    answer: "Tous les hôtels disponibles sont listés sur la page principale. Vous pouvez utiliser la barre de recherche pour filtrer par nom ou adresse."
  },
  {
    keywords: ["paiement", "payer", "carte", "mobile money"],
    answer: "Nous acceptons les paiements par carte bancaire et Mobile Money. Le paiement est sécurisé et chiffré."
  },
  {
    keywords: ["contact", "support", "aide", "problème"],
    answer: "Pour contacter notre support, envoyez un email à support@redproduct.com ou appelez le +221 XX XXX XX XX de 8h à 18h."
  },
  {
    keywords: ["bonjour", "salut", "hello", "bonsoir"],
    answer: "Bonjour ! Je suis l'assistant RED PRODUCT. Comment puis-je vous aider pour votre réservation d'hôtel ? 😊"
  },
  {
    keywords: ["merci", "thanks"],
    answer: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. 😊"
  },
];

const DEFAULT_ANSWER = "Je n'ai pas bien compris votre question. Voici ce sur quoi je peux vous aider : réservation, prix, annulation, compte, connexion, paiement ou support. Pouvez-vous reformuler ?";

function getBotAnswer(userMessage) {
  const msg = userMessage.toLowerCase().trim();
  for (const faq of FAQ) {
    if (faq.keywords.some(k => msg.includes(k))) {
      return faq.answer;
    }
  }
  return DEFAULT_ANSWER;
}

const SUGGESTIONS = [
  "Comment réserver ?",
  "Quels sont les prix ?",
  "Comment annuler ?",
  "Créer un compte",
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Bonjour ! 👋 Je suis l'assistant RED PRODUCT. Comment puis-je vous aider pour votre réservation d'hôtel ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    setMessages(prev => [...prev, { from: "user", text: userText }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const answer = getBotAnswer(userText);
      setMessages(prev => [...prev, { from: "bot", text: answer }]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#1a1a1a",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s",
        }}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Fenêtre du chat */}
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "90px",
          right: "24px",
          width: "340px",
          height: "480px",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
          zIndex: 9998,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: "#1a1a1a",
            color: "white",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <div style={{
              width: "36px", height: "36px",
              borderRadius: "50%",
              backgroundColor: "#333",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px"
            }}>🤖</div>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>Assistant RED PRODUCT</div>
              <div style={{ fontSize: "11px", color: "#aaa" }}>● En ligne</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            backgroundColor: "#f9f9f9",
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "75%",
                  padding: "10px 14px",
                  borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  backgroundColor: msg.from === "user" ? "#1a1a1a" : "white",
                  color: msg.from === "user" ? "white" : "#1a1a1a",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "10px 14px",
                  borderRadius: "16px 16px 16px 4px",
                  backgroundColor: "white",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  fontSize: "18px",
                  letterSpacing: "2px",
                }}>
                  <span style={{ animation: "blink 1s infinite" }}>•••</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div style={{
              padding: "8px 12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              backgroundColor: "#f9f9f9",
              borderTop: "1px solid #eee",
            }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)} style={{
                  padding: "5px 10px",
                  borderRadius: "20px",
                  border: "1px solid #1a1a1a",
                  backgroundColor: "white",
                  color: "#1a1a1a",
                  fontSize: "11px",
                  cursor: "pointer",
                }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: "12px",
            borderTop: "1px solid #eee",
            display: "flex",
            gap: "8px",
            backgroundColor: "white",
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre question..."
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "20px",
                border: "1px solid #ddd",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              onClick={() => sendMessage()}
              style={{
                width: "38px", height: "38px",
                borderRadius: "50%",
                backgroundColor: "#1a1a1a",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}