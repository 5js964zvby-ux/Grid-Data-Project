const workflowData = [
  {
    icon: "01",
    title: "Raw Grid Data",
    caption: "Historical hourly records",
    input: "Approximately ten years of timestamped MW, MVAR, metadata, and data-quality information.",
    process: "The workflow identifies source files and extracts the records required for analysis.",
    output: "A complete collection of raw historical operating records.",
    value: "Establishes the source material needed to understand long-term system behavior."
  },
  {
    icon: "02",
    title: "Parse & Clean",
    caption: "Standardized, validated values",
    input: "Raw records with inconsistent names, formats, and occasional invalid telemetry.",
    process: "Timestamps and measurements are parsed, names are standardized, and missing or impossible values are handled.",
    output: "Consistent, analysis-ready records.",
    value: "Prevents poor-quality data from distorting statistics, visualizations, and conclusions."
  },
  {
    icon: "03",
    title: "Searchable Database",
    caption: "Structured historical records",
    input: "Cleaned records and standardized component metadata.",
    process: "Records are organized and imported into a structured database for repeatable retrieval.",
    output: "A searchable historical data source.",
    value: "Reduces time spent manually locating and combining years of operating information."
  },
  {
    icon: "04",
    title: "Statistical Analysis",
    caption: "Patterns, ranges, and behavior",
    input: "Structured component-level historical data.",
    process: "The workflow calculates averages, extrema, standard deviation, skewness, and power-factor behavior.",
    output: "Comparable statistical summaries for each component and period.",
    value: "Helps engineers identify typical behavior, variation, and unusual conditions."
  },
  {
    icon: "05",
    title: "Visual Reports",
    caption: "Automated engineering plots",
    input: "Historical records and calculated statistics.",
    process: "Automated reports generate time-series plots, rolling averages, seasonal overlays, markers, and event views.",
    output: "Clear visual summaries of long-term behavior.",
    value: "Makes patterns easier to interpret and communicate during engineering studies."
  },
  {
    icon: "06",
    title: "Engineering Decisions",
    caption: "Faster, defensible insight",
    input: "Clean data, statistics, and visual reports.",
    process: "Engineers apply the results to studies, modeling, planning, compliance, and ad hoc investigations.",
    output: "Repeatable evidence that supports technical decisions.",
    value: "Shortens analysis time and improves consistency across future engineering work."
  }
];

let activeStep = 0;

const workflowSteps = document.getElementById("workflowSteps");
const detailDots = document.getElementById("detailDots");

workflowData.forEach((step, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "workflow-step";
  button.setAttribute("aria-label", `Open stage ${index + 1}: ${step.title}`);
  button.innerHTML = `
    <span class="workflow-icon">${step.icon}</span>
    <span class="workflow-title">${step.title}</span>
    <span class="workflow-caption">${step.caption}</span>
  `;
  button.addEventListener("click", () => showWorkflowStep(index, true));
  workflowSteps.appendChild(button);

  const dot = document.createElement("span");
  dot.className = "detail-dot";
  dot.setAttribute("aria-hidden", "true");
  detailDots.appendChild(dot);
});

function showWorkflowStep(index, scrollIntoView = false) {
  activeStep = (index + workflowData.length) % workflowData.length;
  const step = workflowData[activeStep];

  document.getElementById("detailNumber").textContent =
    `STAGE ${String(activeStep + 1).padStart(2, "0")}`;
  document.getElementById("detailTitle").textContent = step.title;
  document.getElementById("detailInput").textContent = step.input;
  document.getElementById("detailProcess").textContent = step.process;
  document.getElementById("detailOutput").textContent = step.output;
  document.getElementById("detailValue").textContent = step.value;

  document.querySelectorAll(".workflow-step").forEach((button, buttonIndex) => {
    const isActive = buttonIndex === activeStep;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.querySelectorAll(".detail-dot").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeStep);
  });

  if (scrollIntoView && window.innerWidth < 800) {
    document.getElementById("workflowDetail").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

document.getElementById("prevStep").addEventListener("click", () => {
  showWorkflowStep(activeStep - 1);
});

document.getElementById("nextStep").addEventListener("click", () => {
  showWorkflowStep(activeStep + 1);
});

showWorkflowStep(0);

/* Scroll reveal */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach(element => {
  revealObserver.observe(element);
});

/* Animated counters */
function formatCounter(value) {
  return value >= 1000 ? value.toLocaleString("en-US") : String(value);
}

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.target);
      const duration = target > 1000 ? 1500 : 900;
      const start = performance.now();

      function updateCounter(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        element.textContent = formatCounter(current);

        if (progress < 1) requestAnimationFrame(updateCounter);
      }

      requestAnimationFrame(updateCounter);
      counterObserver.unobserve(element);
    });
  },
  { threshold: 0.55 }
);

document.querySelectorAll(".counter").forEach(counter => {
  counterObserver.observe(counter);
});

/* Animate graph once it becomes visible */
const chartCard = document.querySelector(".chart-card");

const chartObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        chartCard.classList.add("chart-animate");
        chartObserver.unobserve(chartCard);
      }
    });
  },
  { threshold: 0.35 }
);

chartObserver.observe(chartCard);

/* Footer year */
document.getElementById("year").textContent = new Date().getFullYear();
