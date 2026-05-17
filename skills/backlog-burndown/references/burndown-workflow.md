# Backlog Burndown Workflow

1. Define scope window (sprint or milestone) and freeze baseline issue set.
2. Pull current state counts by status (Todo, In Progress, Blocked, Done).
3. Compute ideal burn line and actual burn line by day.
4. Highlight variance, blocked-item concentration, and new-scope injection.
5. Produce a short action plan:
   - remove or defer low-priority items
   - reassign owners for blocked work
   - tighten WIP to increase completion flow

## Report Template

```text
Backlog Burndown — <date>
- Baseline scope: <count>
- Remaining scope: <count>
- Days left: <count>
- Required daily burn: <x/day>
- Actual daily burn: <x/day>
- Variance: <+/-> <x/day>
- Blocked items: <count>

Risk: Low | Medium | High
Actions:
1) ...
2) ...
3) ...
```
