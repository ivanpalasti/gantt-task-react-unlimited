import React from "react";
import { Task, ViewMode, Gantt } from "gantt-task-react-unlimited";
import { ViewSwitcher } from "./components/view-switcher";
import { getStartEndDateForProject, initTasks } from "./helper";
import "gantt-task-react-unlimited/dist/index.css";

// Init
const App = () => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = React.useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = React.useState(true);
  const [baselineView, setBaselineView] = React.useState<"planned" | "actual">(
    "planned"
  );
  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  // Preprocess tasks so start/end reflect baselineView, and baseline fields are always the "other"
  const processedTasks = tasks.map(task => {
    if (baselineView === "planned" && task.plannedStart && task.plannedEnd) {
      return {
        ...task,
        start: task.plannedStart,
        end: task.plannedEnd,
        actualStart: task.actualStart ?? task.start,
        actualEnd: task.actualEnd ?? task.end,
        plannedStart: task.plannedStart,
        plannedEnd: task.plannedEnd,
      };
    }
    if (baselineView === "actual" && task.actualStart && task.actualEnd) {
      return {
        ...task,
        start: task.actualStart,
        end: task.actualEnd,
        plannedStart: task.plannedStart ?? task.start,
        plannedEnd: task.plannedEnd ?? task.end,
        actualStart: task.actualStart,
        actualEnd: task.actualEnd,
      };
    }
    return task;
  });

  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map(t => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project = newTasks[newTasks.findIndex(t => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map(t =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    console.log("On Click event Id:" + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  return (
    <div className="Wrapper">
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <div style={{ margin: "1em 0" }}>
        <label>
          <input
            type="radio"
            name="baselineView"
            value="planned"
            checked={baselineView === "planned"}
            onChange={() => setBaselineView("planned")}
          />{" "}
          Planned (main bar shows planned, baseline shows actual)
        </label>
        <label style={{ marginLeft: "1em" }}>
          <input
            type="radio"
            name="baselineView"
            value="actual"
            checked={baselineView === "actual"}
            onChange={() => setBaselineView("actual")}
          />{" "}
          Actual (main bar shows actual, baseline shows planned)
        </label>
      </div>
      <h3>Gantt With Unlimited Height</h3>
      <Gantt
        tasks={processedTasks}
        viewMode={view}
        baselineView={baselineView}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        columnWidth={columnWidth}
      />
      <h3>Gantt With Limited Height</h3>
      <Gantt
        tasks={processedTasks}
        viewMode={view}
        baselineView={baselineView}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        ganttHeight={300}
        columnWidth={columnWidth}
      />
    </div>
  );
};

export default App;
