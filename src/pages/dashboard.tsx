import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Schedule = {
  id: string;
  name: string;
  destination: string;
  return_time: string;
  updated_at?: string;
  created_at?: string;
  user_id?: string | null;
};

export default function Dashboard() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    return_time: "",
  });

  // ① Supabaseから全予定を取得
  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("fetch error:", error);
      return;
    }

    // dataはnullの可能性あるので安全に
    console.log("Fetched data:", data);
    setSchedules((data || []) as Schedule[]);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // ② 行をクリック → モーダルを開く
  const handleOpen = (row: Schedule) => {
    setEditing(row);
    setFormData({
      name: row.name || "",
      destination: row.destination || "",
      return_time: row.return_time || "",
    });
  };

  // モーダル閉じる
  const handleClose = () => {
    setEditing(null);
  };

  // ③ 保存（更新）
  const handleSave = async () => {
    if (!editing) return;

    const { error } = await supabase
      .from("schedules")
      .update({
        name: formData.name,
        destination: formData.destination,
        return_time: formData.return_time,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editing.id);

    if (error) {
      console.error("update error:", error);
      alert("更新に失敗しました");
      return;
    }

    // 画面を最新化
    await fetchSchedules();
    setEditing(null);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>行動予定表</h2>

      {/* 一覧テーブル */}
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
          {schedules.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "1rem" }}>
                データがありません。
              </td>
            </tr>
          ) : (
            schedules.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleOpen(row)}
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <td style={{ padding: "8px" }}>{row.name}</td>
                <td style={{ padding: "8px" }}>{row.destination}</td>
                <td style={{ padding: "8px" }}>{row.return_time}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 編集モーダル（自前） */}
      {editing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <label>行先：</label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <label>帰社時間：</label>
            <input
              type="time"
              value={formData.return_time}
              onChange={(e) =>
                setFormData({ ...formData, return_time: e.target.value })
              }
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