// pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button
} from "@mui/material";

export default function Dashboard() {
  const [schedules, setSchedules] = useState([]);
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) console.error(error);
    else setSchedules(data);
  };

  const handleCellClick = (row: any) => {
    setSelected(row);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!selected) return;
    const { error } = await supabase
      .from("schedules")
      .update({
        name: selected.name,
        destination: selected.destination,
        return_time: selected.return_time,
        updated_at: new Date(),
      })
      .eq("id", selected.id);

    if (error) console.error(error);
    else {
      setOpen(false);
      fetchSchedules();
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>行動予定表</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>氏名</TableCell>
            <TableCell>行先</TableCell>
            <TableCell>帰社時間</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((row) => (
            <TableRow key={row.id} onClick={() => handleCellClick(row)} style={{ cursor: "pointer" }}>
              <TableCell>{row.name || "—"}</TableCell>
              <TableCell>{row.destination || "—"}</TableCell>
              <TableCell>{row.return_time || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>予定の編集</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="氏名"
            fullWidth
            value={selected?.name || ""}
            onChange={(e) => setSelected({ ...selected, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="行先"
            fullWidth
            value={selected?.destination || ""}
            onChange={(e) => setSelected({ ...selected, destination: e.target.value })}
          />
          <TextField
            margin="dense"
            label="帰社時間"
            type="time"
            fullWidth
            value={selected?.return_time || ""}
            onChange={(e) => setSelected({ ...selected, return_time: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleSave}>保存</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}