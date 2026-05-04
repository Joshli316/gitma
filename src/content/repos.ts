export interface RepoCard {
  owner: string;
  name: string;
  stars: number;
  url: string;
  blurbEn: string;
  blurbZh: string;
}

export const TOP_REPOS: RepoCard[] = [
  {
    owner: "anthropics",
    name: "claude-code",
    stars: 120000,
    url: "https://github.com/anthropics/claude-code",
    blurbEn: "Official CLI repo — issue tracker and source of truth.",
    blurbZh: "官方 CLI 仓库 —— 源码与 issue tracker。",
  },
  {
    owner: "anthropics",
    name: "skills",
    stars: 128000,
    url: "https://github.com/anthropics/skills",
    blurbEn: "Anthropic's official Agent Skills repo — the reference implementation.",
    blurbZh: "Anthropic 官方 Agent Skills 仓库 —— 参考实现。",
  },
  {
    owner: "anthropics",
    name: "claude-cookbooks",
    stars: 42000,
    url: "https://github.com/anthropics/claude-cookbooks",
    blurbEn: "Official notebooks & recipes — the best place to learn patterns.",
    blurbZh: "官方笔记本与示例合集 —— 学习用法的最佳起点。",
  },
  {
    owner: "anthropics",
    name: "courses",
    stars: 21000,
    url: "https://github.com/anthropics/courses",
    blurbEn: "Anthropic's structured educational courses — beginner-friendly.",
    blurbZh: "Anthropic 官方教程 —— 适合新手入门。",
  },
  {
    owner: "obra",
    name: "superpowers",
    stars: 178000,
    url: "https://github.com/obra/superpowers",
    blurbEn: "Most popular community framework, now in the official marketplace.",
    blurbZh: "最受欢迎的社区框架，已进入官方插件市场。",
  },
  {
    owner: "hesreallyhim",
    name: "awesome-claude-code",
    stars: 42000,
    url: "https://github.com/hesreallyhim/awesome-claude-code",
    blurbEn: "Canonical curated discovery hub — start here to find more.",
    blurbZh: "最权威的资源汇总 —— 从这里发现更多。",
  },
  {
    owner: "wshobson",
    name: "agents",
    stars: 35000,
    url: "https://github.com/wshobson/agents",
    blurbEn: "Top community subagents + multi-agent orchestration.",
    blurbZh: "顶级社区 subagent 合集，支持多智能体编排。",
  },
  {
    owner: "VoltAgent",
    name: "awesome-claude-code-subagents",
    stars: 19000,
    url: "https://github.com/VoltAgent/awesome-claude-code-subagents",
    blurbEn: "100+ specialized subagents organized by use case.",
    blurbZh: "100+ 专项 subagent，按用途分类。",
  },
  {
    owner: "davila7",
    name: "claude-code-templates",
    stars: 27000,
    url: "https://github.com/davila7/claude-code-templates",
    blurbEn: "CLI to configure and monitor your Claude Code setup.",
    blurbZh: "配置与监控 Claude Code 的命令行工具。",
  },
  {
    owner: "yamadashy",
    name: "repomix",
    stars: 24000,
    url: "https://github.com/yamadashy/repomix",
    blurbEn: "Packs your whole repo into one AI-friendly file.",
    blurbZh: "把整个仓库打包成单文件喂给 AI。",
  },
];

export function formatStars(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return k >= 100 ? `${Math.round(k)}K` : `${k.toFixed(k < 10 ? 1 : 0)}K`;
  }
  return String(n);
}
