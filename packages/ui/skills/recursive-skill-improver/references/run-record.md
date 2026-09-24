# Benchmark run record

Complete this record from the run's transcript and captured artifacts. Use
`n/a` when a milestone was never reached; do not infer missing values.

## Run identity

| Field                      | Value                         |
| -------------------------- | ----------------------------- |
| Run number                 |                               |
| Valid run                  | yes / no                      |
| Invalid reason             |                               |
| Task                       |                               |
| Agent                      |                               |
| Target repository revision |                               |
| Skill-source revision      |                               |
| Start time                 |                               |
| End time                   |                               |
| Exit reason                | completed / timeout / failure |

## Measured milestones

| Metric                                    | Value    |
| ----------------------------------------- | -------- |
| Time to first product edit                |          |
| Time to first lint                        |          |
| Time to first test run                    |          |
| Time to green tests                       |          |
| Time to coverage threshold                |          |
| Agent turns                               |          |
| Agent tool calls                          |          |
| Project/dependency/global source searches |          |
| Avoidable retries                         |          |
| Full task lifecycle completed             | yes / no |

## Undesirable behaviors

For every behavior, cite the relevant transcript location or artifact.

| Evidence | Triggering question or failure | Impact | Classification                               |
| -------- | ------------------------------ | ------ | -------------------------------------------- |
|          |                                |        | knowledge / navigation / adherence / harness |

## Improvement decision

| Field                                  | Value |
| -------------------------------------- | ----- |
| Highest-value actionable finding       |       |
| Authoritative owning skill/reference   |       |
| Generalized lesson                     |       |
| Why existing guidance was insufficient |       |
| Validation performed                   |       |
| Local commit                           |       |
| If no change, why not                  |       |

## Convergence

Check every condition:

- [ ] No source search was needed to answer a question the skill should have
      answered.
- [ ] No hallucinated or incorrect API was attempted.
- [ ] No avoidable retry resulted from skill guidance.
- [ ] Implementation and required verification completed within the timebox.
- [ ] No actionable knowledge or navigation gap remains.

Run result: **clean / not clean**

Consecutive clean valid runs: **0 / 1 / 2**
