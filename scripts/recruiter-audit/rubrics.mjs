export const EMPLOYER_RUBRICS = {
  anthropic: {
    label: 'Anthropic',
    dimensions: [
      {
        id: 'safety_and_restraint',
        label: 'Safety, restraint, and responsible autonomy',
        weight: 25,
        signals: [
          /\b(?:safety|restraint|responsible|guardrail|permission|authorization)\b/i,
          /\b(?:over-act|destructive action|human control|review before|ask before)\b/i,
          /\b(?:failure|caveat|limitation|uncertainty|robustness)\b/i,
        ],
      },
      {
        id: 'empirical_rigor',
        label: 'Empirical rigor and honest evidence',
        weight: 25,
        signals: [
          /\b(?:evaluation|evals?|benchmark|scenario|test harness)\b/i,
          /\b(?:method|measured|evidence|sample|data|field report)\b/i,
          /\b(?:cannot establish|does not establish|corrected|correction|confidence)\b/i,
        ],
      },
      {
        id: 'technical_depth',
        label: 'Frontier-system technical depth',
        weight: 25,
        signals: [
          /\b(?:agentic|AI agent|tool pipeline|orchestration|multi-turn)\b/i,
          /\b(?:multimodal|voice|photo|Whisper|knowledge graph)\b/i,
          /\b(?:production|latency|real-time|architecture|full stack)\b/i,
        ],
      },
      {
        id: 'human_benefit',
        label: 'Human benefit and thoughtful product judgment',
        weight: 25,
        signals: [
          /\b(?:family|household|people|human|community|user)\b/i,
          /\b(?:judgment|trust|dignity|adapt|mental load)\b/i,
          /\b(?:product strategy|Group Product Manager|Group PM|founder)\b/i,
        ],
      },
    ],
  },
  openai: {
    label: 'OpenAI',
    dimensions: [
      {
        id: 'shipped_ai_products',
        label: 'Shipped production AI products',
        weight: 25,
        signals: [
          /\b(?:production|shipped|built|launched|real families|real users)\b/i,
          /\b(?:AI assistant|AI agent|agentic|LLM)\b/i,
          /\b(?:iPhone|Android|web|cross-platform|full stack)\b/i,
        ],
      },
      {
        id: 'agents_and_multimodality',
        label: 'Agents and multimodal systems',
        weight: 20,
        signals: [
          /\b(?:tool pipeline|tool use|orchestration|agent)\b/i,
          /\b(?:multimodal|voice|photo|text|Whisper)\b/i,
          /\b(?:calendar|list|reminder|action|workflow)\b/i,
        ],
      },
      {
        id: 'evaluation_and_reliability',
        label: 'Evaluation and reliability',
        weight: 20,
        signals: [
          /\b(?:evaluation|evals?|benchmark|scenario|test)\b/i,
          /\b(?:safety|reliability|robustness|failure|restraint)\b/i,
          /\b(?:measured|method|data|correction|caveat)\b/i,
        ],
      },
      {
        id: 'zero_to_one',
        label: 'Zero-to-one execution and velocity',
        weight: 20,
        signals: [
          /\b(?:0[-→to ]+1|zero[- ]to[- ]one|founder|co-founded|startup)\b/i,
          /\b(?:solo|built|prototype|ship|launch)\b/i,
          /\b(?:product judgment|distribution|support|customer)\b/i,
        ],
      },
      {
        id: 'product_leadership',
        label: 'Senior product leadership',
        weight: 15,
        signals: [
          /\b(?:Group Product Manager|Group PM|product leader|product direction)\b/i,
          /\b(?:strategy|roadmap|cross-functional|engineering|design|data science)\b/i,
          /\b(?:outcome|impact|adoption|growth|user research)\b/i,
        ],
      },
    ],
  },
  google: {
    label: 'Google',
    dimensions: [
      {
        id: 'scaled_product_leadership',
        label: 'Scaled product leadership',
        weight: 25,
        signals: [
          /\b(?:Group Product Manager|Group PM|product direction|product strategy)\b/i,
          /\b(?:cross-functional|engineering|design|data science|stakeholder)\b/i,
          /\b(?:scale|millions|enterprise|platform|ecosystem)\b/i,
        ],
      },
      {
        id: 'ai_ml_depth',
        label: 'AI/ML product depth',
        weight: 25,
        signals: [
          /\b(?:AI\/ML|machine learning|LLM|generative AI)\b/i,
          /\b(?:agentic|AI agent|evaluation|model|multimodal)\b/i,
          /\b(?:fraud|spend controls|knowledge graph|orchestration)\b/i,
        ],
      },
      {
        id: 'measurable_user_impact',
        label: 'Measurable user impact',
        weight: 20,
        signals: [
          /\b(?:user research|customer|family|household|user)\b/i,
          /\b(?:measured|sessions|adoption|growth|impact|outcome)\b/i,
          /\b(?:GA4|analytics|experiment|benchmark|data)\b/i,
        ],
      },
      {
        id: 'platform_thinking',
        label: 'Platform and systems thinking',
        weight: 15,
        signals: [
          /\b(?:platform|pipeline|architecture|system|infrastructure)\b/i,
          /\b(?:iPhone|Android|web|cross-platform|API)\b/i,
          /\b(?:real-time|sync|latency|automation)\b/i,
        ],
      },
      {
        id: 'clear_communication',
        label: 'Clear technical communication',
        weight: 15,
        signals: [
          /\b(?:field report|essay|published|research|methods)\b/i,
          /\b(?:caveat|limitation|correction|what .* cannot)\b/i,
          /\b(?:writer|writing|explain|public ledger|transparent)\b/i,
        ],
      },
    ],
  },
};

export const AI_SLOP_PATTERNS = [
  { id: 'passionate-about', pattern: /\bpassionate about\b/i, label: '"passionate about" without evidence' },
  { id: 'results-driven', pattern: /\bresults[- ]driven\b/i, label: 'generic "results-driven" claim' },
  { id: 'dynamic-professional', pattern: /\bdynamic professional\b/i, label: 'generic "dynamic professional" claim' },
  { id: 'thought-leader', pattern: /\bthought leader\b/i, label: 'self-applied "thought leader" label' },
  { id: 'cutting-edge', pattern: /\bcutting[- ]edge\b/i, label: 'generic "cutting-edge" claim' },
  { id: 'innovative-solutions', pattern: /\binnovative solutions?\b/i, label: 'generic "innovative solutions" claim' },
  { id: 'game-changing', pattern: /\bgame[- ]chang(?:ing|er)\b/i, label: 'generic "game-changing" claim' },
  { id: 'unlock-power', pattern: /\bunlock(?:ing|s|ed)? the power of\b/i, label: '"unlock the power of" trope' },
  { id: 'ever-evolving', pattern: /\bever[- ]evolving\b/i, label: '"ever-evolving" filler' },
  { id: 'fast-paced-world', pattern: /\bin today'?s fast[- ]paced (?:world|landscape)\b/i, label: 'generic fast-paced-world opening' },
  { id: 'navigate-complexities', pattern: /\bnavigat(?:e|ing) the complexities of\b/i, label: '"navigate the complexities" trope' },
  { id: 'not-just-but', pattern: /\bnot just\b.{0,100}\bbut (?:also )?\b/i, label: 'repetitive "not just ... but" construction' },
];
