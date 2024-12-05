import React, { useState } from "react";
import "./App.css";
import { Dialog, DialogTitle, DialogContent, Button, DialogActions, TextField } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const lessons = ["1", "2", "3", "4", "5", "6", "7"];

function App() {
  const [schedule, setSchedule] = useState({});
  const [open, setOpen] = useState(false);
  const [currentCell, setCurrentCell] = useState({ day: "", lesson: "" });
  const [formData, setFormData] = useState({ subject: "", fromTime: null, toTime: null });

  const handleCellClick = (day, lesson) => {
    setCurrentCell({ day, lesson });
    setFormData({ subject: "", fromTime: null, toTime: null }); // Reset form fields
    setOpen(true); // Open the modal
  };

  const handleSave = () => {
    if (formData.subject && formData.fromTime && formData.toTime) {
      const formattedFromTime = formData.fromTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const formattedToTime = formData.toTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setSchedule((prev) => ({
        ...prev,
        [`${currentCell.day}-${currentCell.lesson}`]: {
          subject: formData.subject,
          time: `${formattedFromTime} - ${formattedToTime}`,
        },
      }));
      setOpen(false); // Close the modal
    }
  };

  return (
    <div className="schedule-container">
      <table className="schedule-table">
        <thead>
          <tr>
            <th></th>
            {lessons.map((lesson) => (
              <th key={lesson}>Lesson {lesson}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td className="day-cell">{day}</td>
              {lessons.map((lesson) => (
                <td
                  key={`${day}-${lesson}`}
                  className="schedule-cell"
                  onClick={() => handleCellClick(day, lesson)}
                >
                  {schedule[`${day}-${lesson}`]?.subject || ""}
                  <br />
                  <small>{schedule[`${day}-${lesson}`]?.time || ""}</small>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog for adding/editing schedule */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Schedule</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Subject"
            fullWidth
            variant="outlined"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="From"
              value={formData.fromTime}
              onChange={(newTime) => setFormData({ ...formData, fromTime: newTime })}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
            <TimePicker
              label="To"
              value={formData.toTime}
              onChange={(newTime) => setFormData({ ...formData, toTime: newTime })}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
