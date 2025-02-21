/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "./Navbar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/tasks";

const Todos = () => {
  const [tasks, setTasks] = useState<{ id: number; text: string }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState("");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;
    const newTaskObj = { text: newTask };

    try {
      const response = await axios.post(API_URL, newTaskObj);
      setTasks([...tasks, response.data]);
      setNewTask(""); // Clear input
      showSnackbar("Task added successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to add task.", "error");
    }
  };

  const removeTask = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
      showSnackbar("Task removed successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to delete task.", "error");
    }
  };

  const clearTasks = async () => {
    try {
      await Promise.all(tasks.map((task) => axios.delete(`${API_URL}/${task.id}`)));
      setTasks([]);
      showSnackbar("All tasks have been removed.", "success");
    } catch (error) {
      showSnackbar("Failed to clear tasks.", "error");
    }
  };

  const startEditing = (index: number, task: string) => {
    setEditingIndex(index);
    setEditedTask(task);
  };

  const saveTask = async (index: number) => {
    if (editedTask.trim() === "") return;
    const taskToUpdate = tasks[index];

    try {
      const response = await axios.put(`${API_URL}/${taskToUpdate.id}`, { text: editedTask });
      const updatedTasks = [...tasks];
      updatedTasks[index] = response.data;
      setTasks(updatedTasks);
      setEditingIndex(null);
      showSnackbar("Task updated successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to update task.", "error");
    }
  };

  return (
    <>
      <Navbar />
       {/* MUI Snackbar for Success/Error Messages */}
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
            <ul className="mt-4 space-y-2">
              {tasks.map((task, index) => (
                <li key={task.id} className="flex justify-between items-center p-2 border rounded bg-gray-50">
                  {editingIndex === index ? (
                    <Input value={editedTask} onChange={(e) => setEditedTask(e.target.value)} className="flex-1" />
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
                        <Button size="sm" variant="outline">✖</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to delete this task?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeTask(task.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Clear All</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete all tasks?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearTasks}>Delete All</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </section>

     
    </>
  );
};

export default Todos;
