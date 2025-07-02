document.addEventListener('DOMContentLoaded', function () {
  // ===== Hamburger Menu =====
  const menuBtn = document.getElementById('menu-btn');
  const menuOverlay = document.getElementById('menu-overlay');

  if (menuBtn && menuOverlay) {
    menuBtn.addEventListener('click', () => {
      menuOverlay.style.display = (menuOverlay.style.display === 'block') ? 'none' : 'block';
    });

    const overlayLinks = document.querySelectorAll('#menu-overlay a');
    overlayLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuOverlay.style.display = 'none';
      });
    });
  }
document.getElementById("login-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  fetch("https://your-backend.onrender.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "Login successful!") {
        localStorage.setItem("user", JSON.stringify({ name: data.name, email }));
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
        alert(data.message);
      }
    })
    .catch((err) => {
      alert("Server error. Please try again later.");
      console.error(err);
    });
});

  document.getElementById("register-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  fetch("https://your-backend.onrender.com/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "Registration successful!") {
        alert("Registered successfully! Redirecting to login...");
        window.location.href = "login.html";
      } else {
        alert(data.message);
      }
    })
    .catch((err) => {
      alert("Server error. Please try again later.");
      console.error(err);
    });
});

  // ===== Navbar User UI Toggle (Login State) =====
  const user = JSON.parse(localStorage.getItem("user"));
  const navButtons = document.getElementById("nav-buttons");

  if (user && navButtons) {
    navButtons.innerHTML = `
      <div class="user-icon" id="user-icon">${user.name.charAt(0).toUpperCase()}</div>
      <button class="hamburger" id="menu-btn">☰</button>
    `;

    // Re-bind hamburger click (since it's dynamically inserted)
    const newMenuBtn = document.getElementById('menu-btn');
    if (newMenuBtn && menuOverlay) {
      newMenuBtn.addEventListener('click', () => {
        menuOverlay.style.display = (menuOverlay.style.display === 'block') ? 'none' : 'block';
      });
    }

    // User icon popup toggle
    const userIcon = document.getElementById("user-icon");
    const userPopup = document.getElementById("user-popup");
    const userNameTag = document.getElementById("user-name");

    if (userIcon && userPopup && userNameTag) {
      userIcon.addEventListener("click", () => {
        userNameTag.textContent = "Logged in as: " + user.name;
        userPopup.style.display = userPopup.style.display === "none" ? "block" : "none";
      });
    }
  }

  // ===== Logout Function (Accessible Globally) =====
  window.logout = function () {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  };

  // ===== Attendance Marker Form =====
  const attendanceForm = document.getElementById('attendance-form');
  if (attendanceForm) {
    attendanceForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const date = document.getElementById('date').value;
      const period = document.getElementById('period').value;
      const status = document.getElementById('status').value;

      if (!date || !period || !status) {
        alert('Please fill all fields!');
        return;
      }

      const key = `attendance-${date}`;
      const existingData = JSON.parse(localStorage.getItem(key)) || {};

      if (period === 'all') {
        for (let i = 0; i <= 5; i++) {
          existingData[`period-${i}`] = status;
        }
      } else {
        existingData[`period-${period}`] = status;
      }

      localStorage.setItem(key, JSON.stringify(existingData));

      const msg = document.getElementById('message');
      msg.innerText = `Attendance saved for ${date}${period === 'all' ? ' (All Periods)' : ' - Period ' + period}`;
      msg.style.color = 'green';
      attendanceForm.reset();
    });
  }

  // ===== Attendance Calculator Summary =====
  const daysPresentSpan = document.getElementById('days-present');
  const daysAbsentSpan = document.getElementById('days-absent');
  const percentageSpan = document.getElementById('percentage');

  if (daysPresentSpan && daysAbsentSpan && percentageSpan) {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('attendance-'));
    let present = 0, absent = 0;

    keys.forEach(key => {
      const day = JSON.parse(localStorage.getItem(key));
      for (let period in day) {
        const value = day[period];
        if (value === 'present') present++;
        else if (value === 'absent') absent++;
      }
    });

    const total = present + absent;
    const percent = total > 0 ? Math.round((present / total) * 100) : 0;

    daysPresentSpan.textContent = present;
    daysAbsentSpan.textContent = absent;
    percentageSpan.textContent = `${percent}%`;

    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const result = `Attendance Summary:\n✅ Present: ${present}\n❌ Absent: ${absent}\n📊 Percentage: ${percent}%`;
        navigator.clipboard.writeText(result).then(() => {
          alert("Result copied to clipboard!");
        });
      });
    }

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all attendance data?')) {
          const keys = Object.keys(localStorage).filter(k => k.startsWith('attendance-'));
          keys.forEach(k => localStorage.removeItem(k));
          alert('All attendance records cleared.');
          location.reload();
        }
      });
    }

    const downloadBtn = document.getElementById('download-txt-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const attendanceKeys = Object.keys(localStorage).filter(k => k.startsWith('attendance-'));
        if (attendanceKeys.length === 0) {
          alert("No attendance data to download.");
          return;
        }

        let content = "Attendance Summary:\n\n";
        attendanceKeys.forEach(key => {
          const date = key.replace('attendance-', '');
          const data = JSON.parse(localStorage.getItem(key));
          content += `Date: ${date}\n`;
          for (let period in data) {
            content += `${period}: ${data[period]}\n`;
          }
          content += '\n';
        });

        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "AttendanceSummary.txt";
        link.click();
      });
    }
  }
});
