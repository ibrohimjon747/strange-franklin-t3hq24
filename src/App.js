// src/App.js
import { useEffect, useState } from "react";
import {
  initCometChat,
  loginOrCreate,
  sendText,
  addMsgListener,
} from "./cometchat";

export default function App() {
  // --- UI holatlari
  const [me, setMe] = useState(null);         // login bo'lgan foydalanuvchi
  const [uid, setUid] = useState("student_001");
  const [name, setName] = useState("Student One");
  const [peer, setPeer] = useState("student_002");
  const [text, setText] = useState("");
  const [log, setLog] = useState([]);
  const [error, setError] = useState("");

  // --- Login bosilganda: init + login
  const handleLogin = async () => {
    setError("");
    try {
      await initCometChat();                                  // AppID/Region
      const u = await loginOrCreate(uid.trim(), name.trim()); // AuthKey va user
      setMe(u);
    } catch (err) {
      console.error("Init/Login error:", err);
      const msg = err?.message || err?.code || JSON.stringify(err);
      setError("Init/Login Xato: " + msg);
    }
  };

  // --- Xabar tinglovchini ulash (login bo'lgandan keyin)
  useEffect(() => {
    if (!me) return;
    const off = addMsgListener((m) => {
      setLog((prev) => [
        ...prev,
        { from: m.getSender().getUid(), text: m.getText() },
      ]);
    });
    return off; // cleanup
  }, [me]);

  // --- Xabar yuborish
  const handleSend = async () => {
    if (!text || !peer || !me) return;
    try {
      await sendText(peer.trim(), text);
      setLog((prev) => [...prev, { from: me.getUid(), text }]);
      setText("");
    } catch (err) {
      console.error("sendText error:", err);
      const msg = err?.message || err?.code || JSON.stringify(err);
      setError("Yuborishda xato: " + msg);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "32px auto", padding: 12, fontFamily: "system-ui, sans-serif" }}>
      <h3 style={{ marginBottom: 8 }}>📖 Qur'on Chat (Demo)</h3>

      {/* Xatolar ko'rsatkichlari */}
      {error && (
        <div style={{ background: "#ffe6e6", color: "#900", border: "1px solid #f5c2c7", padding: 10, marginBottom: 12 }}>
          ❗ {error}
        </div>
      )}

      {/* Agar login bo'lmagan bo'lsa — UID bilan kirish formasi */}
      {!me && (
        <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
            <div>
              <label>UID (men kimman?)</label>
              <input
                style={{ width: "100%", padding: 8 }}
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="masalan: student_001 yoki student_002"
              />
            </div>
            <div>
              <label>Ism (ekranda ko‘rinadigan)</label>
              <input
                style={{ width: "100%", padding: 8 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="masalan: Student One"
              />
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <label>Peer UID (kimga yozaman?)</label>
            <input
              style={{ width: "100%", padding: 8 }}
              value={peer}
              onChange={(e) => setPeer(e.target.value)}
              placeholder="masalan: student_002"
            />
          </div>

          <button onClick={handleLogin} style={{ marginTop: 12 }}>
            Login
          </button>
        </div>
      )}

      {/* Login bo'lgandan keyin chat UI */}
      {me && (
        <>
          <div style={{ marginBottom: 8 }}>
            👤 <b>Men:</b> {me.getUid()} &nbsp;·&nbsp; ✉️ <b>Peer:</b>{" "}
            <input
              style={{ padding: 6, border: "1px solid #ccc", borderRadius: 6 }}
              value={peer}
              onChange={(e) => setPeer(e.target.value)}
              placeholder="kimga yozaman? (UID)"
            />
          </div>

          <div style={{ border: "1px solid #ddd", minHeight: 220, padding: 8, borderRadius: 8, marginBottom: 10 }}>
            {log.length === 0 && (
              <div style={{ color: "#777" }}>Hali xabar yo‘q. Birinchi xabarni yuboring.</div>
            )}
            {log.map((m, i) => (
              <div key={i} style={{ margin: "6px 0" }}>
                <b>{m.from}:</b> {m.text}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{ flex: 1, padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Xabar..."
            />
            <button onClick={handleSend}>Yuborish</button>
          </div>
        </>
      )}
    </div>
  );
}