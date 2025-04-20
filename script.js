document.addEventListener("DOMContentLoaded", function () {
  const supabaseUrl = 'https://vrujkbkyjmfjxhqbszyo.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydWprYmt5am1manhocWJzenlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTM2NzgsImV4cCI6MjA2MDQ4OTY3OH0.qE7p02mruPlBVabM7uNlgGAL8PdsTC-QMcukU4m_-aA'; // ???? ????? ???? ???
  const client = supabase.createClient(supabaseUrl, supabaseKey);

  console.log("?? Supabase client initialized");

  async function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await client.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("????? ??????! ????? ???? ??????.");
  }

  async function signIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await client.auth.signIn({ email, password });

    if (error) {
      alert(error.message);
    } else {
      const user = client.auth.user();
      console.log("?? ??????? ??????:", user);

      if (user && user.email === "32218gk@gmail.com") {
        console.log("?? ????? ??? ????, ???? ?-admin.html");
        window.location.href = "admin.html";
      } else {
        console.log("?? ????? ????, ???? ?????? ???");
        loadTodos();
      }
    }
  }

  async function signOut() {
    await client.auth.signOut();
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("todo-section").style.display = "none";
    console.log("?? ??????");
  }

  async function loadTodos() {
    const user = client.auth.user();
    console.log("?? ????? ?????:", user);

    if (!user) {
      console.warn("?? ??? ????? ?????");
      return;
    }

    document.getElementById("user-email").textContent = user.email;
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("todo-section").style.display = "block";

    const { data, error } = await client
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("? ????? ?????? ??????:", error.message);
      alert("????? ?????? ???????: " + error.message);
      return;
    }

    console.log("?? ?????? ???????:", data);

    const list = document.getElementById("tasks-list");
    list.innerHTML = "";

    if (data.length === 0) {
      console.log("?? ??? ?????? ?????");
    }

    data.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task.task + (task.is_complete ? " ?" : "");
      li.onclick = () => toggleComplete(task);
      list.appendChild(li);
    });
  }

  async function addTask() {
    const task = document.getElementById("new-task").value;
    const user = client.auth.user();

    console.log("? ????? ?????:", task);

    const { error } = await client
      .from("todos")
      .insert([{ task, is_complete: false, user_id: user.id }]);

    if (error) {
      console.error("? ????? ??????:", error.message);
      alert(error.message);
    } else {
      console.log("? ????? ?????");
      loadTodos();
    }
  }

  async function toggleComplete(task) {
    const { error } = await client
      .from("todos")
      .update({ is_complete: !task.is_complete })
      .eq("id", task.id);
    if (error) {
      console.error("? ????? ?????? ?????:", error.message);
      alert(error.message);
    } else {
      loadTodos();
    }
  }

  if (client.auth.session()) {
    console.log("?? ???? ?????? ?????? ????");
    const user = client.auth.user();
    if (user && user.email === "admin@example.com") {
      console.log("?? ????? ??????? ????? ¡ú ???? ?-admin.html");
      window.location.href = "admin.html";
    } else {
      loadTodos();
    }
  } else {
    console.log("??? ??? session ????");
  }

  // ????? ????????? ??????? ?-HTML
  window.signUp = signUp;
  window.signIn = signIn;
  window.signOut = signOut;
  window.addTask = addTask;
});
