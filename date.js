const PTL_TIME_CONFIG = {
  // true: uses real-time (API first, system fallback)
  // false: uses manual_datetime below to check match status
  is_live: true,
  // Manual date-time override when is_live is false (Format: "YYYY-MM-DDTHH:MM:SS")
  manual_datetime: "2026-09-23T18:18:08",
};

const PTL_MATCH_SCHEDULE = {
  matches: [
    {
      start_date: "2026-09-21",
      name: "Open 1",
      current_match: 1,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-09-22",
      end_time: "17:00",
    },
    {
      start_date: "2026-09-23",
      name: "Open 1",
      current_match: 2,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-09-24",
      end_time: "17:00",
    },
    {
      start_date: "2026-09-28",
      name: "Open 1",
      current_match: 3,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-09-29",
      end_time: "17:00",
    },
    {
      start_date: "2026-09-30",
      name: "Open 1",
      current_match: 4,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-10-01",
      end_time: "17:00",
    },
    {
      start_date: "2026-10-05",
      name: "Open 1",
      current_match: 5,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-10-06",
      end_time: "17:00",
    },
    {
      start_date: "2026-10-07",
      name: "Open 1",
      current_match: 6,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-10-08",
      end_time: "17:00",
    },
    {
      start_date: "2026-10-12",
      name: "Open 1",
      current_match: 7,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-10-13",
      end_time: "17:00",
    },
    {
      start_date: "2026-10-14",
      name: "Open 1",
      current_match: 8,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-10-15",
      end_time: "17:00",
    },
    {
      start_date: "2026-10-26",
      name: "Open 2",
      current_match: 1,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-10-27",
      end_time: "17:00",
    },
    {
      start_date: "2026-10-28",
      name: "Open 2",
      current_match: 2,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-10-29",
      end_time: "17:00",
    },
    {
      start_date: "2026-11-02",
      name: "Open 2",
      current_match: 3,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-11-03",
      end_time: "17:00",
    },
    {
      start_date: "2026-11-04",
      name: "Open 2",
      current_match: 4,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-11-05",
      end_time: "17:00",
    },
    {
      start_date: "2026-11-09",
      name: "Open 2",
      current_match: 5,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-11-10",
      end_time: "17:00",
    },
    {
      start_date: "2026-11-11",
      name: "Open 2",
      current_match: 6,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-11-12",
      end_time: "17:00",
    },
    {
      start_date: "2026-11-16",
      name: "Open 2",
      current_match: 7,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-11-17",
      end_time: "17:00",
    },
    {
      start_date: "2026-11-18",
      name: "Open 2",
      current_match: 8,
      total_match: 8,
      start_time: "18:00",
      end_date: "2026-11-19",
      end_time: "17:00",
    },
  ],
};

async function updateLeaderboardTagText(customDate = null) {
  if (typeof document === "undefined") return;

  // Early exit if tag container is not found on page
  const tagContainers = document.querySelectorAll("[data-ptl-date]");
  if (!tagContainers || tagContainers.length === 0) return;

  // 1. Resolve effective date/time (customDate, manual override, or API with system fallback)
  let now = customDate instanceof Date ? customDate : null;
  if (!now) {
    if (
      PTL_TIME_CONFIG &&
      PTL_TIME_CONFIG.is_live === false &&
      PTL_TIME_CONFIG.manual_datetime
    ) {
      const parsed = new Date(PTL_TIME_CONFIG.manual_datetime);
      now = !isNaN(parsed.getTime()) ? parsed : new Date();
    } else {
      try {
        const response = await fetch(
          "https://timeapi.io/api/Time/current/zone?timeZone=America/New_York",
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.year && data.month && data.day) {
            const pad = (n) => String(n).padStart(2, "0");
            now = new Date(
              `${data.year}-${pad(data.month)}-${pad(data.day)}T${pad(data.hour || 0)}:${pad(data.minute || 0)}:${pad(data.seconds || 0)}`,
            );
          } else if (data && data.dateTime) {
            now = new Date(data.dateTime);
          }
        }
      } catch (e) {
        console.warn("[PTL Time] Time API failed, fallback to system time:", e);
      }
      if (!now || isNaN(now.getTime())) now = new Date();
    }
  }

  // 2. Format to comparable ISO string
  const pad = (n) => String(n).padStart(2, "0");
  const nowIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  // 3. Match against schedule to determine active match and live state
  const matches = PTL_MATCH_SCHEDULE.matches || [];
  let matchedItem = null;
  let isLive = false;

  // Check if within any active match window
  for (const m of matches) {
    const startIso = `${m.start_date}T${m.start_time || "00:00"}:00`;
    const endIso = `${m.end_date}T${m.end_time || "23:59"}:00`;
    if (nowIso >= startIso && nowIso <= endIso) {
      matchedItem = m;
      isLive = true;
      break;
    }
  }

  // If not currently live, check for next upcoming match
  if (!matchedItem) {
    for (const m of matches) {
      const startIso = `${m.start_date}T${m.start_time || "00:00"}:00`;
      if (nowIso < startIso) {
        matchedItem = m;
        break;
      }
    }
  }

  // Fallback: all matches finished
  if (!matchedItem && matches.length > 0) {
    matchedItem = matches[matches.length - 1];
  }

  if (!matchedItem) return;

  // 4. Generate text and inner HTML
  const baseText = `${String(matchedItem.name).toUpperCase()} · MATCH ${matchedItem.current_match} OF ${matchedItem.total_match}`;
  const fullText = isLive ? `LIVE NOW · ${baseText}` : baseText;
  const circleHTML = isLive
    ? '<div class="ptl-leader-tag-crcl"></div>'
    : '<div class="ptl-leader-tag-crcl" style="display: none;"></div>';

  // Inject inner HTML into containers
  tagContainers.forEach((container) => {
    container.innerHTML = `
${circleHTML}
<div class="ptl-leader-tag-txt">${fullText}</div>
`.trim();
  });
}

// Auto-run when ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      updateLeaderboardTagText(),
    );
  } else {
    updateLeaderboardTagText();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PTL_TIME_CONFIG,
    PTL_MATCH_SCHEDULE,
    updateLeaderboardTagText,
  };
}
