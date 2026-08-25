---
title: "Conductor Agent"
date: 2026-07-21
updated: 2026-07-21
excerpt: "Conductor is the orchestration control plane for run execution. It manages stage movement, run-plan context, and state reconciliation across agent outcomes."
agent: "Conductor"
---

### Overview

Conductor is the orchestration control plane for run execution. It manages stage movement, run-plan context, and state reconciliation across agent outcomes.

### Business Value

- Maintains execution order and pipeline integrity.
- Provides auditability for stage-by-stage progression.
- Supports controlled recovery for partial or mixed outcomes.

### Core Responsibilities

- Maintain run plan and orchestration state.
- Route execution and reconcile per-agent outcomes.
- Preserve traceable run-level audit artifacts.

### Key Inputs

- Engagement context, target-state model, and stage status envelopes.

### Key Outputs

- Orchestration timeline, reconciled state transitions, audit trail.

### Governance and Controls

- Strict precondition and transition handling.
- Non-destructive reconciliation semantics.

### Typical CTA Page Metadata

- Slug: /docs/agents/conductor
- Primary Audience: Platform operators, delivery leads, architecture governance.
