/* ActiveReader lesson-plan authoring scaffold.
 *
 * This module does not run LLM agents. It is a deterministic compiler that turns
 * a concept graph into lesson artifacts the ActiveReader runtime can execute:
 *
 *   concept graph
 *     -> narrative
 *     -> lesson scaffold { meta, problem, viz_requirements, nodes[] }
 *     -> act_specs / gate_specs / viz_spec
 *     -> lesson-engine LessonPlan + adaptive roadmap
 *
 * Product-specific apps can plug in different policies. In this clean repo it is
 * used as a local fallback/planning scaffold, not as a live multi-agent pipeline.
 */

const ACTIVE_READER_POLICY = {
  id: 'active_reader_pdf',
  modality_targets: ['chat', 'pdf_highlight', 'figure', 'concept_graph'],
  stateKind: 'CONCEPT',
  branchKind: 'REMEDIATION',
  gateKind: 'short_answer',
  vizPanel: 'figure',
  cardType: 'text',
  actKinds: ['HOOK', 'EXPLAIN', 'PRACTICE', 'RECAP'],
};

const VIDEO_EXPLAINER_POLICY = {
  id: 'video_explainer',
  modality_targets: ['voiceover', 'timeline', 'visual_sequence', 'caption'],
  stateKind: 'CONCEPT',
  branchKind: 'REMEDIATION',
  gateKind: 'checkpoint',
  vizPanel: 'svg',
  cardType: 'title',
  actKinds: ['HOOK', 'VISUAL_EXPLAIN', 'EXAMPLE', 'CHECK', 'RECAP'],
};

function planLessonFromConceptGraph(graph, options = {}) {
  const policy = options.policy || ACTIVE_READER_POLICY;
  const artifacts = buildSocraticArtifacts(graph, { ...options, policy });
  return compileSocraticArtifactsToLessonPlan(artifacts, graph, { ...options, policy });
}

function planAgenticLesson(graph, options = {}) {
  return buildSocraticArtifacts(graph, options);
}

function compileAgentPlan(agentPlan, graph, options = {}) {
  return compileSocraticArtifactsToLessonPlan(agentPlan, graph, options);
}

function buildSocraticArtifacts(graph, options = {}) {
  const policy = options.policy || ACTIVE_READER_POLICY;
  const concepts = (graph.concepts || []).filter(c => c && c.id);
  if (!concepts.length) throw new Error('concept graph must contain at least one concept');

  const byId = new Map(concepts.map(c => [c.id, c]));
  const orderedIds = orderConcepts(concepts, graph.edges || {});
  const narrative = buildNarrative(graph, orderedIds, byId, policy);
  const socraticPlan = buildSocraticPlan(graph, orderedIds, byId, policy);
  const actSpecs = {};
  const gateSpecs = {};

  for (const node of socraticPlan.nodes) {
    if (node.type === 'act') {
      actSpecs[node.id] = buildActSpec(node, byId, policy);
    } else if (node.type === 'gate') {
      gateSpecs[node.id] = buildGateSpec(node, policy);
      for (const branchAct of node.wrong_path_acts || []) {
        actSpecs[branchAct.id] = buildActSpec(branchAct, byId, policy, true);
      }
    }
  }

  const vizSpec = buildVizSpec(socraticPlan, policy);
  assertSocraticArtifacts({ socratic_plan: socraticPlan, act_specs: actSpecs, gate_specs: gateSpecs, viz_spec: vizSpec });

  return {
    meta: {
      title: socraticPlan.meta.title,
      source_type: 'concept_graph',
      planner: 'socratic_artifact_scaffold_js_v1',
      policy: policy.id,
      modality_targets: policy.modality_targets,
      graph_meta: graph.meta || {},
      learner_context: options.learner_context || {},
    },
    agents: [
      { id: 'solution_planner', stage: 1, output: 'narrative', visibility: 'blind' },
      { id: 'structure_agent', stage: 2, output: 'socratic_plan', visibility: 'blind' },
      { id: 'act_worker', stage: 3, output: 'act_specs', visibility: 'blind' },
      { id: 'gate_worker', stage: 3, output: 'gate_specs', visibility: 'blind' },
      { id: 'viz_worker', stage: 4, output: 'viz_spec', visibility: 'blind' },
      { id: 'assembler', stage: 5, output: 'LessonPlan', visibility: 'deterministic' },
      { id: 'reviewer', stage: 6, output: 'qa_notes', visibility: 'sighted_optional' },
    ],
    ordered_concept_ids: orderedIds,
    objectives: orderedIds.map(id => {
      const concept = byId.get(id);
      const title = concept.title || id;
      return {
        concept_id: id,
        objective: `Learner can explain ${title} and connect it to prerequisites or nearby ideas.`,
      };
    }),
    narrative,
    socratic_plan: socraticPlan,
    act_specs: actSpecs,
    gate_specs: gateSpecs,
    viz_spec: vizSpec,
  };
}

function buildNarrative(graph, orderedIds, byId, policy) {
  const title = graph.chapterTitle || graph.meta?.title || byId.get(orderedIds[0])?.position?.chapter_title || 'Concept Graph Lesson';
  const lines = [
    `# ${title}`,
    '',
    `Policy: ${policy.id}`,
    '',
    'Teaching arc:',
  ];
  for (const id of orderedIds) {
    const concept = byId.get(id);
    lines.push(`- Teach ${concept.title || id}: ${concept.one_liner || 'establish the core idea and check understanding.'}`);
  }
  return lines.join('\n');
}

function buildSocraticPlan(graph, orderedIds, byId, policy) {
  const title = graph.chapterTitle || graph.meta?.title || byId.get(orderedIds[0])?.position?.chapter_title || 'Concept Graph Lesson';
  const nodes = [];

  for (const id of orderedIds) {
    const concept = byId.get(id);
    const act = buildActNode(concept, policy);
    nodes.push(act);
    nodes.push({
      type: 'gate',
      id: `gate_${safeId(id)}_check`,
      gate_type: 'quiz',
      after_act: act.id,
      question_hint: `Can you explain ${concept.title || id} in your own words?`,
      wrong_path_hint: `Repair missing understanding for ${concept.title || id}.`,
      wrong_path_acts: [buildBranchActNode(concept, policy)],
    });
  }

  for (let i = 0; i < orderedIds.length - 1; i += 1) {
    nodes.push({
      type: 'marker',
      label: 'next concept',
      after_act: `act_${safeId(orderedIds[i])}`,
    });
  }

  return {
    meta: {
      title,
      source: graph.meta?.source || 'concept_graph',
      estimated_duration_minutes: Math.max(5, orderedIds.length * 3),
    },
    problem: {
      text: title,
      highlight: `Learn ${orderedIds.length} connected concepts.`,
    },
    viz_requirements: {
      type: policy.id === 'video_explainer' ? 'custom' : 'none',
      description: `Use ${policy.id} modality affordances to support concept explanations.`,
      actions: modalityActions(policy),
      viewBox: '0 0 760 520',
    },
    nodes,
  };
}

function buildActNode(concept, policy) {
  const id = concept.id;
  const title = concept.title || id;
  return {
    type: 'act',
    id: `act_${safeId(id)}`,
    title,
    objective: `Learner understands ${title} well enough to explain it.`,
    viz_panel: policy.vizPanel,
    context_from_previous: prereqSummary(concept),
    concept_id: id,
    beat_outline: [
      {
        narration_hint: concept.motivation_md || `Start with why ${title} matters.`,
        card_type: policy.cardType,
        viz_actions: ['focusConcept'],
        inline_at_end: false,
      },
      {
        narration_hint: concept.content || concept.one_liner || `Explain ${title}.`,
        card_type: policy.cardType,
        viz_actions: ['highlightSource'],
        inline_at_end: true,
      },
      {
        narration_hint: concept.recap_md || `Recap ${title} in one sentence.`,
        card_type: 'recap',
        viz_actions: [],
        inline_at_end: false,
      },
    ],
  };
}

function buildBranchActNode(concept, policy) {
  const id = concept.id;
  const title = concept.title || id;
  return {
    type: 'act',
    id: `act_${safeId(id)}_remediation`,
    title: `Review: ${title}`,
    objective: `Repair the missing prerequisite or misconception for ${title}.`,
    viz_panel: policy.vizPanel,
    context_from_previous: `Learner struggled with ${title}.`,
    concept_id: id,
    beat_outline: [
      {
        narration_hint: concept.one_liner || `Restate ${title} more simply.`,
        card_type: 'recap',
        viz_actions: ['highlightSource'],
        inline_at_end: true,
      },
      {
        narration_hint: `Ask the learner to try ${title} again.`,
        card_type: 'text',
        viz_actions: [],
      },
    ],
  };
}

function buildActSpec(node, byId, policy, isBranch = false) {
  const concept = byId.get(node.concept_id) || {};
  return {
    act_id: node.id,
    title: node.title,
    viz_panel: node.viz_panel ?? null,
    beats: (node.beat_outline || []).map((outline, index) => ({
      say: outline.narration_hint,
      card: cardForOutline(outline, concept, index, isBranch),
      viz_actions: (outline.viz_actions || []).map(method => ({
        method,
        params: {
          concept_id: node.concept_id,
          title: node.title,
          policy: policy.id,
        },
      })),
      inline_viz: outline.inline_at_end ? node.viz_panel || true : null,
    })),
  };
}

function learnerFacingQuestion(text) {
  return String(text || '')
    .replace(/^Can the learner explain\b/i, 'Can you explain')
    .replace(/\bthe learner\b/gi, 'you')
    .replace(/\btheir own words\b/gi, 'your own words');
}

function buildGateSpec(node, policy) {
  return {
    gate_id: node.id,
    gate_type: node.gate_type,
    after_act: node.after_act,
    label: null,
    question: learnerFacingQuestion(node.question_hint || 'Check understanding.'),
    options: [
      'I can explain the core idea clearly.',
      'I am partly there but need a hint.',
      'I am stuck.',
    ],
    correct: 0,
    explanations: {
      correct: 'Great. Continue to the next concept.',
      1: 'Use the support branch, then recheck.',
      2: 'Review the concept with a simpler explanation.',
    },
    wrong_path_acts: (node.wrong_path_acts || []).map(act => act.id),
    modality_policy: policy.id,
  };
}

function buildVizSpec(socraticPlan, policy) {
  return {
    mode: policy.id === 'video_explainer' ? 'custom_code' : 'preset',
    preset: policy.id === 'active_reader_pdf' ? 'active_reader_pdf' : null,
    config: {
      policy: policy.id,
      modality_targets: policy.modality_targets,
    },
    actions_implemented: [...new Set(
      (socraticPlan.viz_requirements?.actions || []).map(action => action.method)
    )],
  };
}

function compileSocraticArtifactsToLessonPlan(artifacts, graph, options = {}) {
  const policy = options.policy || ACTIVE_READER_POLICY;
  const concepts = (graph.concepts || []).filter(c => c && c.id);
  const byId = new Map(concepts.map(c => [c.id, c]));
  const actToConcept = new Map();
  const states = {};
  const gates = [];
  const mainPath = [];
  const markers = [];

  for (const node of artifacts.socratic_plan.nodes) {
    if (node.type === 'act') {
      const conceptId = node.concept_id || conceptFromActId(node.id, byId);
      actToConcept.set(node.id, conceptId);
      const concept = byId.get(conceptId) || {};
      states[conceptId] = {
        kind: policy.stateKind,
        payload: {
          concept_id: conceptId,
          title: concept.title || node.title || conceptId,
          one_liner: concept.one_liner || '',
          content: concept.content || '',
          recap: concept.recap_md || '',
          key_passage: concept.key_passage || concept.slots?.key_passage || null,
          position: concept.position || {},
          aliases: concept.aliases || [],
          tags: concept.tags || [],
          objective: node.objective,
          beats: artifacts.act_specs[node.id]?.beats || [],
          act_id: node.id,
          gate_id: `gate_${safeId(conceptId)}_check`,
          modality_policy: policy.id,
        },
        is_branch: false,
      };
      mainPath.push(conceptId);
    } else if (node.type === 'gate') {
      const conceptId = actToConcept.get(node.after_act) || conceptFromActId(node.after_act, byId);
      const gateSpec = artifacts.gate_specs[node.id] || {};
      const branchIds = [];
      for (const branchAct of node.wrong_path_acts || []) {
        const branchStateId = `${conceptId}__hint`;
        const concept = byId.get(conceptId) || {};
        states[branchStateId] = {
          kind: policy.branchKind,
          payload: {
            concept_id: conceptId,
            title: concept.title || branchAct.title || conceptId,
            prompt: branchAct.objective || `Review ${concept.title || conceptId}.`,
            content: concept.one_liner || concept.content || '',
            key_passage: concept.key_passage || concept.slots?.key_passage || null,
            position: concept.position || {},
            beats: artifacts.act_specs[branchAct.id]?.beats || [],
            act_id: branchAct.id,
            modality_policy: policy.id,
          },
          is_branch: true,
        };
        branchIds.push(branchStateId);
      }
      gates.push({
        id: `gate__${conceptId}`,
        after_state: conceptId,
        kind: policy.gateKind,
        payload: {
          concept_id: conceptId,
          question: learnerFacingQuestion(gateSpec.question || node.question_hint || 'Check understanding.'),
          options: gateSpec.options || [],
          correct: gateSpec.correct ?? 0,
          explanations: gateSpec.explanations || {},
          pass_criteria: [
            'mentions the core definition or mechanism',
            'connects it to related or prerequisite concepts when relevant',
          ],
          socratic_gate_id: node.id,
        },
        branch_on_fail: branchIds,
        rejoin_to: null,
      });
    } else if (node.type === 'marker') {
      const conceptId = actToConcept.get(node.after_act) || conceptFromActId(node.after_act, byId);
      if (conceptId) markers.push({ id: `marker__${conceptId}`, after_state: conceptId, label: node.label || 'continue' });
    }
  }

  return {
    meta: {
      id: `chapter_${graph.meta?.chapter || concepts[0]?.position?.chapter || 'unknown'}_lesson`,
      title: artifacts.socratic_plan.meta.title,
      source_type: 'socratic_agentic_concept_graph',
      planner: artifacts.meta.planner,
      policy: policy.id,
      modality_targets: policy.modality_targets,
      concept_count: mainPath.length,
      objectives: artifacts.objectives,
      agents: artifacts.agents,
      artifact_contract: 'ActiveReader deterministic lesson scaffold',
    },
    states,
    markers: dedupeMarkers(markers, states),
    gates,
    main_path: mainPath,
    agent_plan: artifacts,
    roadmap: buildAdaptiveRoadmapFromSocraticArtifacts(artifacts, graph, byId, mainPath),
  };
}

function buildAdaptiveRoadmapFromSocraticArtifacts(artifacts, graph, byId, mainPath) {
  const nodes = [];
  const edges = [];
  const sections = [];
  const seenSections = new Map();

  mainPath.forEach((conceptId, index) => {
    const concept = byId.get(conceptId) || {};
    const pos = concept.position || {};
    const sectionId = pos.section || 'chapter';
    const sectionTitle = pos.section_title || pos.chapter_title || 'Chapter';
    if (!seenSections.has(sectionId)) {
      seenSections.set(sectionId, {
        id: `section__${sectionId.replace(/[^a-z0-9]+/gi, '_')}`,
        section: sectionId,
        title: sectionTitle,
        concept_ids: [],
      });
    }
    seenSections.get(sectionId).concept_ids.push(conceptId);

    const actId = `act_${safeId(conceptId)}`;
    const gateId = `gate__${conceptId}`;
    const branchIds = [
      `${conceptId}__probe`,
      `${conceptId}__hint`,
      `${conceptId}__worked_example`,
      `${conceptId}__remediate`,
      `${conceptId}__review`,
    ];

    nodes.push({
      id: conceptId,
      type: 'concept',
      title: concept.title || conceptId,
      section: sectionId,
      section_title: sectionTitle,
      order: index + 1,
      objective: artifacts.socratic_plan.nodes.find(n => n.id === actId)?.objective || '',
      status_model: ['not_started', 'current', 'practiced', 'mastered', 'needs_review', 'review_due'],
      substates: (artifacts.act_specs[actId]?.beats || []).map((beat, beatIndex) => ({
        id: `${conceptId}::beat_${beatIndex + 1}`,
        kind: 'BEAT',
        source: 'active_reader.act_spec.beats',
        intent: beat.say,
        modality_hints: artifacts.meta.modality_targets,
      })),
    });
    nodes.push({
      id: gateId,
      type: 'gate',
      title: 'understanding check',
      parent: conceptId,
      branch_rules: [
        { event: 'correct', to: mainPath[index + 1] || 'chapter_complete' },
        { event: 'partial', to: branchIds[0] },
        { event: 'wrong_first', to: branchIds[1] },
        { event: 'wrong_second', to: branchIds[2] },
        { event: 'stuck', to: branchIds[3] },
      ],
    });
    nodes.push({ id: branchIds[0], type: 'probe', title: 'clarifying probe', parent: conceptId });
    nodes.push({ id: branchIds[1], type: 'hint', title: 'targeted hint', parent: conceptId });
    nodes.push({ id: branchIds[2], type: 'worked_example', title: 'worked example', parent: conceptId });
    nodes.push({ id: branchIds[3], type: 'remediation', title: 'remediation mini-lesson', parent: conceptId });
    nodes.push({ id: branchIds[4], type: 'review', title: 'spaced review', parent: conceptId });

    edges.push({ from: conceptId, to: gateId, event: 'ready_for_check', kind: 'check' });
    edges.push({ from: gateId, to: branchIds[0], event: 'partial', kind: 'adaptive_branch' });
    edges.push({ from: gateId, to: branchIds[1], event: 'wrong_first', kind: 'adaptive_branch' });
    edges.push({ from: gateId, to: branchIds[2], event: 'wrong_second', kind: 'adaptive_branch' });
    edges.push({ from: gateId, to: branchIds[3], event: 'stuck', kind: 'adaptive_branch' });
    edges.push({ from: conceptId, to: branchIds[4], event: 'review_due', kind: 'scheduler_branch' });
    for (const branchId of branchIds.slice(0, 4)) edges.push({ from: branchId, to: gateId, event: 'retry', kind: 'loop' });
    if (mainPath[index + 1]) edges.push({ from: gateId, to: mainPath[index + 1], event: 'correct', kind: 'advance' });
  });

  for (const edgeGroup of Object.values(graph.edges || {})) {
    if (!Array.isArray(edgeGroup)) continue;
    for (const edge of edgeGroup) {
      if (!byId.has(edge.from) || !byId.has(edge.to)) continue;
      edges.push({
        from: edge.to,
        to: edge.from,
        event: edge.kind || 'related',
        kind: edge.kind === 'requires' ? 'prerequisite' : 'concept_relation',
        rationale: edge.rationale || '',
        strength: edge.strength ?? null,
      });
    }
  }

  sections.push(...seenSections.values());
  const worldMap = buildChapterWorldMapFSM(graph, mainPath, byId, sections);
  return {
    version: 2,
    view: 'chapter_adaptive_roadmap',
    planner: artifacts.meta.planner,
    policy: artifacts.meta.policy,
    artifact_contract: 'ActiveReader deterministic lesson scaffold',
    sections,
    nodes,
    edges,
    world_map: worldMap,
    exposed_to_user: {
      default: ['concept', 'gate', 'hint', 'worked_example', 'remediation', 'review'],
      advanced: ['probe', 'prerequisite', 'concept_relation', 'substates'],
    },
  };
}

function buildChapterWorldMapFSM(graph, orderedIds, byId, sections) {
  const nodes = [];
  const edges = [];
  const addNode = (node) => nodes.push(node);
  const addEdge = (edge) => edges.push(edge);
  const conceptsBySection = new Map();

  for (const id of orderedIds) {
    const concept = byId.get(id);
    const section = concept?.position?.section || 'chapter';
    if (!conceptsBySection.has(section)) conceptsBySection.set(section, []);
    conceptsBySection.get(section).push(id);
  }

  const grid = {
    originX: 92,
    originY: 128,
    stepX: 88,
    stepY: 74,
    // Keep runs short enough to read as a world-map path, not a timeline.
    cols: 6,
  };
  let tileIndex = 0;
  const nextTile = () => {
    const row = Math.floor(tileIndex / grid.cols);
    const offset = tileIndex % grid.cols;
    const col = row % 2 === 0 ? offset : grid.cols - 1 - offset;
    tileIndex += 1;
    return {
      col,
      row,
      x: grid.originX + col * grid.stepX,
      y: grid.originY + row * grid.stepY,
    };
  };

  const startTile = nextTile();
  addNode({
    id: 'chapter_start',
    type: 'start',
    title: 'Start Chapter',
    x: startTile.x,
    y: startTile.y,
    grid: { col: startTile.col, row: startTile.row },
    state: 'start',
  });

  let prevExit = 'chapter_start';
  const conceptPositions = new Map();
  const occupiedTiles = new Set([`${startTile.col},${startTile.row}`]);
  const occupy = (tile) => occupiedTiles.add(`${tile.col},${tile.row}`);
  const tileToPoint = (col, row) => ({
    col,
    row,
    x: grid.originX + col * grid.stepX,
    y: grid.originY + row * grid.stepY,
  });
  const openAdjacentTile = (tile) => {
    const candidates = [
      { col: tile.col, row: tile.row - 1 },
      { col: tile.col, row: tile.row + 1 },
      { col: tile.col + 1, row: tile.row },
      { col: tile.col - 1, row: tile.row },
    ];
    const candidate = candidates.find(t => (
      t.col >= 0
      && t.col < grid.cols
      && t.row >= 0
      && !occupiedTiles.has(`${t.col},${t.row}`)
    ));
    if (!candidate) return null;
    occupiedTiles.add(`${candidate.col},${candidate.row}`);
    return tileToPoint(candidate.col, candidate.row);
  };

  sections.forEach((section, sectionIndex) => {
    const concepts = conceptsBySection.get(section.section) || [];
    const sectionNodeId = `level__${safeId(section.section)}`;
    const gateNodeId = `section_gate__${safeId(section.section)}`;
    const sectionTile = nextTile();

    addNode({
      id: sectionNodeId,
      type: 'section_level',
      title: `${section.section} ${section.title || ''}`.trim(),
      section: section.section,
      concept_ids: concepts,
      x: sectionTile.x,
      y: sectionTile.y,
      grid: { col: sectionTile.col, row: sectionTile.row },
      state: 'level_card',
    });
    occupy(sectionTile);
    addEdge({
      from: prevExit,
      to: sectionNodeId,
      kind: 'main_path',
      event: 'enter_section',
      route: 'orthogonal',
    });

    let prev = sectionNodeId;
    concepts.forEach((id, conceptIndex) => {
      const concept = byId.get(id);
      const tile = nextTile();
      const coinId = `coin__${id}`;
      conceptPositions.set(id, { x: tile.x, y: tile.y, grid: { col: tile.col, row: tile.row }, nodeId: coinId, section: section.section });
      addNode({
        id: coinId,
        type: 'concept_checkpoint',
        conceptId: id,
        title: concept?.title || id,
        section: section.section,
        order: orderedIds.indexOf(id) + 1,
        x: tile.x,
        y: tile.y,
        grid: { col: tile.col, row: tile.row },
        state: 'concept_coin',
      });
      occupy(tile);
      addEdge({
        from: prev,
        to: coinId,
        kind: 'main_path',
        event: conceptIndex === 0 ? 'start_concept' : 'mastered',
        route: 'orthogonal',
      });
      prev = coinId;
    });

    const gateTile = nextTile();
    addNode({
      id: gateNodeId,
      type: 'mastery_gate',
      title: `${section.section} mastery gate`,
      section: section.section,
      x: gateTile.x,
      y: gateTile.y,
      grid: { col: gateTile.col, row: gateTile.row },
      state: 'section_gate',
    });
    occupy(gateTile);
    addEdge({
      from: prev,
      to: gateNodeId,
      kind: 'mastery_check',
      event: 'section_check',
      route: 'orthogonal',
    });
    prevExit = gateNodeId;
  });

  const completeTile = nextTile();
  addNode({
    id: 'chapter_complete',
    type: 'chapter_complete',
    title: 'Chapter Mastery',
    x: completeTile.x,
    y: completeTile.y,
    grid: { col: completeTile.col, row: completeTile.row },
    state: 'complete',
  });
  occupy(completeTile);
  addEdge({
    from: prevExit,
    to: 'chapter_complete',
    kind: 'main_path',
    event: 'chapter_mastered',
    route: 'orthogonal',
  });

  const prerequisiteEdges = [];
  for (const edge of graph.edges?.prereq || []) {
    if (!byId.has(edge.from) || !byId.has(edge.to)) continue;
    const dependent = conceptPositions.get(edge.from);
    const prereq = conceptPositions.get(edge.to);
    if (!dependent || !prereq) continue;
    const lockId = `lock__${edge.from}__requires__${edge.to}`;
    const helpId = `help__${edge.to}`;
    const helpExists = nodes.some(n => n.id === helpId);

    addNode({
      id: lockId,
      type: 'locked_gate',
      title: 'Prerequisite lock',
      conceptId: edge.from,
      prerequisiteId: edge.to,
      x: dependent.x - 30,
      y: dependent.y - 48,
      state: 'locked_until_prereq',
    });
    if (!helpExists) {
      addNode({
        id: helpId,
        type: 'help_house',
        title: `Review ${byId.get(edge.to)?.title || edge.to}`,
        targetConceptId: edge.to,
        x: prereq.x,
        y: prereq.y + 72,
        state: 'remediation_route',
      });
    }
    addEdge({
      from: lockId,
      to: prereq.nodeId,
      kind: 'prerequisite_lock',
      event: 'requires',
      route: 'orthogonal',
      rationale: edge.rationale || '',
    });
    addEdge({
      from: lockId,
      to: helpId,
      kind: 'help_route',
      event: 'failed_prereq_check',
      route: 'orthogonal',
      rationale: edge.rationale || '',
    });
    addEdge({
      from: helpId,
      to: dependent.nodeId,
      kind: 'return_route',
      event: 'retry_after_review',
      route: 'orthogonal',
    });
    const prereqDistance = Math.abs(orderedIds.indexOf(edge.from) - orderedIds.indexOf(edge.to));
    if (prereqDistance > 1) {
      addEdge({
        from: dependent.nodeId,
        to: prereq.nodeId,
        kind: 'prerequisite_review_loop',
        event: 'review prerequisite',
        route: 'orthogonal',
        visible_on_world_map: true,
        rationale: edge.rationale || '',
        strength: edge.strength ?? null,
      });
    }
    prerequisiteEdges.push({ from: edge.from, to: edge.to });
  }

  const bridgeEdges = [];
  for (const edge of graph.edges?.overlay || []) {
    if (!byId.has(edge.from) || !byId.has(edge.to)) continue;
    const a = conceptPositions.get(edge.from);
    const b = conceptPositions.get(edge.to);
    if (!a || !b) continue;
    const sameTile = a.x === b.x && a.y === b.y;
    const adjacentInMainPath = Math.abs(orderedIds.indexOf(edge.from) - orderedIds.indexOf(edge.to)) === 1;
    if (sameTile || adjacentInMainPath) continue;
    if ((edge.strength ?? 0) < 0.7) continue;
    if (bridgeEdges.length >= 4) break;
    addEdge({
      from: a.nodeId,
      to: b.nodeId,
      kind: 'related_bridge',
      event: edge.kind || 'related',
      route: 'orthogonal',
      visible_on_world_map: true,
      rationale: edge.rationale || '',
      strength: edge.strength ?? null,
    });
    bridgeEdges.push({ from: edge.from, to: edge.to, kind: edge.kind || 'related' });
  }

  const branchCandidates = [
    ...(graph.edges?.prereq || [])
      .filter(edge => Math.abs(orderedIds.indexOf(edge.from) - orderedIds.indexOf(edge.to)) > 1)
      .map(edge => ({ ...edge, branchKind: 'review_branch', label: 'review' })),
    ...(graph.edges?.overlay || [])
      .filter(edge => (edge.strength ?? 0) >= 0.8)
      .map(edge => ({ ...edge, branchKind: 'related_branch', label: 'connect' })),
  ];
  const branchMarkers = [];
  for (const edge of branchCandidates) {
    if (branchMarkers.length >= 3) break;
    if (!byId.has(edge.from) || !byId.has(edge.to)) continue;
    const source = conceptPositions.get(edge.from);
    if (!source) continue;
    const tile = openAdjacentTile(source.grid);
    if (!tile) continue;
    const branchId = `branch__${safeId(edge.branchKind)}__${safeId(edge.from)}__${branchMarkers.length + 1}`;
    addNode({
      id: branchId,
      type: 'branch_marker',
      title: edge.branchKind === 'review_branch' ? `Review ${byId.get(edge.to)?.title || edge.to}` : `Connect to ${byId.get(edge.to)?.title || edge.to}`,
      branchKind: edge.branchKind,
      sourceConceptId: edge.from,
      targetConceptId: edge.to,
      x: tile.x,
      y: tile.y,
      grid: { col: tile.col, row: tile.row },
      state: 'optional_branch',
    });
    addEdge({
      from: source.nodeId,
      to: branchId,
      kind: 'optional_branch',
      event: edge.label,
      route: 'orthogonal',
      visible_on_world_map: true,
      rationale: edge.rationale || '',
      strength: edge.strength ?? null,
    });
    branchMarkers.push({ from: edge.from, to: edge.to, kind: edge.branchKind });
  }

  return {
    version: 1,
    view: 'chapter_world_map_fsm',
    layout: {
      type: 'serpentine_grid',
      cols: grid.cols,
      origin_x: grid.originX,
      origin_y: grid.originY,
      step_x: grid.stepX,
      step_y: grid.stepY,
    },
    coordinate_system: {
      x: 'discrete grid column',
      y: 'discrete grid row',
    },
    legend: {
      start: 'start chapter',
      section_level: 'level card / section',
      concept_checkpoint: 'coin / concept checkpoint',
      mastery_gate: 'section checkpoint',
      locked_gate: 'prerequisite lock',
      help_house: 'targeted remediation',
      chapter_complete: 'chapter mastery',
    },
    nodes,
    edges,
    sections,
    prerequisite_edges: prerequisiteEdges,
    bridge_edges: bridgeEdges,
    branch_markers: branchMarkers,
  };
}

function orderConcepts(concepts, edges = {}) {
  const ids = new Set(concepts.map(c => c.id).filter(Boolean));
  const byId = new Map(concepts.map(c => [c.id, c]));
  const graph = new Map();
  const indegree = new Map();
  for (const id of ids) {
    graph.set(id, new Set());
    indegree.set(id, 0);
  }
  for (const edge of edges.prereq || []) {
    const dependent = edge.from;
    const prerequisite = edge.to;
    if (!ids.has(dependent) || !ids.has(prerequisite) || dependent === prerequisite) continue;
    if (!graph.get(prerequisite).has(dependent)) {
      graph.get(prerequisite).add(dependent);
      indegree.set(dependent, (indegree.get(dependent) || 0) + 1);
    }
  }

  const cmp = (a, b) => {
    const ak = conceptPositionKey(byId.get(a) || {});
    const bk = conceptPositionKey(byId.get(b) || {});
    for (let i = 0; i < ak.length; i += 1) {
      if (ak[i] < bk[i]) return -1;
      if (ak[i] > bk[i]) return 1;
    }
    return 0;
  };

  const ordered = [];
  let ready = [...ids].filter(id => (indegree.get(id) || 0) === 0).sort(cmp);
  while (ready.length) {
    const id = ready.shift();
    ordered.push(id);
    for (const dep of [...(graph.get(id) || [])].sort(cmp)) {
      indegree.set(dep, indegree.get(dep) - 1);
      if (indegree.get(dep) === 0) ready.push(dep);
    }
    ready.sort(cmp);
  }

  const seen = new Set(ordered);
  return [...ordered, ...[...ids].filter(id => !seen.has(id)).sort(cmp)];
}

function conceptPositionKey(concept) {
  const pos = concept.position || {};
  return [
    pos.book_order ?? Number.MAX_SAFE_INTEGER,
    pos.section_order ?? Number.MAX_SAFE_INTEGER,
    pos.concept_order_in_section ?? Number.MAX_SAFE_INTEGER,
    pos.first_line ?? Number.MAX_SAFE_INTEGER,
    concept.title || concept.id || '',
  ];
}

function modalityActions(policy) {
  const actions = [
    { method: 'focusConcept', description: 'Focus the current concept in the host modality.', params_schema: { concept_id: 'string' } },
    { method: 'highlightSource', description: 'Highlight the source passage, figure, or timeline region.', params_schema: { concept_id: 'string' } },
  ];
  if (policy.id === 'video_explainer') {
    actions.push({ method: 'animateConcept', description: 'Animate the visual explanation for the concept.', params_schema: { concept_id: 'string' } });
  }
  return actions;
}

function cardForOutline(outline, concept, index, isBranch) {
  const type = outline.card_type === 'none' ? 'text' : outline.card_type || 'text';
  if (type === 'recap') {
    return {
      type: 'recap',
      title: isBranch ? 'Review' : 'Recap',
      content: [concept.recap_md || concept.one_liner || outline.narration_hint],
    };
  }
  return {
    type,
    content: outline.narration_hint,
    index: index + 1,
  };
}

function prereqSummary(concept) {
  const pos = concept.position || {};
  if (pos.section_title) return `Current section: ${pos.section_title}`;
  return 'Use prerequisite edges and source order from the concept graph.';
}

function safeId(text) {
  return String(text || 'concept').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'concept';
}

function conceptFromActId(actId, byId) {
  const raw = String(actId || '').replace(/^act_/, '').replace(/_remediation$/, '');
  if (byId.has(raw)) return raw;
  for (const id of byId.keys()) {
    if (safeId(id) === raw) return id;
  }
  return raw;
}

function dedupeMarkers(markers, states) {
  const seen = new Set();
  const deduped = [];
  for (const marker of markers) {
    const key = `${marker.after_state}:${marker.label}`;
    if (!states[marker.after_state] || seen.has(key)) continue;
    seen.add(key);
    deduped.push(marker);
  }
  return deduped;
}

function assertSocraticArtifacts(artifacts) {
  const plan = artifacts.socratic_plan;
  if (!plan?.meta?.title) throw new Error('socratic_plan.meta.title missing');
  if (!plan?.problem?.text) throw new Error('socratic_plan.problem.text missing');
  if (!Array.isArray(plan?.nodes)) throw new Error('socratic_plan.nodes must be an array');
  for (const node of plan.nodes) {
    if (!['act', 'gate', 'marker'].includes(node.type)) throw new Error(`invalid socratic node type ${node.type}`);
    if (node.type === 'act' && !artifacts.act_specs[node.id]) throw new Error(`missing act spec for ${node.id}`);
    if (node.type === 'gate') {
      if (!artifacts.gate_specs[node.id]) throw new Error(`missing gate spec for ${node.id}`);
      if (artifacts.gate_specs[node.id].gate_id !== node.id) throw new Error(`gate spec key mismatch for ${node.id}`);
    }
  }
  if (!Array.isArray(artifacts.viz_spec?.actions_implemented)) throw new Error('viz_spec.actions_implemented missing');
}

module.exports = {
  ACTIVE_READER_POLICY,
  VIDEO_EXPLAINER_POLICY,
  orderConcepts,
  buildSocraticArtifacts,
  planAgenticLesson,
  compileAgentPlan,
  planLessonFromConceptGraph,
};
