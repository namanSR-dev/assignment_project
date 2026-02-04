"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/Container";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";

type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

type User = {
  name: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null); // which task am i changing?
  const [editingTitle, setEditingTitle] = useState("");
  const [error, setError] = useState("");

  /* ---------------- LOAD DATA ---------------- */

  const loadDashboard = useCallback(async () => {
    try {
      // 1. check if user is still logged in
      const profileRes = await fetch("/api/v1/me");
      if (!profileRes.ok) {
        router.push("/login"); // no token? go back to login
        return;
      }

      const profileData = await profileRes.json();
      setUser(profileData.data);

      // 2. get all tasks for this user
      const taskRes = await fetch("/api/v1/tasks");
      if (!taskRes.ok) throw new Error();

      const taskData = await taskRes.json();
      setTasks(taskData.data);
    } catch {
      setError("Failed to load dashboard data");
    }
  }, [router]);

  useEffect(() => {
    loadDashboard(); // run this when page opens
  }, [loadDashboard]);

  /* ---------------- CREATE ---------------- */

  async function createTask() {
    if (!newTitle) return; // dont send empty task

    const res = await fetch("/api/v1/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    if (!res.ok) {
      setError("Failed to create task");
      return;
    }

    setNewTitle(""); // clear input box
    setError("");
    loadDashboard(); // refresh list
  }

  /* ---------------- UPDATE ---------------- */

  async function updateTask(id: string) {
    if (!editingTitle) return;

    const res = await fetch(`/api/v1/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingTitle }),
    });

    if (!res.ok) {
      setError("Failed to update task");
      return;
    }

    setEditingId(null); // close edit mode
    setEditingTitle("");
    setError("");
    loadDashboard();
  }

  /* ---------------- DELETE ---------------- */

  async function deleteTask(id: string) {
    const res = await fetch(`/api/v1/tasks/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setError("Failed to delete task");
      return;
    }

    setError("");
    loadDashboard(); // update UI
  }

  /* ---------------- LOGOUT ---------------- */

  async function logout() {
    await fetch("/api/v1/auth/logout", { method: "POST" }); // kill cookie on server
    router.push("/login");
  }

  /* ---------------- UI ---------------- */

  return (
    <Container>
      <div className="flex items-center justify-between mb-8">
        <PageHeader
          title="Dashboard"
          subtitle={
            user
              ? `Welcome back, ${user.name}`
              : "Manage your tasks efficiently"
          }
        />
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <Card>
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Button onClick={createTask}>Add</Button>
        </div>
      </Card>

      <div className="divider" />

      <Card>
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task._id} className="flex items-center justify-between">
              {/* toggle between text and input box */}
              {editingId === task._id ? (
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
              ) : (
                <span>{task.title}</span>
              )}

              <div className="flex gap-2">
                {editingId === task._id ? (
                  <Button
                    variant="secondary"
                    onClick={() => updateTask(task._id)}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingId(task._id); // open edit mode for this one
                      setEditingTitle(task.title);
                    }}
                  >
                    Edit
                  </Button>
                )}

                <Button variant="danger" onClick={() => deleteTask(task._id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </Container>
  );
}
