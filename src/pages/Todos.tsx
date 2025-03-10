/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "./Navbar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const API_URL = "http://localhost:5000/tasks"; // JSON Server API URL

const Todos = () => {
  const [tasks, setTasks] = useState<{ id: number; text: string }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      showSnackbar("Failed to load tasks.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const addTask = async () => {
    if (newTask.trim() === "") {
      showSnackbar("Task cannot be empty.", "error");
      return;
    }

    if (tasks.some((task) => task.text === newTask.trim())) {
      showSnackbar("Task already exists.", "error");
      return;
    }

    try {
      const response = await axios.post(API_URL, { text: newTask });
      setTasks([...tasks, response.data]);
      setNewTask("");
      showSnackbar("Task added successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to add task.", "error");
    }
  };

  const confirmDeleteTask = (id: number) => {
    setTaskToDelete(id);
  };

  const removeTask = async () => {
    if (!taskToDelete) {
      showSnackbar("Invalid task ID.", "error");
      return;
    }

    try {
      await axios.delete(`${API_URL}/${taskToDelete}`);
      setTasks(tasks.filter((task) => task.id !== taskToDelete));
      showSnackbar("Task removed successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to delete task.", "error");
    } finally {
      setTaskToDelete(null);
    }
  };

  const saveTask = async (index: number) => {
    if (editedTask.trim() === "") return;
    const taskToUpdate = tasks[index];

    try {
      const response = await axios.put(`${API_URL}/${taskToUpdate.id}`, { text: editedTask });
      setTasks(tasks.map((task, i) => (i === index ? response.data : task)));
      setEditingIndex(null);
      setEditedTask("");
      showSnackbar("Task updated successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to update task.", "error");
    }
  };

  const startEditing = (index: number, taskText: string) => {
    setEditingIndex(index);
    setEditedTask(taskText);
  };

  return (
    <>
      <Navbar />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert elevation={6} variant="filled" severity={snackbar.severity}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      <section className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle className="text-center">TODO LIST</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTask();
              }}
            >
              <div className="flex items-center gap-2">
                <Input
                  id="task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter a task..."
                  className="flex-1"
                />
                <Button type="submit">ADD TASK</Button>
              </div>
            </form>

            {loading ? (
              <p className="text-center mt-4">Loading tasks...</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {tasks.map((task, index) => (
                  <li key={task.id} className="flex justify-between items-center p-2 border rounded bg-gray-50">
                    {editingIndex === index ? (
                      <Input
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                        className="flex-1"
                      />
                    ) : (
                      <span>{task.text}</span>
                    )}

                    <div className="flex gap-2 ml-2">
                      {editingIndex === index ? (
                        <Button size="sm" onClick={() => saveTask(index)}>
                          Save
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => startEditing(index, task.text)}>
                          Edit
                        </Button>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => confirmDeleteTask(task.id)}
                          >
                            ✖
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the task.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={removeTask}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default Todos;
