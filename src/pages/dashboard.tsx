import { useState } from "react";

type Schedule = {
  id: number;
  name: string;
  destination: string;
  return_time: string;
};

export default function Dashboard() {
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: 1, name: "田中", destination: "外回り", return_time: "17:00" },
    { id: 2, name: "佐藤", destination: "会議", return_time: "16:00" },
    { id: 3, name: "鈴木", destination: "現場", return_time: "18:00" },
    { id: 4, name: "山本", destination: "打合せ", return_time: "15:30" },
    { id: 5, name: "中村", destination: "現地確認（丸亀）", return_time: "17:45" },
  ]);

  const [editing, setEditing] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({ name: "", destination: "", return_time: "" });

  const handleOpen = (s: Schedule) => {
    setEditing(s);
    setFormData({ name: s.name, destination: s.destination, return_time: s.return_time });
  };

  const handleClose = () => setEditing(null);

  const handleSave = () => {
    if (!editing) return;
    setSchedules((prev) =>
      prev.map((s) => (s.id === editing.id ? { ...s, ...formData } : s))
    );
    setEditing(null);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>行動予定表</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          marginTop: "1rem",
        }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>氏名</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>行先</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>帰社時間</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr
              key={s.id}
              onClick={() => handleOpen(s)}
              style={{
                cursor: "pointer",
                borderBottom: "1px solid #ddd",
              }}
            >
              <td style={{ padding: "8px" }}>{s.name}</td>
              <td style={{ padding: "8px" }}>{s.destination}</td>
              <td style={{ padding: "8px" }}>{s.return_time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>予定の編集</h3>

            <label>氏名：</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <label>行先：</label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <label>帰社時間：</label>
            <input
              type="time"
              value={formData.return_time}
              onChange={(e) => setFormData({ ...formData, return_time: e.target.value })}
              style={{ width: "100%", marginBottom: "20px" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handleSave}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                保存
              </button>
              <button
                onClick={handleClose}
                style={{
                  background: "#aaa",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}